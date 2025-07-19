from fastapi import (FastAPI, HTTPException, status,
                    Request, Query)
from database import engine, inicializar_bd
from sqlmodel import Session, select
from models import Huesped
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

app = FastAPI()

inicializar_bd()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Monta la carpeta frontend en la raíz
app.mount("/frontend", StaticFiles(directory="frontend", html=True), name="frontend")

@app.get("/")
def read_root():
    return {"Hello": "Hello World"}

# CRUD
# CREATE
# READ
# UPDATE Actualizar
# DELETE

@app.get("/huespedes/{id_huesped}", response_model=Huesped)
def leer_huesped(id_huesped:str):
    with Session(engine) as session:
        huesped = session.get(Huesped, id_huesped)
        if not huesped:
            raise HTTPException(status_code=404, detail="El huesped no fue encontrado")
        return huesped

@app.post("/huespedes", response_model=Huesped, 
          status_code=status.HTTP_201_CREATED)
def crear_huesped(huesped:Huesped):
    with Session(engine) as session:
        session.add(huesped)
        session.commit()
        session.refresh(huesped)
        return huesped

@app.get("/huespedes", response_model=list[Huesped])
def obtener_huespedes():
    with Session(engine) as session:
        query = select(Huesped)
        resultados = session.exec(query).all()
        return resultados

@app.delete("/huespedes/{id_huesped}", 
            status_code=status.HTTP_204_NO_CONTENT)
def eliminar_husped(id_huesped:str):
    with Session(engine) as session:
        huesped = session.get(Huesped, id_huesped)
        if not huesped:
            raise HTTPException(status_code=404, 
                                detail="El Huesped no fue encontrado")
        session.delete(huesped)
        session.commit()

@app.put("/huespedes/{id_huesped}")
def actualizar_huesped(id_huesped: str, datos: Huesped):
    huesped = session.get(Huesped, id_huesped)
    if not huesped:
        raise HTTPException(status_code=404, detail="Huésped no encontrado")

    for key, value in datos.dict().items():
        setattr(huesped, key, value)

    session.add(huesped)
    session.commit()
    return huesped

@app.put("/huespedes/{id_huesped}")
def actualizar_huesped(id_huesped: str, huesped_actualizar: Huesped):
    with Session(engine) as session:
        huesped = session.get(Huesped, id_huesped)
        if not huesped:
            raise HTTPException(status_code=404, detail="Huésped no encontrado")
        huesped.nombre = huesped_actualizar.nombre
        huesped.apellidos = huesped_actualizar.apellidos
        huesped.telefono = huesped_actualizar.telefono
        huesped.nombre_cabana = huesped_actualizar.nombre_cabana
        huesped.fecha_ingreso = huesped_actualizar.fecha_ingreso
        huesped.fecha_salida = huesped_actualizar.fecha_salida
        huesped.numero_noches = huesped_actualizar.numero_noches
        huesped.numero_personas = huesped_actualizar.numero_personas
        huesped.efectivo = huesped_actualizar.efectivo
        huesped.tarjeta = huesped_actualizar.tarjeta
        huesped.transferencia = huesped_actualizar.transferencia
        huesped.observaciones = huesped_actualizar.observaciones

        session.add(huesped)
        session.commit()
        session.refresh(huesped)
        return huesped 