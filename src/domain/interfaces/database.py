from abc import ABC, abstractmethod
from typing import List, Optional
from domain.model_entities.database import (
    Admin,
    Store,
    Service,
    Payment
)

class AdminRepositoryInterface(ABC):
    @abstractmethod
    async def save(self, admin: Admin) -> Admin:
        pass
    
    @abstractmethod 
    async def find_by_name(self, admin_name: str) -> Admin:
        pass

    @abstractmethod
    async def get_all(self) -> List[Admin]:
        pass

    # @abstractmethod
    # async def get_by_id(self, id: str) -> Admin:
    #     pass

class StoreRepositoryInterface(ABC):
    @abstractmethod
    async def save(self, store: Store) -> Store:
        pass

    @abstractmethod 
    async def find_by_name(self, store_name: str) -> Store:
        pass

    @abstractmethod 
    async def find_by_id(self, store_id: str) -> Store:
        pass

    @abstractmethod
    async def get_all(self) -> List[Store]:
        pass
    
    @abstractmethod
    async def update_by_id(self, store_id: str, update_data: dict) -> Store:
        pass

    @abstractmethod
    async def delete_by_name(self, store_name: str) -> Optional[Store]:
        pass


class ServiceRepositoryInterface(ABC):
    @abstractmethod
    async def save(self, service: Store) -> Service:
        pass

    # @abstractmethod 
    # async def find_by_name(self, service_name: str) -> Service:
    #     pass

    @abstractmethod 
    async def find_by_id(self, service_id: str) -> Service:
        pass

    @abstractmethod
    async def get_all(self, store_id: str) -> List[Service]:
        pass
    
    @abstractmethod
    async def update_by_id(self, service_id: str, update_data: dict) -> Service:
        pass

    # @abstractmethod
    # async def delete_by_name(self, service_name: str) -> Optional[Service]:
    #     pass

    @abstractmethod
    async def delete_by_id(self, service_id: str) -> Optional[Service]:
        pass

class PaymentRepositoryInterface(ABC):
    @abstractmethod
    async def save(self, payment: Payment) -> Payment:
        pass

    @abstractmethod 
    async def find_by_id(self, payment_id: str) -> Payment:
        pass

    @abstractmethod
    async def get_all(self) -> List[Payment]:
        pass
    
    @abstractmethod
    async def update_status_by_id(self, payment_id: str, update_data: dict) -> Payment: # logic ไม่อนุญาตให้แก้ทุกอย่าง ยกเว้น status
        pass

    @abstractmethod
    async def is_expired(self, payment_id: str) -> bool:
        pass

    #หมายเหตุ: คิดว่าไม่ควร มี Delete เพราะมันต้องเก็บหลักฐานจ่ายเงิน