import configs
import pymysql


def connect():
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

    if configs.debug:
        # print('database connected')
        pass
    return conn
