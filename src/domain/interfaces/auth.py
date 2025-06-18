from abc import ABC, abstractmethod

class AuthInterface(ABC):
    @abstractmethod
    async def get_jwt_secret(self) -> str:
        pass