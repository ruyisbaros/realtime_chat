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


async def upload_cloud(file: str, folder_name: str = "LLM") -> str:
    """
    Uploads a file to Cloudinary and places it in a specified folder.

    Args:
        file (str): The file path or bytes to upload.
        folder_name (str): The folder in Cloudinary where the file will be stored.

    Returns:
        str: The URL of the uploaded file.

    Raises:
        Exception: If the upload fails.
    """
    try:
        # Upload to Cloudinary
        response = cloudinary.uploader.upload(
            file,
            folder=folder_name,  # Folder where the image will be stored
            resource_type="image"  # Specify it's an image
        )
        # Return the URL of the uploaded image
        image_url = response.get("secure_url")
        image_public_id = response.get("public_id")
        return image_url, image_public_id
    except Exception as e:
        print(f"Cloudinary upload failed: {e}")
        raise Exception("Failed to upload the file to Cloudinary")
# Delete an image


def delete_cloud(public_id):
    cloudinary.uploader.destroy(public_id)
