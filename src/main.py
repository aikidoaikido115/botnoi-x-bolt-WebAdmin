from fastapi import FastAPI
from contextlib import asynccontextmanager
from adapter.presentation.admin_controllers import admin_router
from adapter.presentation.store_controller import store_router

from adapter.external.database.postgres import engine
from domain.model_entities.database import Base

# from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Code to run on startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Code to run on shutdown
    await engine.dispose()

app = FastAPI(lifespan=lifespan)
app.include_router(admin_router)
app.include_router(store_router)
