import os
import the_resistance.secrets as secrets
from the_resistance.deploy import is_deploy

uri = 'sqlite:///users.sqlite3'
if is_deploy:
    uri='mysql+pymysql://{0}:{1}@{2}/{3}'.format(secrets.dbuser, secrets.dbpass, secrets.dbhost, secrets.dbname)

print(uri)

class Config(object):
    SECRET_KEY = 'password'
    SQLALCHEMY_DATABASE_URI = uri
    SQLALCHEMY_TRACK_MODIFICATIONS = False 