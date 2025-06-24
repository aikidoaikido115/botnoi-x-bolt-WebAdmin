from datetime import datetime


def str_2_date(str_time):
    try:
        str_time = datetime.fromisoformat(str_time) # แปลงตรงนี้
        return str_time
    except ValueError:
        print("รูปแบบเวลาไม่ถูกต้อง")
        return None