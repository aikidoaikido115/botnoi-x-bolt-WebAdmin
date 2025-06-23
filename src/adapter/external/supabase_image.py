from domain.interfaces.supabase_image import SupabaseInterface
from supabase import create_client, Client
import os

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_ANON_KEY = os.getenv('SUPABASE_ANON_KEY')
BUCKET_NAME = os.getenv('BUCKET_NAME')
STORAGE_PATH = os.getenv('STORAGE_PATH')

class SupabaseAdapter(SupabaseInterface):

    @classmethod
    async def get_all_env(cls) -> dict:
        return {
            "SUPABASE_URL": SUPABASE_URL,
            "SUPABASE_ANON_KEY": SUPABASE_ANON_KEY,
            "BUCKET_NAME": BUCKET_NAME,
            "STORAGE_PATH": STORAGE_PATH
        }

    async def upload_image(
        self,
        supabase_url: str,
        supabase_anon_key: str,
        bucket_name: str,
        storage_path: str, #ต้องมีชื่อไฟล์ concat มาก่อน
        file_data: bytes,
        file_name: str
        ) -> dict:
        
        supabase: Client = create_client(supabase_url, supabase_anon_key)

        try:
            full_path = storage_path + file_name

            response = supabase.storage.from_(bucket_name).upload(
                full_path,
                file_data,
                {"upsert": "true"}
            )
            print(f"Upload successful: {response}")
            return response # type เป็น dict
        except Exception as e:
            print(f"Upload failed: {e}")
            raise ValueError(e)

        

    async def get_image_url(
        self,
        supabase_url: str,
        supabase_anon_key: str,
        bucket_name: str,
        storage_path: str,
        file_name: str
        ) -> str:

        supabase: Client = create_client(supabase_url, supabase_anon_key)

        full_path = storage_path + file_name
        print("ของ url", full_path)

        public_url = supabase.storage.from_(bucket_name).get_public_url(full_path)

        return public_url