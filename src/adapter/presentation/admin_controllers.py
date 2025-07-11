from fastapi import APIRouter, Depends, HTTPException, Request
# from app.application.services import LineBotService
# from app.domain.line.interfaces import LineBotServiceInterface
# from app.domain.line.models import LineWebhookRequest, LineMessageEvent
# from app.infrastructure.line_api import LineMessagingAdapter
# from app.infrastructure.file_storage import ImageStorageAdapter
# from app.infrastructure.ocr_api import OcrAdapter
# from app.infrastructure.image_enhance import ImageEnhanceAdapter
# from app.infrastructure.legal_api import LegalAdapter

from adapter.external.database.postgres import get_db
from adapter.external.database.repositories import AdminRepositoryAdapter, StoreRepositoryAdapter
from adapter.external.auth import AuthAdapter

from application.admin_service.register import RegisterService
# from app.domain.database.models import User, Command
# from typing import List, Dict, Any
from application.admin_service.login import LoginService

# from app.infrastructure.bridge import ConnectLine2DatabaseAdapter
# from app.infrastructure.aws_storage import S3ImageUploaderAdapter
# from app.infrastructure.yolo_crop.ai_license_plate import YoloCropAdapter
# from app.infrastructure.morphological import MorphologicalAdapter

admin_router = APIRouter()

@admin_router.get("/")
async def hello():
    return {"message":"Welcome to Botnoi x Bolt"}

@admin_router.post("/admins/register")
async def create_admin(request: Request, db=Depends(get_db)):
    try:
        data = await request.json()
        # id = data.get("id") #uuid ถูกทำทีหลังใน business logic
        email = data.get("email")
        admin_name = data.get("admin_name")
        admin_password = data.get("admin_password") #hash ใน business logic
        store_id = data.get("store_id")

        admin_repo = AdminRepositoryAdapter(db)
        store_repo = StoreRepositoryAdapter(db)

        service = RegisterService(admin_repo, store_repo)
        
        return await service.create_admin(email, admin_name, admin_password, store_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@admin_router.post("/admins/login")
async def admin_login(request: Request, db=Depends(get_db)):
    data = await request.json()
    admin_name = data.get("admin_name")
    admin_password = data.get("admin_password")

    if not admin_name or not admin_password:
        raise HTTPException(status_code=400, detail="Invalid admin_name ")

    repo = AdminRepositoryAdapter(db)
    auth_adapter_instance = AuthAdapter()
    auth_service = LoginService(repo, jwt_secret=auth_adapter_instance)

    token, store_id = await auth_service.login(admin_name, admin_password)
    print("token",token,"store_id",store_id)
    if not token:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {
        "access_token": token,
        "token_type": "bearer",
        "store_id": store_id
    }