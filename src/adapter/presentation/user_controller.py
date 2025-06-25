from fastapi import APIRouter, Depends, HTTPException, Request

from adapter.external.database.postgres import get_db
from adapter.external.database.repositories import UserRepositoryAdapter

from application.user_service.user import UserService

user_router = APIRouter()

@user_router.post("/users/register")
async def create_user(request: Request, db=Depends(get_db)):
    try:
        data = await request.json()

        user_id = data.get("user_id")
        user_name = data.get("user_name")
        tel = data.get("tel")


        user_repo = UserRepositoryAdapter(db)

        service = UserService(user_repo)
        
        return await service.create_user(user_id, user_name, tel)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@user_router.get("/users/all")
async def get_stores(db=Depends(get_db)):
    try:
        repo = UserRepositoryAdapter(db)
        service = UserService(repo)
        return await service.get_users()
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@user_router.get("/user")
async def get_user(request: Request, db=Depends(get_db)):
    try:
        query_params = dict(request.query_params)
        user_id = query_params.get("user_id")

        repo = UserRepositoryAdapter(db)
        service = UserService(repo)

        user = await service.get_user_by_id(user_id)

        if not user:
            raise HTTPException(status_code=404, detail="ไม่พบข้อมูลผู้ใช้")

        return user.to_dict() if hasattr(user, "to_dict") else user
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")