"""Views choose the HTML template to show for each page."""
from django.shortcuts import render


def home(request):
    return render(request, "learning/home.html")


def science(request):
    return render(request, "learning/science.html")


def solar_system(request):
    """Serve the existing self-contained HTML without moving or changing it."""
    from django.conf import settings
    from django.http import FileResponse

    return FileResponse(
        (settings.BASE_DIR / "solar-system.html").open("rb"),
        content_type="text/html; charset=utf-8",
    )
