from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete
from domain.model_entities.database import Admin, Store#, Command
from typing import List, Optional
from domain.interfaces.database import AdminRepositoryInterface, StoreRepositoryInterface#, CommandRepositoryInterface

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

# class CommandRepositoryAdapter(CommandRepositoryInterface):
#     def __init__(self, db: AsyncSession):
#         self.db = db

#     async def save(self, command: Command) -> Command:
#         try:
#             self.db.add(command)
#             await self.db.commit()
#             await self.db.refresh(command)
#             return command
#         except Exception as e:
#             await self.db.rollback()
#             raise e
        
#     async def find_by_admin_id(self, admin_id: str) -> Command:
#         result = await self.db.execute(select(Command).filter(Command.admin_id == admin_id))
#         return result.scalars().first()
    
#     async def get_all(self) -> List[Command]:
#         result = await self.db.execute(select(Command))
#         return result.scalars().all()
    
#     async def delete_all_admin_command(self, admin_id: str) -> List[Command]:
#         try:
#             await self.db.execute(delete(Command).where(Command.admin_id == admin_id))
#             await self.db.commit()
#         except Exception as e:
#             await self.db.rollback()
#             raise e