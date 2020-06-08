import os
import the_resistance.secrets as secrets

class Config(object):
    SECRET_KEY = 'password'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///users.sqlite3'
    SQLALCHEMY_TRACK_MODIFICATIONS = False 