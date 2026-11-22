# Solar Observatory

An interactive 3D solar system built with Three.js.

Double-click **solar-system.html** to open the complete experience in a browser. Scripts, styles, and textures are embedded; no server or internet connection is required. A browser with WebGL support is needed.

Features include all eight planets orbiting the Sun, detailed surface textures, Earth's clouds and night lights, thin atmospheres, Saturn's rings, Earth's Moon, an asteroid belt, stars and dark nebula clouds, orbital trails, a glowing Sun, planet close-ups, time controls, and a ten-question quiz with explanations.

Sizes, distances, and orbital speeds are compressed for exploration. Positions are illustrative, not a live ephemeris.

## Edit and regenerate

The standalone file is generated from the base files in `dist/` and the enhancements in `scripts/`. After editing those sources, run:

```sh
python3 scripts/make-standalone.py
```

The original base experience in `dist/` can also be served with `python3 -m http.server 8000 --directory dist`. The complete enhanced experience is in the root `solar-system.html` file.

Textures: [Solar System Scope](https://www.solarsystemscope.com/textures/), CC BY 4.0. Rendering: Three.js, MIT license (included in `dist/vendor/THREE-LICENSE.txt`).

## Python and Django environment

Verified on Apple Silicon macOS with Python 3.14.10 and Django 5.2.19. The local `.venv/` folder contains the Python environment and is ignored by Git. Exact package versions are recorded in `requirements.txt`.

To activate the existing environment in Terminal (zsh):

```sh
cd /Users/edisonw/Project/solar_system
source .venv/bin/activate
python --version
python -m django --version
```

Use `deactivate` to leave the environment. Activate it again whenever you open a new terminal.

To recreate the environment after cloning this repository, install Python 3.14.10, then run these commands from the repository folder:

```sh
python3.14 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
```

Django installation was verified with its system checks, a rendered page returning HTTP 200 through Django's test client, and an in-memory SQLite query. The Study Hub Django project described below uses this environment. The standalone HTML files still open independently.

## Run Study Hub locally

Study Hub is the general home page. Its Science button opens Science Study, which links to the original `solar-system.html` in a new tab. Math and English are shown as future subjects.

In Terminal, run:

```sh
cd /Users/edisonw/Project/solar_system
source .venv/bin/activate
python manage.py migrate
python manage.py runserver 127.0.0.1:8000
```

Keep that Terminal window open while using the site. Open these addresses in Safari or Chrome:

- Study Hub: http://127.0.0.1:8000/
- Science Study: http://127.0.0.1:8000/science/
- Existing 3D solar system: http://127.0.0.1:8000/science/solar-system/

Press **Control+C** in Terminal to stop the server. If a server is already running on port 8000, use its Terminal window or stop it before starting another one. This is a local development server for your computer.

After cloning or recreating `.venv`, install packages with `python -m pip install -r requirements.txt` before the commands above.

### The Django words and folders

- **Project — `config/`:** settings and the main list of website addresses.
- **App — `learning/`:** a related set of features; here, your learning pages.
- **URL — `learning/urls.py`:** maps an address such as `/science/` to a view. `config/urls.py` sends the learning addresses here.
- **View — `learning/views.py`:** a Python function that answers a browser request and chooses a template.
- **Template — `learning/templates/learning/`:** HTML with Django tags. `base.html` is the shared layout; `home.html` and `science.html` fill it in.
- **Static files — `learning/static/learning/study-hub.css`:** the stylesheet controlling colors, spacing, and layout.
- **Migration:** an instruction that creates or updates database tables. `python manage.py migrate` applies Django's built-in migrations to the local `db.sqlite3` file. The current learning pages do not need their own tables.
- **`manage.py`:** runs project commands, including the local server and tests.

A request follows this path: browser address → `config/urls.py` → `learning/urls.py` → `learning/views.py` → HTML template.

### Adding another subject later

For Math or English, add a view in `learning/views.py`, a named path in `learning/urls.py`, and a template extending `learning/base.html`. Then replace its coming-soon text on the home page with a link using `{% url 'learning:math' %}` or the matching name. Use the Science files as a working example.

### Check your changes

```sh
python manage.py check
python manage.py test learning
```

The tests check the home page, Science navigation, and that the solar-system route returns exactly the existing file. The solar-system HTML and `dist/` assets were not moved or modified by this Django setup. Python caches, the local database, and `.venv/` are ignored by Git.

## Deploy Study Hub to Vercel

The root `vercel.json` selects Vercel's **Django** integration. The old standalone solar-system build command and `site-build` output directory are no longer used for this deployment. The standalone HTML remains available through Science Study and can still be opened independently.

**Static files** are the CSS, JavaScript, and images that style a page. In `config/settings.py`, `STATIC_URL = '/static/'` gives these files a consistent browser address, and `STATIC_ROOT = BASE_DIR / 'staticfiles'` defines a collection folder. Vercel automatically runs Django's `collectstatic` command and serves the collected files through its CDN. The generated `staticfiles/` folder is ignored by Git; the original stylesheet stays in `learning/static/learning/`.

In the Vercel project's Build and Deployment settings:

1. Use the repository root as the Root Directory (the folder containing `manage.py`).
2. Use the **Django** framework preset. Leave the Build Command and Output Directory at their framework defaults; do not use `scripts/build-vercel.py` or `site-build` for Study Hub.
3. Deploy the updated commit. The build logs should show static files being collected.
4. Open `/static/learning/study-hub.css` on your deployed domain. It should return CSS, not a 404 page. Then refresh the home and Science pages.

To check static-file collection locally:

```sh
source .venv/bin/activate
python manage.py collectstatic --noinput
python manage.py test learning
```

The original `scripts/build-vercel.py` is kept for the separate static solar-system export; it is not the Django deployment build.

Reference: https://vercel.com/docs/frameworks/full-stack/django#serving-static-assets
