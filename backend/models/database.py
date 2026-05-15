import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Host name ko 'med_db' se badal kar 'db' kiya
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:1234@db:5432/med_database")

engine = create_engine(DATABASE_URL)
Session_Local = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = Session_Local()
    try:
        yield db
    finally:
        db.close()