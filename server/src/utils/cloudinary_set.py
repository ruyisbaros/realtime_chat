import os
import cloudinary
import cloudinary.uploader
from cloudinary.utils import cloudinary_url
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from.env file

# Configuration
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_USERNAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET')
)


def upload_cloud(public_id, img_url):
    upload_result = cloudinary.uploader.upload(
        img_url,
        public_id=public_id,
    )
    return upload_result
# Delete an image


def delete_cloud(public_id):
    cloudinary.uploader.destroy(public_id)
