from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import date

class Huesped(SQLModel, table=True):
    id_huesped:str = Field(default=None, primary_key=True)
    nombre:str
    apellidos:str
    telefono:str
    nombre_cabana:str
    fecha_ingreso:str
    fecha_salida:str
    numero_noches:int
    numero_personas:int
    efectivo:bool
    tarjeta:bool
    transferencia:bool
    observaciones:str = None