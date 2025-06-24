from fastapi import APIRouter, Depends, HTTPException, Query, Request


from adapter.external.database.postgres import get_db
from adapter.external.database.repositories import ServiceRepositoryAdapter, StoreRepositoryAdapter

from application.service_service.service import ServiceService


service_router = APIRouter()

@service_router.get("/services/all")
async def get_services(request: Request,db=Depends(get_db)):
    try:
        query_params = dict(request.query_params)
        store_id = query_params.get("store_id")

        service_repo = ServiceRepositoryAdapter(db)
        store_repo = StoreRepositoryAdapter(db)

        service = ServiceService(service_repo, store_repo)
        return await service.get_services(store_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@service_router.get("/services/from-booking")
async def get_services_from_booking(request: Request, db=Depends(get_db)):
    try:
        query_params = dict(request.query_params)
        booking_id = query_params.get("booking_id")

        service_repo = ServiceRepositoryAdapter(db)
        store_repo = StoreRepositoryAdapter(db)

        services = ServiceService(service_repo, store_repo)

        services = await service_repo.find_services_by_booking_id(booking_id)
        return services
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@service_router.get("/service")
async def get_service(request: Request, db=Depends(get_db)):
    try:
        query_params = dict(request.query_params)
        service_id = query_params.get("service_id")

        service_repo = ServiceRepositoryAdapter(db)
        store_repo = StoreRepositoryAdapter(db)

        service = ServiceService(service_repo, store_repo)

        service = await service.get_service_by_id(service_id)

        if not service:
            raise HTTPException(status_code=404, detail="ไม่พบข้อมูลบริการ")

        return service.to_dict() if hasattr(service, "to_dict") else service

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
    
@service_router.post("/services/create")
async def create_service(request: Request, db=Depends(get_db)):
    try:
        data = await request.json()
        title = data.get("title")
        duration_minutes = data.get("duration_minutes")
        prices = data.get("prices")
        description = data.get("description")
        store_id = data.get("store_id")

        service_repo = ServiceRepositoryAdapter(db)
        store_repo = StoreRepositoryAdapter(db)

        service = ServiceService(service_repo, store_repo)

        return await service.create_service(
            title,
            duration_minutes,
            prices,
            description,
            store_id
        )
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@service_router.put("/services/edit")
async def edit_service(request: Request, db=Depends(get_db)):
    try:
        data = await request.json()

        service_id = data.get("service_id")
        if not service_id:
            raise HTTPException(status_code=400, detail="ต้องระบุ service_id")

        update_data = {
            key: value
            for key, value in data.items()
        }

        if not update_data:
            raise HTTPException(status_code=400, detail="ไม่มีข้อมูลที่ต้องการอัปเดต")

        service_repo = ServiceRepositoryAdapter(db)
        store_repo = StoreRepositoryAdapter(db)

        service = ServiceService(service_repo, store_repo)

        updated_service = await service.edit_by_id(service_id, update_data)

        if not updated_service:
            raise HTTPException(status_code=404, detail="ไม่พบบริการ")

        return updated_service.to_dict()

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

@service_router.delete("/services/delete")
async def remove_service(request: Request, db=Depends(get_db)):
    try:
        data = await request.json()
        service_id = data.get("service_id")

        if not service_id:
            raise HTTPException(status_code=400, detail="ต้องระบุ service_id")

        service_repo = ServiceRepositoryAdapter(db)
        store_repo = StoreRepositoryAdapter(db)

        service = ServiceService(service_repo, store_repo)
        
        delete_service = await service.remove_by_id(service_id)

        if not delete_service:
            raise HTTPException(status_code=404, detail="ไม่พบบริการ")

        return delete_service.to_dict()
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")