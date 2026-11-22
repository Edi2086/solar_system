"""Send learning pages to the learning app; keep admin at its own address."""
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("learning.urls")),
]
