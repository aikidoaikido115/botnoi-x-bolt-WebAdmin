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
from adapter.external.database.repositories import PaymentRepositoryAdapter, BookingRepositoryAdapter

from adapter.external.supabase_image import SupabaseAdapter

from application.payment_service.payment import PaymentService


payment_router = APIRouter()

@payment_router.get("/payments/all")
async def get_payments(db=Depends(get_db)):
    try:
        payment_repo = PaymentRepositoryAdapter(db)
        supabase_instance = SupabaseAdapter()
        booking_repo = BookingRepositoryAdapter(db)

        service = PaymentService(payment_repo, supabase_instance, booking_repo)
        return await service.get_payments()
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@payment_router.get("/payment")
async def get_payment(request: Request, db=Depends(get_db)):
    try:
        query_params = dict(request.query_params)
        payment_id = query_params.get("payment_id")
        booking_id = query_params.get("booking_id")

        if not payment_id and not booking_id:
            raise HTTPException(status_code=400, detail="ต้องระบุ payment_id หรือ booking_id อย่างใดอย่างหนึ่ง")
        if payment_id and booking_id:
            raise HTTPException(status_code=400, detail="กรุณาระบุอย่างใดอย่างหนึ่ง payment_id หรือ booking_id")

        payment_repo = PaymentRepositoryAdapter(db)
        supabase_instance = SupabaseAdapter()
        booking_repo = BookingRepositoryAdapter(db)

        service = PaymentService(payment_repo, supabase_instance, booking_repo)

        # payment = await service.get_payment_by_id(payment_id)

        if payment_id:
            payment = await service.get_payment_by_id(payment_id)
        else:
            payment = await service.get_payment_by_booking_id(booking_id)

        if not payment:
            raise HTTPException(status_code=404, detail="ไม่พบข้อมูลธุรกรรม")

        return payment.to_dict() if hasattr(payment, "to_dict") else payment

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

# # ก๊อปโค้ดไปเปิดโปรเจคอื่นใช้ route นี้ที่คอมเม้นเป็น supabase ปกติ    
# @payment_router.post("/payments/create")
# async def create_payment(
    
#     amount: float = Form(...),
#     # payment_status: str = Form("Pending")
#     slip: UploadFile = File(...),
#     booking_id: str = Form(...),

#     db=Depends(get_db)
    
#     ):
#     try:

#         file_name = slip.filename
#         slip = await slip.read()

#         # print("นับ", len(slip))
#         # print(file_name)
        

#         payment_repo = PaymentRepositoryAdapter(db)
#         supabase_instance = SupabaseAdapter()
#         booking_repo = BookingRepositoryAdapter(db)

#         service = PaymentService(payment_repo, supabase_instance, booking_repo)

#         return await service.create_payment(
#             amount,
#             slip,
#             file_name,

#             booking_id
#         )
    
#     except ValueError as e:
#         raise HTTPException(status_code=400, detail=str(e))

@payment_router.post("/payments/create")
async def create_payment(
    request: Request,
    db=Depends(get_db)
    
    ):
    try:
        data = await request.json()
        amount = data.get("amount")
        slip = data.get("slip")
        booking_id = data.get("booking_id")

        payment_repo = PaymentRepositoryAdapter(db)
        supabase_instance = SupabaseAdapter()
        booking_repo = BookingRepositoryAdapter(db)

        service = PaymentService(payment_repo, supabase_instance, booking_repo)

        return await service.create_payment(
            amount,
            slip,

            booking_id
        )
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@payment_router.put("/payments/edit")
async def edit_status(request: Request, db=Depends(get_db)):
    try:
        update_data = await request.json()
        payment_id = update_data.get("payment_id")

        payment_repo = PaymentRepositoryAdapter(db)
        supabase_instance = SupabaseAdapter()
        booking_repo = BookingRepositoryAdapter(db)

        service = PaymentService(payment_repo, supabase_instance, booking_repo)

        payment = await service.edit_status_by_id(payment_id, update_data)

        if not payment:
            raise HTTPException(status_code=404, detail="ไม่พบข้อมูลธุรกรรม")

        return payment.to_dict() if hasattr(payment, "to_dict") else payment

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")