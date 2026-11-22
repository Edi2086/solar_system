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
