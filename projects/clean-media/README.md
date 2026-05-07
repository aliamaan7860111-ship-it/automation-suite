# Clean Media

Two-part utility for stripping EXIF metadata + normalizing product images before they're posted publicly.

## Files

- [clean_media.py](clean_media.py) — CLI; walks a directory, rewrites images without metadata
- [clean_media_web.py](clean_media_web.py) — Flask UI for one-off uploads

## Run (CLI)

```bash
python clean_media.py /path/to/media/folder
```

## Run (Web)

```bash
python clean_media_web.py
# open http://localhost:5000
```

## Stack

Python 3.12 · Pillow · Flask.
