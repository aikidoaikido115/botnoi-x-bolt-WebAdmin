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
from adapter.external.database.repositories import AdminRepositoryAdapter
from application.admin_service.register import RegisterService
# from app.domain.database.models import User, Command
# from typing import List, Dict, Any


# from app.infrastructure.bridge import ConnectLine2DatabaseAdapter
# from app.infrastructure.aws_storage import S3ImageUploaderAdapter
# from app.infrastructure.yolo_crop.ai_license_plate import YoloCropAdapter
# from app.infrastructure.morphological import MorphologicalAdapter

router = APIRouter()

@router.get("/")
async def hello():
    return {"message":"Welcome to Botnoi x Bolt"}

@router.post("/admins/register")
async def create_admin(request: Request, db=Depends(get_db)):
    try:
        data = await request.json()
        # id = data.get("id") #uuid ถูกทำทีหลังใน business logic
        email = data.get("email")
        admin_name = data.get("admin_name")
        admin_password = data.get("admin_password") #hash ใน business logic
        store_id = data.get("store_id")

        repo = AdminRepositoryAdapter(db)
        service = RegisterService(repo)
        return await service.create_admin(email, admin_name, admin_password, store_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))