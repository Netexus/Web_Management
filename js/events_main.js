const botonAgregar = document.getElementById("botonAgregar");
const container = document.getElementById("container");

const form = document.getElementById("form__datos");
const inputTitulo = document.getElementById("inputTitulo");
const textarea = document.getElementById("textarea");
const inputFecha = document.getElementById("inputFecha");

const labelImage = document.getElementById("labelImage");
const inputImage = document.getElementById("imageInput");
const botonEnviar = document.getElementById("botonEnviar");
//-------------------------------------------------

function showEvents() {
    fetch("http://localhost:3000/events")
        .then((response) => response.json())
        .then((data) => {
            for (let card of data) {
                const newTr = document.createElement("tr");
                newTr.className = "border-t division";

                newTr.innerHTML += `
                             <td class="p-4">${card.titulo}</td>
                             <td class="p-4">${card.textarea}</td>
                             <td class="p-4"><img src="${
                                 card.image || "../assets/fondo.png"
                             }" alt="" class="image__event" id="imagePreview"></td>
                             <td class="p-4" >${card.fecha}</td>
                             <td class="p-4 boton__columna">
                             <button class="bg-yellow-500 text-white px-3 py-1 rounded edit" id="botonEdit">Editar</button>
                             <button class="bg-red-600 text-white px-3 py-1 rounded delete" id="botonDelete">Eliminar</button>
                             </td>`;

                tableContainer.querySelector("tbody").appendChild(newTr);
                const botonEdit = newTr.querySelector("button.edit");
                const botonDelete = newTr.querySelector("button.delete");

                botonDelete.addEventListener("click", () => {
                    deleteEvent(card.id);
                });

                botonEdit.addEventListener("click", () => {
                    container.classList.add(`show`);
                    updateEvent(card, newTr);
                });
            }
        })
        .catch((error) => console.error("Error fetching products: ", error));
}
//-------------------------------------------------------------------------------------------------------------------------------
showEvents();

//-------------------------------------------------
botonAgregar.addEventListener("click", (e) => {
    e.preventDefault();
    container.classList.toggle(`show`);
});
//-------------------------------------------------

form.addEventListener("submit", (e) => {
    e.preventDefault();
    nuevoEvento();
});
//-------------------------------------------------

inputImage.addEventListener("change", function () {
    if (inputImage.files.length > 0) {
        labelImage.textContent = "Imagen Seleccionada ✅";
    }
});
//-------------------------------------------------
async function nuevoEvento() {
    const file = inputImage.files[0];

    const valoresInput = {
        titulo: inputTitulo.value,
        textarea: textarea.value,
        image: undefined,
        fecha: inputFecha.value,
    };

    if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            valoresInput.image = e.target.result;
            await createEvent(valoresInput);
            window.location.reload();
            //-------------------------------------------
        };
        reader.readAsDataURL(file);
    } else {
        await createEvent(valoresInput);
        window.location.reload();
    }
}
//-------------------------------------------------------------------------------------------------------------------------------
function createEvent(valoresInput) {
    return fetch("http://localhost:3000/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(valoresInput),
    })
        .then((response) => response.json())
        .catch((error) => console.error("Error adding product: ", error));
}
//-------------------------------------------------------------------------------------------------------------------------------
function deleteEvent(id) {
    fetch(`http://localhost:3000/events/${id}`, { method: "DELETE" })
        .then((response) => response.json())
        .then(() => {
            window.location.reload();
        })
        .catch((error) => console.error("Error deleting product", error));
}
//-------------------------------------------------------------------------------------------------------------------------------
function updateServer(id, Values) {
    fetch(`http://localhost:3000/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Values),
    })
        .then((response) => response.json())
        .then(() => {
            window.location.reload();
        })
        .catch((error) => console.error("Error updating product: ", error));
}
//-------------------------------------------------------------------------------------------------------------------------------

function updateEvent(card, newTr) {
    scrollTo({ top: 0, behavior: "smooth" });

    inputTitulo.value = card.titulo;
    textarea.value = card.textarea;
    inputFecha.value = card.fecha;

    if (!form.querySelector("button.updateButton")) {
        let buttonUpdate = document.createElement("button");
        buttonUpdate.className = "bg-yellow-500 text-white px-3 py-1 rounded updateButton";
        buttonUpdate.textContent = "Actualizar";
        form.appendChild(buttonUpdate);

        buttonUpdate.addEventListener("click", () => {
            form.remove(buttonUpdate);//debo eliminar
            const valoresInput = {
                titulo: inputTitulo.value,
                textarea: textarea.value,
                image: undefined,
                fecha: inputFecha.value,
            };
            const file = inputImage.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    newTr.querySelector(".image__event").src = e.target.result;
                    valoresInput.image = e.target.result;
                    updateServer(card.id, valoresInput);
                    //-------------------------------------------
                };
                reader.readAsDataURL(file);
            } else {
                updateServer(card.id, valoresInput);
            }
        });
    }
}
