from domain.interfaces.database import (
    UserRepositoryInterface
)

from domain.model_entities.database import (
    User,
)

from typing import Optional, List


class UserService:
    def __init__(
            self,
            user_repo: UserRepositoryInterface
        ):
        self.user_repo = user_repo

    async def create_user(self,user_id: str, user_name: str, tel: str) -> Optional[User]:
        if await self.user_repo.find_by_id(user_id):
            raise ValueError("user_id already exists.") 
        

        new_user = User(id=user_id, user_name=user_name, tel=tel)
        return await self.user_repo.save(new_user)
    
    async def get_user_by_id(self, user_id: str) -> Optional[User]:
        user = await self.user_repo.find_by_id(user_id)
        return user
    
    async def get_users(self) -> List[User]:
        users = await self.user_repo.get_all()

        return [user.to_dict() for user in users]