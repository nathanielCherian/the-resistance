import os

class Config(object):
    SECRET_KEY = 'password'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///users.sqlite3'
    SQLALCHEMY_TRACK_MODIFICATIONS = False 