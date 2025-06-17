from abc import ABC, abstractmethod
from typing import List
from domain.model_entities.database import (
    Admin,
    Command
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

class CommandRepositoryInterface(ABC):
    @abstractmethod
    async def save(self, command: Command) -> Command:
        pass

    @abstractmethod
    async def find_by_admin_id(self, admin_id: str) -> Command:
        pass

    @abstractmethod
    async def get_all(self) -> List[Command]:
        pass
    async def delete_all_admin_command(self, admin_id: str) -> List[Command]:
        pass

    # @abstractmethod
    # async def get_by_admin_id(self, id: str) -> Command:
    #     pass