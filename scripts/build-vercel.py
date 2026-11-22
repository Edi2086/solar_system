"""Build the enhanced standalone solar system for Vercel."""
from pathlib import Path
import runpy
import shutil

root = Path(__file__).resolve().parents[1]
runpy.run_path(str(root / "scripts" / "make-standalone.py"), run_name="__main__")
output = root / "site-build"
output.mkdir(exist_ok=True)
shutil.copyfile(root / "solar-system.html", output / "index.html")
print("Vercel output ready: site-build/index.html")
