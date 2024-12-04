const respuestas = {
    "hola": "¡Hola de nuevo! 👋 ¿En qué puedo ayudarte hoy?\n" +
            "Puedo asistirte con:\n" +
            "• Información de planes y precios 💰\n" +
            "• Problemas técnicos 🔧\n" +
            "• Consultas sobre cobertura 📍\n" +
            "• Contacto y soporte 📞",
    "gracias": "¡Con gusto! 😊 Si necesitas algo más, estoy aquí para ayudarte.",
    "adios": "¡Hasta luego! Que tengas un excelente día! 🌟",
    "planes": "Estos son nuestros planes disponibles:\n" +
              "• 100 Mbps - S/89.90/mes\n" +
              "• 200 Mbps - S/129.90/mes\n" +
              "• 300 Mbps - S/169.90/mes\n" +
              "Todos incluyen instalación gratuita y router WiFi. ¿Te interesa alguno en particular?",
    "precio": "Nuestros precios comienzan desde S/89.90 por 100 Mbps. Puedes consultar más detalles sobre cada plan escribiendo 'planes'.",
    "contacto": "Puedes comunicarte con nosotros a través de:\n" +
                "📞 Teléfono: 017073000\n" +
                "📧 Correo: atencion@win.pe\n" +
                "💬 WhatsApp: +51 999999999",
    "soporte": "Para problemas técnicos, puedes escribirnos al correo soporte@win.pe o llamar al 📞 017073000. Nuestro equipo estará encantado de ayudarte.",
    "coberturaSinCiudad": "Por favor, indícame tu ciudad o distrito para verificar la cobertura. 🌍",
    "default": "Lo siento, no entendí tu consulta. 😅\n" +
               "Puedo ayudarte con:\n" +
               "• Planes y precios 💰\n" +
               "• Problemas técnicos 🔧\n" +
               "• Consultas sobre cobertura 📍\n" +
               "• Contacto y soporte 📞\n" +
               "¡Intenta escribirme algo más específico! 😊",
    "algoMas": "¿Hay algo más en lo que pueda ayudarte? 😊"
};

// Ciudades importantes donde hay cobertura (localidades dentro de Perú)
const ciudadesCobertura = [
    "lima", "trujillo", "arequipa", "cusco", "piura", "lambayeque", "la libertad", "chiclayo", "iquitos", "tacna", "chimbote", "cajamarca", "callao"
];

// Ciudades menos importantes donde no hay cobertura
const ciudadesSinCobertura = [
    "abancay", "tarma", "huancayo", "tarapoto", "tumbes", "moquegua", "junín", "ucayali", "pasco", "sullana", "puno", "madre de dios", "loreto", "san martín", "amazonas", "ancash", "apurímac"
];

// Verificación si la ciudad es peruana o no
const esCiudadPeruana = (ciudad) => {
    const ciudadesPeruanas = [
        "lima", "trujillo", "arequipa", "cusco", "piura", "lambayeque", "la libertad", "iquitos", "tacna", "chimbote", 
        "cajamarca", "callao", "abancay", "tarma", "huancayo", "tarapoto", "tumbes", "moquegua", "junín", "ucayali", 
        "puno", "pasco", "madre de dios", "loreto", "san martín", "amazonas", "áncash", "apurímac"
    ];
    return ciudadesPeruanas.includes(ciudad.toLowerCase());
};

// Respuestas para cobertura
const respuestaCobertura = {
    "disponible": "¡Sí! Actualmente contamos con cobertura en esta localidad. 🎉 Escríbenos si necesitas más información.",
    "noDisponible": "Por ahora no contamos con cobertura en esa localidad, pero estamos trabajando para expandir nuestro servicio. 🙏 Escríbenos para más detalles.",
    "fueraDePeru": "Lo siento, actualmente solo estamos operando en Perú. 🌍",
    "ciudadNoReconocida": "Lo siento, no entendí la ciudad que mencionaste. 🙏 Por favor, asegúrate de escribir el nombre correctamente."
};

// Variable para rastrear si el cliente ha seleccionado una opción válida
let seleccionValida = false;
let esperandoCiudad = false;  // Variable para controlar si estamos esperando la ciudad

function initChat() {
    setTimeout(() => {
        addMessage(respuestas["hola"], 'bot-message');
    }, 500);
}

function toggleChat() {
    const chatBox = document.getElementById('chatBox');
    const newDisplay = chatBox.style.display === 'none' ? 'flex' : 'none';
    chatBox.style.display = newDisplay;
    
    if (newDisplay === 'flex' && document.getElementById('chatMessages').children.length === 0) {
        initChat();
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function sendMessage() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim().toLowerCase();
    
    if (message === '') return;
    
    addMessage(userInput.value, 'user-message');
    
    setTimeout(() => {
        const response = getBotResponse(message);
        addMessage(response, 'bot-message');
        
        // Solo mostrar la pregunta "¿Hay algo más en lo que pueda ayudarte?" si se selecciona una opción válida
        if (seleccionValida) {
            setTimeout(() => {
                addMessage(respuestas["algoMas"], 'bot-message');
                seleccionValida = false;  // Resetear para evitar que se repita la pregunta
            }, 1000);
        }
    }, 500);
    
    userInput.value = '';
}

function addMessage(message, className) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = className;
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getBotResponse(message) {
    // Si estamos esperando la ciudad, preguntar por la cobertura
    if (esperandoCiudad) {
        if (esCiudadPeruana(message)) {
            for (let ciudad of ciudadesCobertura) {
                if (message.includes(ciudad)) {
                    seleccionValida = true;
                    esperandoCiudad = false;  // Ya tenemos la ciudad, no seguimos esperando
                    return respuestaCobertura["disponible"];
                }
            }
            // Si la ciudad no está en la lista de cobertura
            for (let ciudad of ciudadesSinCobertura) {
                if (message.includes(ciudad)) {
                    seleccionValida = true;
                    esperandoCiudad = false;
                    return respuestaCobertura["noDisponible"];
                }
            }
            // Si no se reconoce la ciudad
            seleccionValida = false;
            esperandoCiudad = false;
            return respuestaCobertura["ciudadNoReconocida"];
        } else {
            // Si el cliente menciona una ciudad fuera de Perú
            seleccionValida = false;
            esperandoCiudad = false;
            return respuestaCobertura["fueraDePeru"];
        }
    }

    // Si el mensaje es "cobertura", empezar a preguntar por la ciudad
    if (message.includes("cobertura")) {
        esperandoCiudad = true;
        seleccionValida = false;
        return respuestas["coberturaSinCiudad"];
    }

    // Manejo de saludo y despedida
    if (message === "hola") {
        seleccionValida = false;
        return respuestas["hola"];
    }
    if (message.includes("gracias")) {
        seleccionValida = false;
        return respuestas["gracias"];
    }
    if (message.includes("no") || message.includes("adios") || message.includes("hasta luego")) {
        seleccionValida = false;
        return respuestas["adios"];
    }
    
    // Otras opciones válidas
    if (message.includes("planes") || message.includes("precios")) {
        seleccionValida = true;
        return respuestas["planes"];
    }
    if (message.includes("contacto") || message.includes("teléfono") || message.includes("correo")) {
        seleccionValida = true;
        return respuestas["contacto"];
    }
    if (message.includes("soporte") || message.includes("problema técnico")) {
        seleccionValida = true;
        return respuestas["soporte"];
    }

    // Respuesta predeterminada si no se reconoce
    seleccionValida = false;
    return respuestas.default;
}
