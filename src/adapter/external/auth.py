
from domain.interfaces.auth import AuthInterface
import os

JWT_SECRET = os.getenv('JWT_SECRET')

class AuthAdapter(AuthInterface):
    @classmethod
    def get_jwt_secret(cls) -> str:
        return JWT_SECRET
