import cloudinary
import cloudinary.uploader
from .config import CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET

cloudinary.config(
    cloud_name=CLOUDINARY_CLOUD_NAME,
    api_key=CLOUDINARY_API_KEY,
    api_secret=CLOUDINARY_API_SECRET
)

def upload_to_cloudinary(file_path):
    result = cloudinary.uploader.upload_large(file_path, resource_type="video")
    return result.get("secure_url")
