document.getElementById("reservationForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Evita el envío del formulario por defecto

    // Obtiene los valores del formulario
    var formData = new FormData(this);
    
    // Convierte FormData a un objeto para enviarlo como JSON
    var object = {};
    formData.forEach((value, key) => object[key] = value);
    var json = JSON.stringify(object);

    // Envía los datos al servidor usando fetch
    fetch('http://localhost:3000/api/reservas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: json
    })
    .then(response => response.json())
    .then(data => {
        console.log('Reserva enviada:', data);
        // Mostrar el modal con el mensaje de confirmación
        var date = new Date(object.date);
        var options = { year: 'numeric', month: 'long', day: 'numeric' };
        var formattedDate = date.toLocaleDateString('es-ES', options);
        document.getElementById("confirmationMessage").innerText = `¡Su reserva ha sido enviada! Te esperamos el ${formattedDate}. ¡Nos vemos pronto!`;
        document.getElementById("confirmationModal").style.display = "flex";
        document.getElementById("reservationForm").reset();
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

// Funcionalidad para cerrar el modal
document.querySelector(".close").onclick = function() {
    document.getElementById("confirmationModal").style.display = "none";
}

window.onclick = function(event) {
    if (event.target == document.getElementById("confirmationModal")) {
        document.getElementById("confirmationModal").style.display = "none";
    }
}
