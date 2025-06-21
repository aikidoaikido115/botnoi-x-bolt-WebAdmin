from fastapi import FastAPI
from contextlib import asynccontextmanager
from adapter.presentation.admin_controllers import admin_router
from adapter.presentation.store_controller import store_router
from adapter.presentation.service_controller import service_router
from adapter.presentation.payment_controller import payment_router

from adapter.external.database.postgres import engine
from domain.model_entities.database import Base
from fastapi.middleware.cors import CORSMiddleware

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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(admin_router)
app.include_router(store_router)
app.include_router(service_router)
app.include_router(payment_router)