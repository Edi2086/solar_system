"""Check the browser routes and protect the existing solar-system file."""
import hashlib
from pathlib import Path

from django.conf import settings
from django.test import SimpleTestCase
from django.urls import reverse


class StudyHubTests(SimpleTestCase):
    def test_home_uses_template_and_links_to_science(self):
        response = self.client.get(reverse("learning:home"))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "learning/home.html")
        self.assertContains(response, "Study Hub")
        self.assertContains(response, f'href="{reverse("learning:science")}"')
        self.assertContains(response, "Math")
        self.assertContains(response, "English")

    def test_science_has_welcome_exploration_and_home_links(self):
        response = self.client.get(reverse("learning:science"))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "learning/science.html")
        self.assertContains(response, "Welcome to Science Study")
        self.assertContains(response, f'href="{reverse("learning:solar_system")}"')
        self.assertContains(response, f'href="{reverse("learning:home")}"')

    def test_solar_system_serves_the_existing_file(self):
        original = Path(settings.BASE_DIR) / "solar-system.html"
        response = self.client.get(reverse("learning:solar_system"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response["Content-Type"], "text/html; charset=utf-8")
        served = hashlib.sha256()
        try:
            for chunk in response.streaming_content:
                served.update(chunk)
        finally:
            response.close()
        self.assertEqual(served.hexdigest(), hashlib.sha256(original.read_bytes()).hexdigest())


class StaticDeploymentTests(SimpleTestCase):
    def test_pages_use_the_same_absolute_stylesheet_url_without_debug(self):
        # Django's development server must not be required to build these URLs.
        from django.test import override_settings

        with override_settings(DEBUG=False):
            for name in ("learning:home", "learning:science"):
                with self.subTest(page=name):
                    response = self.client.get(reverse(name))
                    self.assertContains(
                        response,
                        'href="/static/learning/study-hub.css"',
                    )

    def test_collectstatic_packages_the_study_hub_and_admin_styles(self):
        from tempfile import TemporaryDirectory
        from django.core.management import call_command
        from django.test import override_settings

        # Run the actual deployment collection step in an isolated directory.
        with TemporaryDirectory(prefix="study-hub-static-") as directory:
            with override_settings(STATIC_ROOT=directory, DEBUG=False):
                call_command("collectstatic", interactive=False, verbosity=0)
                collected = Path(directory)
                original = (
                    Path(settings.BASE_DIR)
                    / "learning/static/learning/study-hub.css"
                )
                self.assertEqual(
                    (collected / "learning/study-hub.css").read_bytes(),
                    original.read_bytes(),
                )
                self.assertTrue((collected / "admin/css/base.css").is_file())
