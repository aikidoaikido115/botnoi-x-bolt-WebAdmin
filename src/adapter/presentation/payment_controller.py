from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    Request,
    UploadFile,
    File,
    Form
)

from adapter.external.database.postgres import get_db
from adapter.external.database.repositories import PaymentRepositoryAdapter

from adapter.external.supabase_image import SupabaseAdapter

from application.payment_service.payment import PaymentService


payment_router = APIRouter()

@payment_router.get("/payments/all")
async def get_payments(db=Depends(get_db)):
    try:
        payment_repo = PaymentRepositoryAdapter(db)
        supabase_instance = SupabaseAdapter()

        service = PaymentService(payment_repo, supabase_instance)
        return await service.get_payments()
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@payment_router.get("/payment")
async def get_payment(request: Request, db=Depends(get_db)):
    try:
        data = await request.json()
        payment_id = data.get("payment_id")

        payment_repo = PaymentRepositoryAdapter(db)
        supabase_instance = SupabaseAdapter()

        service = PaymentService(payment_repo, supabase_instance)

        payment = await service.get_payment_by_id(payment_id)

        if not payment:
            raise HTTPException(status_code=404, detail="ไม่พบข้อมูลธุรกรรม")

        return payment.to_dict() if hasattr(payment, "to_dict") else payment

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
    
@payment_router.post("/payments/create")
async def create_payment(
    
    amount: float = Form(...),
    # payment_status: str = Form("Pending"), # default เป็น False
    slip: UploadFile = File(...),
    booking_id: str = Form(...),

    db=Depends(get_db)
    
    ):
    try:

        file_name = slip.filename
        slip = await slip.read()

        # print("นับ", len(slip))
        # print(file_name)
        

        payment_repo = PaymentRepositoryAdapter(db)
        supabase_instance = SupabaseAdapter()

        service = PaymentService(payment_repo, supabase_instance)

        return await service.create_payment(
            amount,
            slip,
            file_name,

            booking_id
        )
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    

# เหลือ 2 route