from fastapi import APIRouter, Depends, HTTPException, Query, Request


from adapter.external.database.postgres import get_db
from adapter.external.database.repositories import BookingRepositoryAdapter, UserRepositoryAdapter, BookingServiceRepositoryAdapter

from application.booking_service.booking import BookingService


booking_router = APIRouter()

@booking_router.get("/bookings/all")
async def get_bookings(request: Request,db=Depends(get_db)):
    try:
        query_params = dict(request.query_params)
        user_id = query_params.get("user_id")

        booking_repo = BookingRepositoryAdapter(db)
        user_repo = UserRepositoryAdapter(db)
        booking_service_repo = BookingServiceRepositoryAdapter(db)

        service = BookingService(booking_repo, user_repo, booking_service_repo)
        return await service.get_bookings(user_id)
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@booking_router.get("/booking")
async def get_booking(request: Request, db=Depends(get_db)):
    try:
        query_params = dict(request.query_params)
        booking_id = query_params.get("booking_id")

        booking_repo = BookingRepositoryAdapter(db)
        user_repo = UserRepositoryAdapter(db)
        booking_service_repo = BookingServiceRepositoryAdapter(db)

        service = BookingService(booking_repo, user_repo, booking_service_repo)

        booking = await service.get_booking_by_id(booking_id)

        if not booking:
            raise HTTPException(status_code=404, detail="ไม่พบข้อมูลการจอง")

        return booking.to_dict() if hasattr(booking, "to_dict") else booking

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

@booking_router.get("/booking-appointments")
async def get_booking(request: Request, db=Depends(get_db)):
    try:
        query_params = dict(request.query_params)
        store_id = query_params.get("store_id")

        booking_repo = BookingRepositoryAdapter(db)
        user_repo = UserRepositoryAdapter(db)
        booking_service_repo = BookingServiceRepositoryAdapter(db)

        service = BookingService(booking_repo, user_repo, booking_service_repo)

        booking = await service.get_booking_by_store_id(store_id)

        if not booking:
            raise HTTPException(status_code=404, detail="ไม่พบข้อมูลการจอง")

        return booking.to_dict() if hasattr(booking, "to_dict") else booking

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
    
@booking_router.post("/bookings/create")
async def create_booking(request: Request, db=Depends(get_db)):
    try:
        data = await request.json()
        booking_time = data.get("booking_time")
        status = data.get("status")
        note = data.get("note")

        user_id = data.get("user_id")
        service_id = data.get("service_id")

        booking_repo = BookingRepositoryAdapter(db)
        user_repo = UserRepositoryAdapter(db)
        booking_service_repo = BookingServiceRepositoryAdapter(db)

        service = BookingService(booking_repo, user_repo, booking_service_repo)

        return await service.create_booking(
            booking_time,
            status,
            note,

            user_id,
            service_id
        )
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@booking_router.put("/bookings/edit")
async def edit_booking(request: Request, db=Depends(get_db)):
    try:
        data = await request.json()

        booking_id = data.get("booking_id")
        if not booking_id:
            raise HTTPException(status_code=400, detail="ต้องระบุ booking_id")

        update_data = {
            key: value
            for key, value in data.items()
        }

        if not update_data:
            raise HTTPException(status_code=400, detail="ไม่มีข้อมูลที่ต้องการอัปเดต")

        booking_repo = BookingRepositoryAdapter(db)
        user_repo = UserRepositoryAdapter(db)
        booking_service_repo = BookingServiceRepositoryAdapter(db)

        service = BookingService(booking_repo, user_repo, booking_service_repo)

        updated_service = await service.edit_by_id(booking_id, update_data)

        if not updated_service:
            raise HTTPException(status_code=404, detail="ไม่พบ การจอง")

        return updated_service.to_dict()

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

@booking_router.delete("/bookings/delete")
async def remove_booking(request: Request, db=Depends(get_db)):
    try:
        data = await request.json()
        booking_id = data.get("booking_id")

        if not booking_id:
            raise HTTPException(status_code=400, detail="ต้องระบุ booking_id")

        booking_repo = BookingRepositoryAdapter(db)
        user_repo = UserRepositoryAdapter(db)
        booking_service_repo = BookingServiceRepositoryAdapter(db)

        service = BookingService(booking_repo, user_repo, booking_service_repo)

        
        delete_service = await service.remove_by_id(booking_id)

        if not delete_service:
            raise HTTPException(status_code=404, detail="ไม่พบ การจอง")

        return delete_service.to_dict()
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")