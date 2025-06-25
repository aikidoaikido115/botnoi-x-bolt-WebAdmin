from sqlalchemy import (
    Float,
    Integer,
    String,
    DateTime,
    Boolean,
    ForeignKey,
    Column
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

Base = declarative_base()

class Admin(Base):
    __tablename__ = "admins"
    id = Column(String, primary_key=True, index=True)
    email = Column(String)
    admin_name = Column(String)
    admin_password = Column(String)

    store_id = Column(String, ForeignKey("stores.id"), nullable=False)
    
    stores = relationship("Store", back_populates="admins")
    
    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "admin_name": self.admin_name,
            "admin_password": self.admin_password
        }
    
class Store(Base):
    __tablename__ = "stores"
    id = Column(String, primary_key=True, index=True)
    store_name = Column(String)
    description = Column(String)
    created_at = Column(DateTime, default=func.now())

    services = relationship("Service", back_populates="stores")
    admins = relationship("Admin", back_populates="stores")

    def to_dict(self):
        return {
            "id": self.id,
            "store_name": self.store_name,
            "description": self.description,
            "created_at": self.created_at
        }
    

class Service(Base):
    __tablename__ = "services"
    id = Column(String, primary_key=True, index=True)
    title = Column(String)
    duration_minutes = Column(Integer)
    prices = Column(Float)
    description = Column(String)

    store_id = Column(String, ForeignKey("stores.id"), nullable=False)

    stores = relationship("Store", back_populates="services")
    booking_services = relationship("BookingService", back_populates="service")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "duration_minutes": self.duration_minutes,
            "prices": self.prices,
            "description":self.description,
            "store_id": self.store_id
        }
    
class Booking(Base):
    __tablename__ = "bookings"
    id = Column(String, primary_key=True, index=True)
    booking_time = Column(DateTime) #logic ห้าม จองวันที่ผ่านมาแล้ว
    status = Column(String)
    created_at = Column(DateTime, default=func.now())
    note = Column(String)

    user_id = Column(String, ForeignKey("users.id"), nullable=False)

    users = relationship("User", back_populates="bookings")
    booking_services = relationship("BookingService", back_populates="booking")
    payments = relationship("Payment", back_populates="bookings")

    def to_dict(self):
        return {
            "id": self.id,
            "booking_time": self.booking_time,
            "status": self.status,
            "created_at": self.created_at,
            "note":self.note,
            "user_id": self.user_id
        }

# Association Table
class BookingService(Base):
    __tablename__ = 'bookings_services'
    booking_id = Column(String, ForeignKey('bookings.id'), primary_key=True)
    service_id = Column(String, ForeignKey('services.id'), primary_key=True)

    booking = relationship("Booking", back_populates="booking_services")
    service = relationship("Service", back_populates="booking_services")

class Payment(Base):
    __tablename__ = "payments"
    id = Column(String, primary_key=True, index=True)
    # title = Column(String)
    amount = Column(Float)
    payment_status = Column(String, default="Pending") #ยังไม่จ่าย จ่ายแล้ว หมดอายุ
    slip = Column(String) # url รูป
    created_at = Column(DateTime, default=func.now())
    paid_at = Column(DateTime, nullable=True, default=None) # บันทึกเวลาที่ payment_status เปลี่ยน

    booking_id = Column(String, ForeignKey("bookings.id"), nullable=False)

    bookings = relationship("Booking", back_populates="payments")


    # relationship

    def to_dict(self):
        return {
            "id": self.id,
            "amount": self.amount,
            "payment_status": self.payment_status,
            "slip": self.slip,
            "created_at":self.created_at,
            "paid_at": self.paid_at,
            "booking_id": self.booking_id
        }
    
class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, index=True)
    user_name = Column(String)
    tel = Column(String)

    bookings = relationship("Booking", back_populates="users")

    def to_dict(self):
        return {
            "id": self.id,
            "user_name": self.user_name,
            "tel": self.tel
        }