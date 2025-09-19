from fastapi import FastAPI, BackgroundTasks
from .models import GenerationRequest
from .generator import generate_video
from .cloudinary_utils import upload_to_cloudinary
from .memory_monitor import get_free_vram_gb
from .db import collection
import time
import threading

app = FastAPI()
lock = threading.Lock()

def handle_request(prompt, negative_prompt):
    with lock:
        while get_free_vram_gb() < 25.0:
            time.sleep(5)
        filename = generate_video(prompt, negative_prompt)
        cloud_url = upload_to_cloudinary(filename)
        collection.insert_one({
            "prompt": prompt,
            "negative_prompt": negative_prompt,
            "video_url": cloud_url
        })
        return cloud_url

@app.post("/generate")
def generate(request: GenerationRequest, background_tasks: BackgroundTasks):
    background_tasks.add_task(handle_request, request.prompt, request.negative_prompt)
    return {"message": "Video generation started. You will find the result in the database."}


@app.get("/status")
def status():
    free_vram = get_free_vram_gb()
    return {"free_vram_gb": free_vram}