const API_URL = "/huespedes";
const btn_guardar = document.getElementById("btn_guardar");
const formulario = document.getElementById("formulario");
const tabla = document.getElementById("tabla_huespedes");


//COMENTARIO

btn_guardar.onclick = async (event) => {
    event.preventDefault();
    console.log("Verificando elementos...");
    console.log("id_huesped:", document.getElementById("id_huesped"));
    console.log("nombre:", document.getElementById("nombre"));
    console.log("apellidos:", document.getElementById("apellidos"));
    console.log("telefono:", document.getElementById("telefono"));
    console.log("direccion:", document.getElementById("direccion"));
    console.log("nombre_cabana:", document.getElementById("nombre_cabana"));
    console.log("fecha_ingreso:", document.getElementById("fecha_ingreso"));
    console.log("fecha_salida:", document.getElementById("fecha_salida"));
    console.log("numero_noches:", document.getElementById("numero_noches"));
    console.log("numero_personas:", document.getElementById("numero_personas"));
    console.log("efectivo:", document.getElementById("efectivo"));
    console.log("tarjeta:", document.getElementById("tarjeta"));
    console.log("transferencia:", document.getElementById("transferencia"));
    console.log("observaciones:", document.getElementById("observaciones"));
    
    const huesped = {
        id_huesped: document.getElementById("id_huesped").value,
        nombre: document.getElementById("nombre").value,
        apellidos: document.getElementById("apellidos").value,
        telefono: document.getElementById("telefono").value,
        direccion: document.getElementById("direccion").value,
        nombre_cabana: document.getElementById("nombre_cabana").value,
        fecha_ingreso: document.getElementById("fecha_ingreso").value,
        fecha_salida: document.getElementById("fecha_salida").value,
        numero_noches: document.getElementById("numero_noches").value,
        numero_personas: document.getElementById("numero_personas").value,
        efectivo: document.getElementById("efectivo").checked,
        tarjeta: document.getElementById("tarjeta").checked,
        transferencia: document.getElementById("transferencia").checked,
        observaciones: document.getElementById("observaciones").value
    };

    console.log(huesped);

    await fetch(
        API_URL,
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(huesped)
        }
    ).then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));
    formulario.reset();
} 


async function cargarHuespedes() {
  try {
    const res = await fetch(API_URL);
    console.log("Fetch response:", res);
    if (!res.ok) throw new Error("Error al obtener huéspedes");

    const huespedes = await res.json();
    console.log("Huéspedes recibidos:", huespedes);

    tabla.innerHTML = ""; // limpiar tabla

    huespedes.forEach(huesped => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${huesped.nombre || ""}</td>
        <td>${huesped.apellidos || ""}</td>
        <td>${huesped.telefono || ""}</td>
        <td>${huesped.nombre_cabana || ""}</td>
        <td>${huesped.fecha_ingreso || ""}</td>
        <td>${huesped.fecha_salida || ""}</td>
        <td><button class="btn btn-sm btn-warning">Editar</button></td>
        <td><button class="btn btn-sm btn-danger btn-eliminar" data-id="${huesped.id_huesped}">Eliminar</button></td>
        <td><button class="btn btn-sm btn-info">Reporte</button></td>
      `;
      tabla.appendChild(tr);
    });

    eventoEliminar(); 
  } catch (error) {
    console.error(error);
    tabla.innerHTML = "<tr><td colspan='9'>Error al cargar huéspedes</td></tr>";
  }
  
}

document.addEventListener("DOMContentLoaded", () => {
  cargarHuespedes();
});

tabla.addEventListener("click", async (event) => {
const res = await fetch(`${API_URL}/${encodeURIComponent(id)}`, { method: "DELETE" });
  if(event.target.classList.contains("btn-eliminar")){
    const id = event.target.getAttribute("data-id");
    if(confirm("¿Seguro que quieres eliminar este huésped?")){
      try {
        const res = await fetch(`${API_URL}/${id}`, {
          method: "DELETE"
        });
        if(!res.ok) throw new Error("Error al eliminar huésped");
        // Quitar fila de la tabla
        event.target.closest("tr").remove();
        alert("Huésped eliminado correctamente");
      } catch (error) {
        console.error(error);
        alert("No se pudo eliminar el huésped");
      }
    }
  }
});

function eventoEliminar() {
  const botonEliminar = document.querySelectorAll(".btn-eliminar");
  botonEliminar.forEach(boton => {
    boton.addEventListener("click", async () => {
      const id = boton.getAttribute("data-id");
      if (confirm("¿Deseas eliminar este huésped?")) {
        try {
          const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Error al eliminar huésped");
          // Recargar tabla luego de eliminar
          cargarHuespedes();
        } catch (error) {
          alert("No se pudo eliminar el huésped");
          console.error(error);
        }
      }
    });
  });
}
