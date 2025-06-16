from abc import ABC, abstractmethod

class LineMessagingInterface(ABC):
    @abstractmethod
    async def send_message(self, reply_token: str, message: str):
        pass