from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete
from domain.model_entities.database import (
    Admin,
    Store,
    Service
)
from typing import List, Optional
from domain.interfaces.database import (
    AdminRepositoryInterface,
    StoreRepositoryInterface,
    ServiceRepositoryInterface
)

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
    
    async def get_all(self) -> List[Service]:
        result = await self.db.execute(select(Service))
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