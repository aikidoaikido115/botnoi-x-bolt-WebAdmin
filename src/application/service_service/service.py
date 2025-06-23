from domain.interfaces.database import (
    ServiceRepositoryInterface,
    StoreRepositoryInterface
)

from domain.model_entities.database import (
    Service,
    Store
)

from typing import Optional, List

from uuid import uuid4

class ServiceService:
    def __init__(
            self,
            service_repo: ServiceRepositoryInterface,
            store_repo: StoreRepositoryInterface
        ):
        self.service_repo = service_repo
        self.store_repo = store_repo

    async def create_service(
            self,
            title: str,
            duration_minutes: int,
            prices: float,
            description: str,

            store_id: str

        ) -> Optional[Service]:
        

        if await self.store_repo.find_by_id(store_id) is None:
            print("ไม่สามารถสร้าง service หากไม่มี store หรือกรอก store_id ผิด")
            return None


        id = str(uuid4())
        new_service = Service(
            id=id,
            title=title,
            duration_minutes=duration_minutes,
            prices=prices,
            description=description,

            store_id = store_id

        )
        
        return await self.service_repo.save(new_service)

    async def get_services(self, store_id: str) -> List[Service]:
        if store_id is None:
            raise ValueError("store_id must be provided")
        
        services = await self.service_repo.get_all(store_id)

        return [service.to_dict() for service in services]
    
    async def get_service_by_id(self, id: str) -> Optional[Service]:
        service = await self.service_repo.find_by_id(id)
        return service
    
    async def edit_by_id(self, service_id:str, update_data:dict) -> Optional[Service]:
        service = await self.service_repo.update_by_id(service_id, update_data)
        return service
    async def remove_by_id(self, service_id: str) -> Optional[Service]:
        service = await self.service_repo.delete_by_id(service_id)
        return service