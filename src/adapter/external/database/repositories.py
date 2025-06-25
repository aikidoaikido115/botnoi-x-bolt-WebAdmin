from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import delete
from sqlalchemy import and_
from domain.model_entities.database import (
    Admin,
    Store,
    Service,
    Payment,
    User,
    Booking,
    BookingService
)
from typing import List, Optional
from domain.interfaces.database import (
    AdminRepositoryInterface,
    StoreRepositoryInterface,
    ServiceRepositoryInterface,
    PaymentRepositoryInterface,
    UserRepositoryInterface,
    BookingRepositoryInterface,
    BookingServiceRepositoryInterface
)

from datetime import datetime, timedelta

class AdminRepositoryAdapter(AdminRepositoryInterface):
    def __init__(self, db: AsyncSession):
        self.db = db

    async def save(self, admin: Admin) -> Admin:
        try:
            self.db.add(admin)
            await self.db.commit()
            await self.db.refresh(admin)
            return admin
        except Exception as e:
            await self.db.rollback()
            raise e

    async def find_by_name(self, admin_name: str) -> Admin:
        result = await self.db.execute(select(Admin).filter(Admin.admin_name == admin_name))
        return result.scalars().first()
    
    async def find_store_id_of_admin(self, admin_name: str) -> str:
        result = await self.db.execute(select(Admin.store_id).filter(Admin.admin_name == admin_name))
        return result.scalars().first()
    
    async def get_all(self) -> List[Admin]:
        result = await self.db.execute(select(Admin))
        return result.scalars().all()

class StoreRepositoryAdapter(StoreRepositoryInterface):
    def __init__(self, db: AsyncSession):
        self.db = db

    async def save(self, store: Store) -> Store:
        try:
            self.db.add(store)
            await self.db.commit()
            await self.db.refresh(store)
            return store
        except Exception as e:
            await self.db.rollback()
            raise e
    
    async def find_by_name(self, store_name: str) -> Store:
        result = await self.db.execute(select(Store).filter(Store.store_name == store_name))
        return result.scalars().first()
    
    async def find_by_id(self, store_id: str) -> Store:
        result = await self.db.execute(select(Store).filter(Store.id == store_id))
        return result.scalars().first()
    
    async def get_all(self) -> List[Store]:
        result = await self.db.execute(select(Store))
        return result.scalars().all()
    
    async def update_by_id(self, store_id: str, update_data: dict) -> Store:
        try:
            result = await self.db.execute(select(Store).filter(Store.id == store_id))
            store = result.scalars().first()
            if not store:
                raise ValueError("Store not found")

            for key, value in update_data.items():
                setattr(store, key, value) #อัพเดท

            await self.db.commit()
            await self.db.refresh(store)
            return store
        except Exception as e:
            await self.db.rollback()
            raise e
        
    async def delete_by_name(self, store_name: str) -> Optional[Store]:
        try:
            result = await self.db.execute(
                select(Store).filter(Store.store_name == store_name)
            )
            store = result.scalars().first()

            if not store:
                return None  # ไม่มีให้ลบ

            await self.db.delete(store)
            await self.db.commit()

            return store
        except Exception as e:
            await self.db.rollback()
            raise e

class ServiceRepositoryAdapter(ServiceRepositoryInterface):
    def __init__(self, db: AsyncSession):
        self.db = db

    async def save(self, service: Service) -> Service:
        try:
            self.db.add(service)
            await self.db.commit()
            await self.db.refresh(service)
            return service
        except Exception as e:
            await self.db.rollback()
            raise e
    
    async def find_by_id(self, service_id: str) -> Service:
        result = await self.db.execute(select(Service).filter(Service.id == service_id))
        return result.scalars().first()
    
    async def find_services_by_booking_id(self, booking_id: str) -> List[Service]:
        stmt = (
            select(BookingService)
            .options(selectinload(BookingService.service))
            .where(BookingService.booking_id == booking_id)
        )
        result = await self.db.execute(stmt)
        booking_services = result.scalars().all()

        return [bs.service for bs in booking_services]
    
    async def find_services_id_by_title(self, title: str) -> dict:
        stmt = (
            select(Service.id)
            .where(Service.title == title)
        )
        result = await self.db.execute(stmt)
        # service_ids = result.scalars().all()

        # return {
        #     "service_id":[service_id for service_id in service_ids]
        # }

        service_id = result.scalars().first()

        return {
            "service_id":service_id
        }
    
    async def get_all(self, store_id: str) -> List[Service]:
        result = await self.db.execute(select(Service).where(Service.store_id == store_id))
        return result.scalars().all()
    
    async def update_by_id(self, service_id: str, update_data: dict) -> Service:
        try:
            result = await self.db.execute(select(Service).filter(Service.id == service_id))
            service = result.scalars().first()
            if not service:
                raise ValueError("Service not found")

            for key, value in update_data.items():
                setattr(service, key, value) #อัพเดท

            await self.db.commit()
            await self.db.refresh(service)
            return service
        except Exception as e:
            await self.db.rollback()
            raise e
        
    async def delete_by_id(self, service_id: str) -> Optional[Service]:
        try:
            result = await self.db.execute(
                select(Service).filter(Service.id == service_id)
            )
            service = result.scalars().first()

            if not service:
                return None  # ไม่มีให้ลบ

            await self.db.delete(service)
            await self.db.commit()

            return service
        except Exception as e:
            await self.db.rollback()
            raise e
        
