import sys
from pathlib import Path
from PyInstaller.utils.hooks import collect_all, copy_metadata, get_package_paths

datas, binaries, hiddenimports = [], [], []

for pkg in ("wasmtime", "itkwasm", "ngff_zarr"):
    d, b, h = collect_all(pkg)
    datas += d
    binaries += b
    hiddenimports += h

datas += copy_metadata("numcodecs")

_, wasmtime_dir = get_package_paths("wasmtime")
wasmtime_dir = Path(wasmtime_dir)
for f in wasmtime_dir.rglob("*"):
    if f.is_file() and f.suffix in (".so", ".dylib", ".dll"):
        dest = str(Path("wasmtime") / f.parent.relative_to(wasmtime_dir))
        binaries.append((str(f), dest))

a = Analysis(
    ["src/server/main.py"],
    pathex=["src"],
    binaries=binaries,
    datas=datas,
    hiddenimports=hiddenimports,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name="VolSegStudioServer",
    icon="src/assets/serverIcon.png" if sys.platform in ("win32", "darwin") else None,
    console=True,
)