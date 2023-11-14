import os

class Config:
    # Flask
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'keep-it-secret-keep-it-safe'
    DEBUG = True

    # Database
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///data.sqlite'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT
    SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'keep-it-secret-keep-it-safe'

    # Image Uploads
    UPLOAD_FOLDER = 'IMAGES'

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig  # Default configuration
}