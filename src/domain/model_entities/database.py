from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
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
    store_id = Column(String)
    
    # commands = relationship("Command", back_populates="admin")
    
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

    def to_dict(self):
        return {
            "id": self.id,
            "store_name": self.store_name,
            "description": self.description,
            "created_at": self.created_at
        }
# class Command(Base):
#     __tablename__ = "commands"
#     id = Column(Integer, primary_key=True, index=True)
#     admin_id = Column(String, ForeignKey("admins.id"), nullable=False)
#     name = Column(String)

#     admin = relationship("Admin", back_populates="commands")

#     def to_dict(self):
#         return {
#             "id": self.id,
#             "admin_id": self.admin_id,
#             "name": self.name
#         }