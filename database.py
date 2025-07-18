from sqlmodel import SQLModel, create_engine

DATABASE_URL = "sqlite:///./proyecto_examen.db"

engine = create_engine(DATABASE_URL, echo=True)

def inicializar_bd():
    SQLModel.metadata.create_all(engine)