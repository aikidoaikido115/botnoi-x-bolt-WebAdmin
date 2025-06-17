from domain.interfaces.database import (
    AdminRepositoryInterface,
)

from domain.model_entities.database import (
    Admin,
)

from typing import Optional, List

from uuid import uuid4
from passlib.context import CryptContext

class AdminService:
    def __init__(self, admin_repo: AdminRepositoryInterface):
        self.admin_repo = admin_repo

    async def create_admin(self,email: str, admin_name: str, admin_password: str, store_id: str) -> Optional[Admin]:
        if await self.admin_repo.find_by_name(admin_name):
            print("Admin ซ้ำข้ามขั้นตอนนี้")
            return None
        
        id = str(uuid4())
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        hashed_password = pwd_context.hash(admin_password)
        new_admin = Admin(id=id, email=email, admin_name=admin_name, admin_password=hashed_password, store_id=store_id)
        return await self.admin_repo.save(new_admin)

    async def get_admins(self) -> List[Admin]:
        admins = await self.admin_repo.get_all()

        return [admin.to_dict() for admin in admins]
    
    async def get_admin_by_id(self, id: str) -> Optional[Admin]:
        admin = await self.admin_repo.get_by_id(id)
        return admin