import configs
import pymysql

conn = None
is_connected = False


def connect():
    global conn
    global is_connected
    # noinspection PyBroadException
    try:
        conn = pymysql.connect(user=configs.username, password=configs.password, database=configs.db_name)
        conn.set_charset('utf8')
    except pymysql.DatabaseError:
        print('DB connection FAILED!')
        return
    except:
        print('unknown error occurred.')
        return

    is_connected = True
    if configs.debug:
        print('database connected')
    return conn


def disconnect():
    global is_connected
    if not is_connected:
        return
    conn.close()
    is_connected = False
    if configs.debug:
        print('database disconnected')
