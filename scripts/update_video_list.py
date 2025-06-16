import os
import shutil
import subprocess

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, ".."))

VIDEO_DIR = os.path.join(PROJECT_ROOT, "front/src/screens/unlockedScreen/pages/f1ReplayManagerPage/assets/videos")
THUMBNAIL_DIR = os.path.join(VIDEO_DIR, "thumbnails")
INDEX_FILE_VIDEOS = os.path.join(VIDEO_DIR, "index.ts")
THUMBNAIL_INDEX_FILE = os.path.join(THUMBNAIL_DIR, "index.ts")

VIDEO_EXTENSIONS = {".mp4", ".avi", ".mkv", ".mov", ".webm"}

if os.path.exists(THUMBNAIL_DIR):
    shutil.rmtree(THUMBNAIL_DIR)

os.makedirs(THUMBNAIL_DIR)

video_files = [f for f in os.listdir(VIDEO_DIR) if os.path.splitext(f)[1] in VIDEO_EXTENSIONS]

video_imports = []
for video in video_files:
    video_name = os.path.splitext(video)[0]
    video_imports.append(f'import {video_name} from "./{video}";')

with open(INDEX_FILE_VIDEOS, "w") as f:
    f.write("\n".join(video_imports) + "\n\n")
    f.write('\nimport { Thumbnails } from "./thumbnails";\n\n')
    f.write("const Videos = [\n  " + ",\n  ".join(os.path.splitext(v)[0] for v in video_files) + "\n];\n")
    f.write("export { Videos, Thumbnails };\n")

print("✅ videos/index.ts file updated!")

thumbnail_imports = []
for video in video_files:
    video_path = os.path.join(VIDEO_DIR, video)
    thumbnail_name = os.path.splitext(video)[0] + ".webp"
    thumbnail_path = os.path.join(THUMBNAIL_DIR, thumbnail_name)

    ffmpeg_cmd = [
        "ffmpeg", "-i", video_path, "-ss", "00:00:05", "-vframes", "1",
        "-vf", "scale=320:-1",
        "-q:v", "10", thumbnail_path
    ]

    try:
        subprocess.run(ffmpeg_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        print(f"✅ Thumbnail created: {thumbnail_name}")
        thumbnail_imports.append(f'import {os.path.splitext(video)[0]} from "./{thumbnail_name}";')
    except subprocess.CalledProcessError:
        print(f"❌ Failed to generate thumbnail for {video}")

os.makedirs(os.path.dirname(THUMBNAIL_INDEX_FILE), exist_ok=True)
with open(THUMBNAIL_INDEX_FILE, "w") as f:
    f.write("\n".join(thumbnail_imports) + "\n\n")
    f.write("export const Thumbnails = {\n  " + ",\n  ".join(os.path.splitext(v)[0] for v in video_files) + "\n} as Record<string, string>;\n")

print("✅ thumbnails/index.ts file created!")
