from datetime import datetime


def str_2_date(str_time):
    try:
        print("{} ก่อน error".format(str_time))
        str_time = datetime.fromisoformat(str_time) # แปลงตรงนี้
        return str_time
    except ValueError:
        print("{} เป็นรูปแบบเวลาไม่ถูกต้องเพราะ {}".format(str_time,type(str_time)))
        return None