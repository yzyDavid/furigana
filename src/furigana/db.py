import configs
import pymysql

conn = None


def connect():
    global conn
    # noinspection PyBroadException
    try:
        conn = pymysql.connect(user=configs.username, password=configs.password, database=configs.db_name)
    except pymysql.DatabaseError:
        print('DB connection FAILED!')
        return
    except:
        print('unknown error occurred.')
        return

    if configs.debug:
        print('database connected')
    return conn


def disconnect():
    conn.close()
    if configs.debug:
        print('database disconnected')
