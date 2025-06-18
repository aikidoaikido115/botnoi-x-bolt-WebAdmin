from fastapi import APIRouter, Depends, HTTPException, Query, Request


from adapter.external.database.postgres import get_db
from adapter.external.database.repositories import StoreRepositoryAdapter

from application.store_service.store import StoreService


store_router = APIRouter()

@store_router.get("/stores/all")
async def get_stores(db=Depends(get_db)):
    try:
        repo = StoreRepositoryAdapter(db)
        service = StoreService(repo)
        return await service.get_stores()
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@store_router.get("/store")
async def get_store(request: Request, db=Depends(get_db)):
    try:
        query_params = dict(request.query_params)
        store_id = query_params.get("store_id")
        store_name = query_params.get("store_name")

        if not store_id and not store_name:
            raise HTTPException(status_code=400, detail="ต้องระบุ store_id หรือ store_name อย่างใดอย่างหนึ่ง")
        if store_id and store_name:
            raise HTTPException(status_code=400, detail="กรุณาระบุอย่างใดอย่างหนึ่ง store_id หรือ store_name")

        repo = StoreRepositoryAdapter(db)
        service = StoreService(repo)

        if store_id:
            store = await service.get_store_by_id(store_id)
        else:
            store = await service.get_store_by_name(store_name)

        if not store:
            raise HTTPException(status_code=404, detail="ไม่พบข้อมูลร้าน")

        return store.to_dict() if hasattr(store, "to_dict") else store

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
    
@store_router.post("/stores/create")
async def create_store(request: Request, db=Depends(get_db)):
    try:
        data = await request.json()
        store_name = data.get("store_name")
        description = data.get("description")


        repo = StoreRepositoryAdapter(db)
        service = StoreService(repo)
        return await service.create_store(store_name, description)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@store_router.put("/stores/edit")
async def edit_store(request: Request, db=Depends(get_db)):
    try:
        data = await request.json()

        store_id = data.get("store_id")
        if not store_id:
            raise HTTPException(status_code=400, detail="ต้องระบุ store_id")

        update_data = {
            key: value
            for key, value in data.items()
        }

        if not update_data:
            raise HTTPException(status_code=400, detail="ไม่มีข้อมูลที่ต้องการอัปเดต")

        repo = StoreRepositoryAdapter(db)
        service = StoreService(repo)
        updated_store = await service.edit_by_id(store_id, update_data)

        if not updated_store:
            raise HTTPException(status_code=404, detail="ไม่พบร้าน")

        return updated_store.to_dict()

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

@store_router.delete("/stores/delete")
async def remove_store(request: Request, db=Depends(get_db)):
    try:
        data = await request.json()
        store_name = data.get("store_name")

        if not store_name:
            raise HTTPException(status_code=400, detail="ต้องระบุ store_name")

        repo = StoreRepositoryAdapter(db)
        service = StoreService(repo)
        delete_store = await service.remove_by_name(store_name)

        if not delete_store:
            raise HTTPException(status_code=404, detail="ไม่พบร้าน")

        return delete_store.to_dict()
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")