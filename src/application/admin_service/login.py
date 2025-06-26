import jwt
from datetime import datetime, timedelta ,timezone

from domain.interfaces.database import AdminRepositoryInterface
from domain.model_entities.database import Admin

from domain.interfaces.auth import AuthInterface

from typing import Optional
from passlib.context import CryptContext
import os

class LoginService:
    def __init__(self, admin_repo: AdminRepositoryInterface, jwt_secret: AuthInterface, jwt_algorithm: str = "HS256"):
        self.admin_repo = admin_repo
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        self.jwt_secret = jwt_secret # secret key ENV.
        self.jwt_algorithm = jwt_algorithm

    async def login(self, admin_name: str, admin_password: str) -> Optional[str]:
        admin = await self.admin_repo.find_by_name(admin_name)
        if not admin:
            print("ไม่พบชื่อ Admin")
            raise ValueError("Admin not found")
        
        if not self.pwd_context.verify(admin_password, admin.admin_password):###
            print("รหัสผ่านไม่ถูกต้อง")
            raise ValueError("Incorrect Admin_name or Password")
        
        # สร้าง payload สำหรับ JWT
        payload = {
            "sub": admin.id,  
            "name": admin.admin_name,
            "exp": datetime.now(timezone.utc) + timedelta(hours=1), # เวลาหมดอายุ
            "iat": datetime.now(timezone.utc), #  เวลาที่สร้าง
        }

        store_id = await self.admin_repo.find_store_id_of_admin(admin_name)
        # encode เป็น JWT token
        jwt_secret_str = str(self.jwt_secret.get_jwt_secret())
        token = jwt.encode(payload, jwt_secret_str, algorithm=self.jwt_algorithm)
        return token, store_id # login สำเร็จส่ง token 

