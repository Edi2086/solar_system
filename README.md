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
