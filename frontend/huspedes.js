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
        <td class="text-center align-middle">${huesped.nombre || ""}</td>
        <td class="text-center align-middle">${huesped.apellidos || ""}</td>
        <td class="text-center align-middle">${huesped.telefono || ""}</td>
        <td class="text-center align-middle">${huesped.nombre_cabana || ""}</td>
        <td class="text-center align-middle">${huesped.fecha_ingreso || ""}</td>
        <td class="text-center align-middle">${huesped.fecha_salida || ""}</td>
        <td class="text-center align-middle"><i class="bi bi-pencil-square i_editar" data-id="${huesped.id_huesped}" role= "button" style="font-size: 1.2rem;"></i></td>
        <td class="text-center align-middle"><i class="bi bi-trash text-danger i_eliminar" data-id="${huesped.id_huesped}" role="button" style="font-size: 1.2rem;"></i></td>
        <td class="text-center align-middle"><i class="bi bi-file-earmark-pdf-fill alin"></i></td>
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
  if(event.target.classList.contains("i_eliminar")){
    const id = event.target.getAttribute("data-id");
    if(confirm("¿Seguro que quieres eliminar este huésped?")){
      try {
        const res = await fetch(`${API_URL}/${id}`, {
          method: "DELETE"
        });
        if(!res.ok) throw new Error("Error al eliminar huésped");
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
  const botonEliminar = document.querySelectorAll(".i_eliminar");
  botonEliminar.forEach(boton => {
    boton.addEventListener("click", async () => {
      const id = boton.getAttribute("data-id");
      if (confirm("¿Deseas eliminar este huésped?")) {
        try {
          const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Error al eliminar huésped");
          cargarHuespedes();
        } catch (error) {
          alert("No se pudo eliminar el huésped");
          console.error(error);
        }
      }
    });
  });
}

document.addEventListener("click", async function (e) {
  // Si hicieron clic en el ícono de editar
  if (e.target.classList.contains("i_editar")) {
    const id = e.target.dataset.id;

    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) throw new Error("Error al obtener datos del huésped");

      const huesped = await response.json();

      // Llenar formulario con los datos
      document.getElementById("id_huesped").value = huesped.id_huesped;
      document.getElementById("nombre").value = huesped.nombre || "";
      document.getElementById("apellidos").value = huesped.apellidos || "";
      document.getElementById("telefono").value = huesped.telefono || "";
      document.getElementById("direccion").value = huesped.direccion || "";
      document.getElementById("nombre_cabana").value = huesped.nombre_cabana || "";
      document.getElementById("fecha_ingreso").value = huesped.fecha_ingreso || "";
      document.getElementById("fecha_salida").value = huesped.fecha_salida || "";
      document.getElementById("numero_noches").value = huesped.numero_noches || "";
      document.getElementById("numero_personas").value = huesped.numero_personas || "";
      document.getElementById("efectivo").checked = huesped.efectivo || false;
      document.getElementById("tarjeta").checked = huesped.tarjeta || false;
      document.getElementById("transferencia").checked = huesped.transferencia || false;
      document.getElementById("observaciones").value = huesped.observaciones || "";

    } catch (error) {
      console.error("Error al cargar huésped:", error);
      alert("Hubo un error al cargar los datos para edición");
    }
  }
});

document.getElementById("formulario").addEventListener("submit", async function (e) {
  e.preventDefault();

  const id = document.getElementById("id_huesped").value;

  const datos = {
    id_huesped: id,
    nombre: document.getElementById("nombre").value,
    apellidos: document.getElementById("apellidos").value,
    telefono: document.getElementById("telefono").value,
    direccion: document.getElementById("direccion").value,
    nombre_cabana: document.getElementById("nombre_cabana").value,
    fecha_ingreso: document.getElementById("fecha_ingreso").value,
    fecha_salida: document.getElementById("fecha_salida").value,
    numero_noches: parseInt(document.getElementById("numero_noches").value),
    numero_personas: parseInt(document.getElementById("numero_personas").value),
    efectivo: document.getElementById("efectivo").checked,
    tarjeta: document.getElementById("tarjeta").checked,
    transferencia: document.getElementById("transferencia").checked,
    observaciones: document.getElementById("observaciones").value
  };

  try {
    const url = esEdicion ? `/huespedes/${id}` : `/huespedes`;
    const method = esEdicion ? "PUT" : "POST";

    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(datos)
    });

    if (!response.ok) throw new Error("Error en la operación");

    alert(esEdicion ? "Huésped actualizado con éxito" : "Huésped registrado con éxito");
    document.getElementById("formulario").reset();
    cargarHuespedes(); 

  } catch (err) {
    console.error(err);
    alert("Hubo un error al guardar los datos");
  }
});

