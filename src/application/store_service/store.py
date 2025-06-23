from domain.interfaces.database import (
    StoreRepositoryInterface,
)

from domain.model_entities.database import (
    Store,
)

from typing import Optional, List

from uuid import uuid4

class StoreService:
    def __init__(self, store_repo: StoreRepositoryInterface):
        self.store_repo = store_repo

    async def create_store(self,store_name: str, description: str) -> Optional[Store]:
        if await self.store_repo.find_by_name(store_name):
            print("Store ซ้ำข้ามขั้นตอนนี้")
            raise ValueError("Store already exists.")
        
        id = str(uuid4())
        new_store = Store(id=id, store_name=store_name, description=description)
        return await self.store_repo.save(new_store)

    async def get_stores(self) -> List[Store]:
        stores = await self.store_repo.get_all()

        return [store.to_dict() for store in stores]
    
    async def get_store_by_id(self, id: str) -> Optional[Store]:
        store = await self.store_repo.find_by_id(id)
        return store
    
    async def get_store_by_name(self, store_name: str) -> Optional[Store]:
        store = await self.store_repo.find_by_name(store_name)
        return store
    
    async def edit_by_id(self, store_id:str, update_data:dict) -> Optional[Store]:
        store = await self.store_repo.update_by_id(store_id, update_data)
        return store
    async def remove_by_name(self, store_name: str) -> Optional[Store]:
        store = await self.store_repo.delete_by_name(store_name)
        return store