class PaymentRepositoryAdapter(PaymentRepositoryInterface):
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def save(self, payment: Payment) -> Payment:
        try:
            self.db.add(payment)
            await self.db.commit()
            await self.db.refresh(payment)
            return payment
        except Exception as e:
            await self.db.rollback()
            raise e
        
    async def find_by_id(self, payment_id: str) -> Payment:
        result = await self.db.execute(select(Payment).filter(Payment.id == payment_id))
        return result.scalars().first()
    
    async def get_all(self) -> List[Payment]:
        result = await self.db.execute(select(Payment))
        return result.scalars().all()
    
    async def update_status_by_id(self, payment_id: str, update_data: dict) -> Payment:
        try:
            result = await self.db.execute(select(Payment).filter(Payment.id == payment_id))
            payment = result.scalars().first()
            if not payment:
                raise ValueError("Payment not found")

            for key, value in update_data.items():
                setattr(payment, key, value) #อัพเดท

            await self.db.commit()
            await self.db.refresh(payment)
            return payment
        except Exception as e:
            await self.db.rollback()
            raise e
        
    async def is_expired(self, payment_id: str) -> bool:
        try:
            result = await self.db.execute(select(Payment).filter(Payment.id == payment_id))
            payment = result.scalars().first()
            if not payment:
                raise ValueError("Payment not found")
            
            now = datetime.now()
            # created_at = datetime.fromisoformat(payment.created_at)

            return now >= payment.created_at + timedelta(minutes=2.00)

        except Exception as e:
            await self.db.rollback()
            raise e

class UserRepositoryAdapter(UserRepositoryInterface):
    def __init__(self, db: AsyncSession):
        self.db = db

    async def save(self, user: User) -> User:
        try:
            self.db.add(user)
            await self.db.commit()
            await self.db.refresh(user)
            return user
        except Exception as e:
            await self.db.rollback()
            raise e

    async def find_by_id(self, user_id: str) -> User:
        result = await self.db.execute(select(User).filter(User.id == user_id))
        return result.scalars().first()
    
    async def get_all(self) -> List[User]:
        result = await self.db.execute(select(User))
        return result.scalars().all()
    

class BookingRepositoryAdapter(BookingRepositoryInterface):
    def __init__(self, db: AsyncSession):
        self.db = db

    async def save(self, booking: Booking) -> Booking:
        try:
            self.db.add(booking)
            await self.db.commit()
            await self.db.refresh(booking)
            return booking
        except Exception as e:
            await self.db.rollback()
            raise e
    
    async def find_by_id(self, booking_id: str) -> Booking:
        result = await self.db.execute(select(Booking).filter(Booking.id == booking_id))
        return result.scalars().first()
    
    async def find_by_store_id(self, store_id: str) -> list:
        result = await self.db.execute(
            select(Booking)
            # เริ่มต้นด้วยการ Join ไปยัง Service ผ่าน BookingService เพื่อให้กรองด้วย store_id ได้
            .join(BookingService, Booking.id == BookingService.booking_id)
            .join(Service, BookingService.service_id == Service.id)
            .filter(Service.store_id == store_id)

            # โหลดความสัมพันธ์ของ Booking
            .options(
                selectinload(Booking.users), # โหลดข้อมูล User ที่เกี่ยวข้องกับ Booking
                # selectinload(Booking.payments), # โหลดข้อมูล Payment ที่เกี่ยวข้องกับ Booking
                selectinload(Booking.booking_services).selectinload(BookingService.service).selectinload(Service.stores)
                # ^ โหลด BookingService -> Service -> Store
                #   ถ้า Service มีความสัมพันธ์กับ Store อยู่แล้ว (ซึ่งมี)
            )
        )
        return result.scalars().unique().all()
    
    async def get_all(self, user_id: str) -> List[Booking]:
        result = await self.db.execute(select(Booking).where(Booking.user_id == user_id))
        return result.scalars().all()
    
    async def update_by_id(self, booking_id: str, update_data: dict) -> Booking:
        try:
            result = await self.db.execute(select(Booking).filter(Booking.id == booking_id))
            booking = result.scalars().first()
            if not booking:
                raise ValueError("Booking not found")

            for key, value in update_data.items():
                setattr(booking, key, value) #อัพเดท

            await self.db.commit()
            await self.db.refresh(booking)
            return booking
        except Exception as e:
            await self.db.rollback()
            raise e
        
    async def delete_by_id(self, booking_id: str) -> Optional[Booking]:
        try:
            result = await self.db.execute(
                select(Booking).filter(Booking.id == booking_id)
            )
            booking = result.scalars().first()

            if not booking:
                return None  # ไม่มีให้ลบ

            await self.db.delete(booking)
            await self.db.commit()

            return booking
        except Exception as e:
            await self.db.rollback()
            raise e

class BookingServiceRepositoryAdapter(BookingServiceRepositoryInterface):
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def save(self, booking_service: BookingService) -> BookingService:
        try:
            self.db.add(booking_service)
            await self.db.commit()
            await self.db.refresh(booking_service)
            return booking_service
        except Exception as e:
            await self.db.rollback()
            raise e
        
    async def find_by_id(self, booking_id: str, service_id: str) -> BookingService:
        result = await self.db.execute(select(BookingService).filter(
                and_(
                    BookingService.booking_id == booking_id,
                    BookingService.service_id == service_id,
                )
            )
        )
        return result.scalars().first()
    
    async def get_all(self) -> List[BookingService]:
        result = await self.db.execute(select(BookingService))
        return result.scalars().all()