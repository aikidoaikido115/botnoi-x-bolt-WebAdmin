from fastapi import APIRouter, Depends, HTTPException
# from app.application.services import LineBotService
# from app.domain.line.interfaces import LineBotServiceInterface
# from app.domain.line.models import LineWebhookRequest, LineMessageEvent
# from app.infrastructure.line_api import LineMessagingAdapter
# from app.infrastructure.file_storage import ImageStorageAdapter
# from app.infrastructure.ocr_api import OcrAdapter
# from app.infrastructure.image_enhance import ImageEnhanceAdapter
# from app.infrastructure.legal_api import LegalAdapter

# from app.infrastructure.database.postgres import get_db
# from app.infrastructure.database.repositories import UserRepository, CommandRepository
# from app.application.services import UserService, CommandService
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