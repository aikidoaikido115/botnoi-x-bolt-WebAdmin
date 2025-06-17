from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class Admin(Base):
    __tablename__ = "admins"
    id = Column(String, primary_key=True, index=True)
    email = Column(String)
    admin_name = Column(String)
    admin_password = Column(String)
    store_id = Column(String)
    
    commands = relationship("Command", back_populates="admin")
    
    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "admin_name": self.admin_name,
            "admin_password": self.admin_password
        }

class Command(Base):
    __tablename__ = "commands"
    id = Column(Integer, primary_key=True, index=True)
    admin_id = Column(String, ForeignKey("admins.id"), nullable=False)
    name = Column(String)

    admin = relationship("Admin", back_populates="commands")

    def to_dict(self):
        return {
            "id": self.id,
            "admin_id": self.admin_id,
            "name": self.name
        }