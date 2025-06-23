from abc import ABC, abstractmethod

class SupabaseInterface(ABC):
    @abstractmethod
    async def get_all_env(self) -> dict:
        pass

    @abstractmethod
    async def upload_image(
        self,
        supabase_url: str,
        supabase_anon_key: str,
        bucket_name: str,
        storage_path: str, #ต้องมีชื่อไฟล์ concat มาก่อน
        file_data: bytes,
        file_name: str
        ) -> dict:
        pass

    @abstractmethod
    async def get_image_url(
        self,
        supabase_url: str,
        supabase_anon_key: str,
        bucket_name: str,
        storage_path: str,
        file_name: str
        ) -> str:

        pass