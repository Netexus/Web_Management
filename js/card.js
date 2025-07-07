const containerCard = document.getElementById("container__events");
//-------------------------------------------------

function showEvents() {
    fetch("http://localhost:3000/events")
        .then((response) => response.json()) 
        .then((data) => {
            for (let card of data) {
                const newCard = document.createElement("div");
                newCard.className = "event-card card-hover";

                newCard.innerHTML += `
                <div class="event-image"><img src="${
                    card.image || "../assets/fondo.png"
                }" alt="" class="image__event" id="imagePreview" width="100%" height="100";></div>
                <div class="p-6">
                    <h3 class="font-bold text-xl mb-2">${card.titulo}</h3>
                    <p class="text-gray-600 mb-4">${card.textarea}</p>
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-verde-hoja font-semibold">${card.fecha}</span>
                        <button class="btn-primary text-sm">Ver Detalles</button>
                    </div>
                </div>`;
                containerCard.appendChild(newCard)
            }
        })
        .catch((error) => console.error("Error fetching products: ", error));
}
showEvents()
//-------------------------------------------------------------------------------------------------
