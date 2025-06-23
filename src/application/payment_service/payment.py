from domain.interfaces.database import (
    PaymentRepositoryInterface,
    
)

from domain.interfaces.supabase_image import SupabaseInterface

from domain.model_entities.database import (
    Payment
)

from typing import Optional, List

from uuid import uuid4

from utils.get_currecnt_date import my_date_now

class PaymentService:
    def __init__(
            self,
            payment_repo: PaymentRepositoryInterface,
            supabase_instance: SupabaseInterface
        ):
        self.payment_repo = payment_repo
        self.supabase_instance = supabase_instance

    async def create_payment(
            self,
            amount: float,
            slip: bytes, # เป็น base64 จากนั้นจะกลายเป็น supabase url
            file_name: str, # ต้องรับมาเพิ่ม
            booking_id: str

        ) -> Optional[Payment]:

        id = str(uuid4())

        #base64 to supabase here
        supabase_env_dict = await self.supabase_instance.get_all_env()
        supabase_url = supabase_env_dict["SUPABASE_URL"]
        supabase_anon_key = supabase_env_dict["SUPABASE_ANON_KEY"]
        bucket_name = supabase_env_dict["BUCKET_NAME"]
        storage_path = supabase_env_dict["STORAGE_PATH"]
        
        file_ext = file_name.split(".")[1]
        file_name = f"{uuid4()}.{file_ext}"


        await self.supabase_instance.upload_image(
            supabase_url,
            supabase_anon_key,
            bucket_name,
            storage_path,
            slip, # คือ file_data
            file_name
        )

        image_url = await self.supabase_instance.get_image_url(
            supabase_url,
            supabase_anon_key,
            bucket_name,
            storage_path,
            file_name
        )

        new_payment = Payment(
            id=id,
            amount=amount,
            slip=image_url,

            booking_id = booking_id

        )
        
        return await self.payment_repo.save(new_payment)

    async def get_payments(self) -> List[Payment]:
        payments = await self.payment_repo.get_all()

        return [payment.to_dict() for payment in payments]
    
    async def get_payment_by_id(self, id: str) -> Optional[Payment]:
        payment = await self.payment_repo.find_by_id(id)
        return payment
    
    async def edit_status_by_id(self, payment_id:str, update_data:dict) -> Optional[Payment]:

        print("หมดอายุยัง", await self.payment_repo.is_expired(payment_id))

        if await self.payment_repo.is_expired(payment_id):
            raise ValueError("Payment has expired and cannot be processed.")

        all_key = update_data.keys()
        if set(all_key) != {"payment_id", "payment_status"}:
            raise ValueError("You must update only payment_status")
        
        # ปรับ pait_at อัตโนมัติ
        update_data["paid_at"] = my_date_now()

        payment = await self.payment_repo.update_status_by_id(payment_id, update_data)

        return payment
    
    async def check_expiration(self, payment_id: str) -> Optional[Payment]:

        return await self.payment_repo.is_expired(payment_id)