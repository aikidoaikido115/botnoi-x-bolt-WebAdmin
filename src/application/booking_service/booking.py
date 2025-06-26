from domain.interfaces.database import (
    BookingRepositoryInterface,
    UserRepositoryInterface,
    BookingServiceRepositoryInterface

)

from domain.model_entities.database import (
    Booking,
    BookingService as BS
)

from typing import Optional, List

from uuid import uuid4

from utils.convert_str_2_date import str_2_date
from utils.get_currecnt_date import my_date_now

class BookingService:
    def __init__(
            self,
            booking_repo,
            user_rero,
            booking_service_repo
        ):
        self.booking_repo = booking_repo
        self.user_repo = user_rero
        self.booking_service_repo = booking_service_repo

    async def create_booking(
            self,
            booking_time: str,
            status: str,
            note: str,

            user_id: str,
            service_id: str

        ) -> Optional[Booking]:
        

        if await self.user_repo.find_by_id(user_id) is None:
            print("ไม่สามารถสร้าง booking หากไม่มี user หรือกรอก user_id ผิด")
            return None


        id = str(uuid4())
        booking_time = str_2_date(booking_time)

        # ห้ามจองตอน อดีต
        if booking_time < my_date_now():
            # print("ไม่สามารถจองย้อนหลังได้")
            raise ValueError("Booking time must not be in the past")

        new_booking = Booking(
            id=id,
            booking_time=booking_time,
            status=status,
            note=note,

            user_id = user_id

        )

        await self.booking_repo.save(new_booking)

        new_booking_service = BS(
            booking_id=id,
            service_id=service_id
        )

        await self.booking_service_repo.save(new_booking_service)

        fetched_booking = await self.booking_repo.find_by_id(id)
        
        return fetched_booking

    async def get_bookings(self, user_id: str) -> List[Booking]:
        if user_id is None:
            raise ValueError("user_id must be provided")
        
        bookings = await self.booking_repo.get_all(user_id)

        return [booking.to_dict() for booking in bookings]
    
    async def get_booking_by_id(self, id: str) -> Optional[Booking]:
        booking = await self.booking_repo.find_by_id(id)
        return booking
    
    async def get_booking_by_store_id(self, store_id: str) -> list:
        appointments = await self.booking_repo.find_by_store_id(store_id)
        return appointments
        
    async def edit_by_id(self, booking_id:str, update_data:dict) -> Optional[Booking]:
        booking = await self.booking_repo.update_by_id(booking_id, update_data)
        return booking
    
    async def remove_by_id(self, booking_id: str):
        try:
            # ลบ BookingService ก่อน
            await self.booking_service_repo.delete_by_booking_id(booking_id)

            # ลบ Booking หลัก
            return await self.booking_repo.delete_by_id(booking_id)
        except Exception as e:
            raise e