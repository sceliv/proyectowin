    // Variables globales
let cart = [];
let products = [
    { id: 1, name: 'Modem Huawei', price: 99.99, image: 'https://win.pe/img/lp/huaral/router.png' },
    { id: 2, name: 'Repetidor Huawei', price: 149.90, image: 'https://internet-hogar.com.pe/wp-content/uploads/2024/09/Mesh-de-Win.png' },
    { id: 3, name: 'FonoWin Telefono Fijo', price: 65.90, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT94ZRodsEIhtWCfQSfNKLLL3bvZv6RB2VJVA&s' },
    { id: 4, name: 'Telefonia fija para tu hogar', price: 89.90, image: 'https://win.pe/img/fono-win/img-1.webp' },
    { id: 5, name: 'Servicio Fibra Optica - 100 Mbps', price: 79.00, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsK0f19r7k-kp828K3wl5XnPRuAd_2r-9eA4H1aO0L51bhDdJSrWuekjk2QVWeMggfOOE&usqp=CAU' },
    { id: 6, name: 'Trio WIN x2 meses', price: 79.00, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhe3bVMDGMNEGfgmoOIN81DiEQB5_QaxZ41DPu67Xrw1Qu0u1Kjqwf3nAle0BuAE8eMg0&usqp=CAU' },
    { id: 7, name: 'Servicio Fibra Optica - 300 Mbps', price: 199.90, image: 'https://wininternet.pe/wp-content/uploads/2023/08/Banner-03.png' },
    { id: 8, name: 'Promo - Servicio Fibra Optica - 400 Mbps', price: 133.50, image: 'https://wininternets.pe/wp-content/uploads/2024/07/slide3-mobile.webp' }
];

// Funciones de usuario
function toggleUser() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    
}

function configurarUser() {
   window.location.href = 'usuario.html'; 
}

function cerrarSesion() {
    // Limpiar el localStorage
    localStorage.removeItem('usuario');
    localStorage.removeItem('carrito');
    
    // Redireccionar al login
    window.location.href = 'home.html';
}

// Funciones de utilidad
function formatPrice(price) {
    return parseFloat(price).toFixed(2);
}

function generateUniqueId() {
    return 'BE-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function showAlert(message, type) {
    const alert = document.getElementById(`${type}Alert`);
    alert.textContent = message;
    alert.style.display = 'block';
    setTimeout(() => {
        alert.style.display = 'none';
    }, 3000);
}

// Inicialización de la tienda
document.addEventListener('DOMContentLoaded', () => {
    if (!verificarSesion()) {
        // Si no hay sesión, redirigir al login
        window.location.href = 'home.html'; 
        return;
    }

    // Mostrar información del usuario si está logueado
    const userName = sessionStorage.getItem('userName');
    if (userName) {
        // Actualizar la UI con el nombre del usuario
        const userNameElement = document.getElementById('userName');
        if (userNameElement) {
            userNameElement.textContent = userName;
        }
    }

    loadProducts();
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    };
});

// Funciones de productos
function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>S/. ${formatPrice(product.price)}</p>
            <button onclick="addToCart(${product.id})">Agregar al carrito</button>
        </div>
    `).join('');
}

// Funciones del carrito
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartCount();
    updateCartDisplay();
    showAlert('Producto agregado al carrito', 'success');
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="item-info">
                <span>${item.name}</span>
                <span>S/. ${formatPrice(item.price)} x ${item.quantity}</span>
            </div>
            <div class="item-actions">
                <button onclick="updateQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, 1)">+</button>
                <button onclick="removeFromCart(${item.id})" class="remove-btn">🗑️</button>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.innerHTML = `<strong>Total: S/. ${formatPrice(total)}</strong>`;
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartCount();
            updateCartDisplay();
        }
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    updateCartDisplay();
}

//Funcion de Pagos
function procesarPago(event) {
    if (event) event.preventDefault();
    
    // Verificar sesión antes de procesar el pago
    if (!verificarSesion()) {
        showAlert('Debe iniciar sesión para realizar la compra', 'error');
        // Redirigir al login o mostrar modal de login
        window.location.href = 'home.html';
        return;
    }
    
    // Obtener el botón y deshabilitarlo
    const payButton = document.getElementById('payButton');
    payButton.disabled = true;
    payButton.innerHTML = 'Procesando...';

    const paymentMethod = document.getElementById('paymentMethod').value;
    
    // Verificar si hay items en el carrito
    if (cart.length === 0) {
        showAlert('El carrito está vacío', 'error');
        resetPayButton();
        return;
    }

    // Preparar datos del pago
    let paymentData = {
        paymentMethod: paymentMethod,
        totalAmount: calculateTotal(cart),
        items: cart.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
            name: item.name
        }))
    };

    // Validar datos de tarjeta si no es PayPal
    if (paymentMethod !== 'paypal') {
        // Guardar datos de tarjeta si la validación es exitosa
        if (!guardarDatosTarjeta()) {
            resetPayButton();
            return;
        }
    }

    // Simular procesamiento del pago
    setTimeout(() => {
        // Generar ID único para la boleta
        const boletaId = generateUniqueId();
        
        // Calcular subtotal e IGV
        const subtotal = paymentData.totalAmount / 1.18; // Retrocálculo del subtotal
        const igv = paymentData.totalAmount - subtotal;

        // Crear objeto de nueva compra
        const nuevaCompra = {
            boletaId: boletaId,
            fecha: new Date().toISOString(),
            items: cart.map(item => ({
                nombre: item.name,
                cantidad: item.quantity,
                precio: item.price
            })),
            subtotal: subtotal,
            igv: igv,
            total: paymentData.totalAmount
        };

        // Guardar en localStorage
        const comprasExistentes = JSON.parse(localStorage.getItem('compras') || '[]');
        comprasExistentes.push(nuevaCompra);
        localStorage.setItem('compras', JSON.stringify(comprasExistentes));

        // Limpiar carrito y mostrar boleta
        cart = [];
        updateCartCount();
        updateCartDisplay();
        closeModal('paymentModal');
        mostrarBoleta(nuevaCompra);
        showAlert('Pago procesado exitosamente', 'success');
        resetPayButton();
    }, 1500);
}

// Modificar la función que abre el modal de pago
function openModal(modalId) {
    if (modalId === 'paymentModal') {
        // Cerrar el modal del carrito primero
        closeModal('cartModal');
    }
    document.getElementById(modalId).style.display = 'block';
}

// Función auxiliar para validar datos de tarjeta
function validateCardData() {
    const cardHolder = document.getElementById('cardHolder').value;
    const cardNumber = document.getElementById('cardNumber').value;
    const expDate = document.getElementById('expDate').value;
    const cvv = document.getElementById('cvv').value;

    if (!cardHolder || !cardNumber || !expDate || !cvv) {
        showAlert('Por favor complete todos los campos de la tarjeta', 'error');
        return null;
    }

    // Validaciones adicionales de formato
    if (!/^\d{16}$/.test(cardNumber)) {
        showAlert('Número de tarjeta inválido', 'error');
        return null;
    }

    if (!/^\d{2}\/\d{2}$/.test(expDate)) {
        showAlert('Fecha de expiración inválida (MM/YY)', 'error');
        return null;
    }

    if (!/^\d{3}$/.test(cvv)) {
        showAlert('CVV inválido', 'error');
        return null;
    }

    return { cardHolder, cardNumber, expDate, cvv };
}

// Función auxiliar para resetear el botón
function resetPayButton() {
    const payButton = document.getElementById('payButton');
    payButton.disabled = false;
    payButton.innerHTML = 'Confirmar Pago';
}
    
    // Funciones auxiliares
    function showLoadingIndicator() {
        // Agregar un indicador de carga visual
        const payButton = document.querySelector('#paymentModal button');
        payButton.disabled = true;
        payButton.innerHTML = 'Procesando...';
    }
    
    function hideLoadingIndicator() {
        const payButton = document.querySelector('#paymentModal button');
        payButton.disabled = false;
        payButton.innerHTML = 'Confirmar Pago';
    }
    
    // Función para mostrar alertas
function showAlert(message, type) {
    const alertElement = document.getElementById(type === 'success' ? 'successAlert' : 'errorAlert');
    alertElement.textContent = message;
    alertElement.style.display = 'block';
    
    setTimeout(() => {
        alertElement.style.display = 'none';
    }, 3000);
}

// Función para actualizar el contador del carrito
function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cartItems.reduce((total, item) => total + item.quantity, 0);
    }
}

function calculateTotal(items) {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
}
    
// Función auxiliar para formatear precios
function formatCurrency(number) {
    return number.toFixed(2);
}

function mostrarBoleta(orderDetails) {
    // Obtener datos del cliente desde sessionStorage
    const clienteEmail = sessionStorage.getItem('userEmail');
    const clienteNombre = sessionStorage.getItem('userName');
    const fechaActual = new Date();
    
    // Actualizar contenido de la boleta
    document.getElementById('boletaNumber').textContent = orderDetails.boletaId;
    document.getElementById('boletaFecha').textContent = fechaActual.toLocaleDateString('es-PE');
    document.getElementById('boletaHora').textContent = fechaActual.toLocaleTimeString('es-PE');
    document.getElementById('customerName').textContent = clienteNombre || 'Cliente';
    document.getElementById('customerEmail').textContent = clienteEmail || 'No especificado';

    // Generar tabla de items
    const itemsHtml = orderDetails.items.map(item => `
        <tr>
            <td>${item.nombre}</td>
            <td class="text-center">${item.cantidad}</td>
            <td class="text-right">S/. ${formatCurrency(item.precio)}</td>
            <td class="text-right">S/. ${formatCurrency(item.precio * item.cantidad)}</td>
        </tr>
    `).join('');

    // Actualizar totales con el formato corregido
    document.getElementById('boletaItems').innerHTML = itemsHtml;
    document.getElementById('boletaSubtotal').textContent = formatCurrency(orderDetails.subtotal);
    document.getElementById('boletaIGV').textContent = formatCurrency(orderDetails.igv);
    document.getElementById('boletaTotal').textContent = formatCurrency(orderDetails.total);

    // Guardar en historial y mostrar modal
    guardarBoletaEnHistorial(orderDetails);
    openModal('boletaModal');
}

function imprimirBoleta() {
    const contenidoBoleta = document.getElementById('boletaContent').cloneNode(true);
    const ventanaImpresion = window.open('', '', 'height=600,width=800');
    
    ventanaImpresion.document.write(`
        <html>
            <head>
                <title>Boleta Electrónica - WIN</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .boleta-content { max-width: 800px; margin: 0 auto; }
                    .empresa-info { text-align: center; margin-bottom: 20px; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th, td { border: 1px solid #ddd; padding: 8px; }
                    .text-center { text-align: center; }
                    .text-right { text-align: right; }
                    .totals { margin-top: 20px; text-align: right; }
                    @media print {
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                ${contenidoBoleta.outerHTML}
                <script>
                    window.onload = () => window.print();
                </script>
            </body>
        </html>
    `);
    
    ventanaImpresion.document.close();
}

function guardarBoletaEnHistorial(boleta) {
    const historial = JSON.parse(localStorage.getItem('historialBoletas') || '[]');
    historial.push({
        ...boleta,
        fechaEmision: new Date().toISOString()
    });
    localStorage.setItem('historialBoletas', JSON.stringify(historial));
}

// Función mejorada para formatear precios
function formatPrice(price) {
    return Number(price).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Función para calcular el total del carrito
function calculateTotal(cart) {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

    // Actualizar la función updateCartCount para usar el cart global en lugar de localStorage
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
}

// Asegúrate de que esta función esté presente
function formatPrice(price) {
    return Number(price).toFixed(2);
}

// Función para imprimir la boleta
function imprimirBoleta() {
    const contenidoBoleta = document.getElementById('boletaContent').cloneNode(true);
    const ventanaImpresion = window.open('', '', 'height=600,width=800');
    
    ventanaImpresion.document.write(`
        <html>
            <head>
                <title>Boleta Electrónica - WIN</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .boleta-content { max-width: 800px; margin: 0 auto; }
                    .empresa-info { text-align: center; margin-bottom: 20px; }
                    .boleta-info, .customer-info { margin-bottom: 20px; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    .totals { text-align: right; margin: 20px 0; }
                    .total { font-size: 1.2em; font-weight: bold; }
                    .boleta-footer { text-align: center; margin-top: 30px; }
                    @media print {
                        .print-btn { display: none; }
                    }
                </style>
            </head>
            <body>
                ${contenidoBoleta.outerHTML}
            </body>
        </html>
    `);
    
    ventanaImpresion.document.close();
    ventanaImpresion.focus();
    ventanaImpresion.print();
    ventanaImpresion.close();
}


// Función para validar y guardar datos de tarjeta
function guardarDatosTarjeta() {
    const cardData = {
        holder: document.getElementById('cardHolder').value,
        number: document.getElementById('cardNumber').value.replace(/\D/g, ''),
        expiry: document.getElementById('expDate').value,
        cvv: document.getElementById('cvv').value
    };

    // Validar datos
    if (!validarDatosTarjeta(cardData)) {
        return false;
    }

    // Enmascarar número de tarjeta antes de guardar
    const maskedNumber = enmascararTarjeta(cardData.number);

    // Guardar en localStorage
    const datosTarjeta = {
        holder: cardData.holder,
        number: maskedNumber,
        expiry: cardData.expiry
    };

    localStorage.setItem('cardData', JSON.stringify(datosTarjeta));
    return true;
}

// Función para validar los datos de la tarjeta
function validarDatosTarjeta(cardData) {
    // Validar nombre del titular
    if (!cardData.holder.match(/^[a-zA-Z\s]{3,}$/)) {
        showAlert('Nombre del titular inválido', 'error');
        return false;
    }

    // Validar número de tarjeta (16 dígitos)
    const numeroLimpio = cardData.number.replace(/\D/g, '');
    if (numeroLimpio.length !== 16) {
        showAlert('Número de tarjeta inválido', 'error');
        return false;
    }

    // Validar fecha de expiración (MM/YY)
    if (!cardData.expiry.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
        showAlert('Fecha de expiración inválida (MM/YY)', 'error');
        return false;
    }

    // Validar CVV (3 dígitos)
    if (!cardData.cvv.match(/^\d{3}$/)) {
        showAlert('CVV inválido', 'error');
        return false;
    }

    return true;
}

// Event listeners para los campos de tarjeta
document.addEventListener('DOMContentLoaded', () => {
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', (e) => {
            formatearNumeroTarjeta(e.target);
        });
    }

    const expDateInput = document.getElementById('expDate');
    if (expDateInput) {
        expDateInput.addEventListener('input', (e) => {
            formatearFechaExpiracion(e.target);
        });
    }

    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', (e) => {
            formatearCVV(e.target);
        });
    }
});

// Función para enmascarar el número de tarjeta
function enmascararTarjeta(number) {
    return `****-****-****-${number.slice(-4)}`;
}

// Función para cargar datos de tarjeta guardados
function cargarDatosTarjeta() {
    const savedCard = localStorage.getItem('cardData');
    if (savedCard) {
        const cardData = JSON.parse(savedCard);
        document.getElementById('cardHolder').value = cardData.holder;
        document.getElementById('cardNumber').value = cardData.number;
        document.getElementById('expDate').value = cardData.expiry;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Cargar datos guardados
    cargarDatosTarjeta();

    // Event listeners para cada campo
    setupCardNumberListener();
    setupExpiryDateListener();
    setupCVVListener();
});

// Función para el número de tarjeta (16 dígitos)
function setupCardNumberListener() {
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', (e) => {
            formatearNumeroTarjeta(e.target);
        });

        // Prevenir pegado de texto no válido
        cardNumberInput.addEventListener('paste', (e) => {
            e.preventDefault();
            const pastedText = (e.clipboardData || window.clipboardData).getData('text');
            const numericText = pastedText.replace(/\D/g, '');
            formatearNumeroTarjeta({
                value: numericText,
                target: e.target
            });
        });
    }
}

// Función para formatear el número de tarjeta
function formatearNumeroTarjeta(input) {
    // Eliminar todo lo que no sea número
    let value = input.value.replace(/\D/g, '');
    
    // Limitar a 16 dígitos
    value = value.substring(0, 16);
    
    // Formatear en grupos de 4 dígitos
    let formattedValue = '';
    for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) {
            formattedValue += '-';
        }
        formattedValue += value[i];
    }
    
    input.value = formattedValue;
}


function validarNumeroTarjeta(numero) {
    // Verificar que tenga 16 dígitos
    if (numero.length !== 16) {
        return false;
    }
    
    // Algoritmo de Luhn (validación de tarjetas)
    let sum = 0;
    let isEven = false;
    
    // Recorrer de derecha a izquierda
    for (let i = numero.length - 1; i >= 0; i--) {
        let digit = parseInt(numero[i]);
        
        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        
        sum += digit;
        isEven = !isEven;
    }
    
    return sum % 10 === 0;
}

// Agregar el evento input al campo de tarjeta
document.getElementById('cardNumber').addEventListener('input', function(e) {
    if (!formatearNumeroTarjeta(this)) {
        // Si el número no es válido, mostrar el error
        showAlert('Número de tarjeta inválido', 'error');
    }
});

// Función para la fecha de expiración (MM/YY)
function setupExpiryDateListener() {
    const expDateInput = document.getElementById('expDate');
    if (expDateInput) {
        expDateInput.addEventListener('input', (e) => {
            formatearFechaExpiracion(e.target);
        });

        expDateInput.addEventListener('blur', completarFechaExpiracion);

        expDateInput.addEventListener('paste', (e) => {
            e.preventDefault();
            const pastedText = (e.clipboardData || window.clipboardData).getData('text');
            const numericText = pastedText.replace(/\D/g, '');
            formatearFechaExpiracion({
                value: numericText,
                target: e.target
            });
        });
    }
}

function formatearFechaExpiracion(input) {
    let value = input.value.replace(/\D/g, '');
    value = value.substring(0, 4);
    
    if (value.length >= 2) {
        const month = parseInt(value.substring(0, 2));
        // Validar mes entre 01 y 12
        if (month > 12) value = '12' + value.substring(2);
        if (month === 0) value = '01' + value.substring(2);
        
        value = value.substring(0, 2) + '/' + value.substring(2);
    }
    
    input.value = value;
}

function completarFechaExpiracion(e) {
    let value = e.target.value;
    if (value.length === 2) value += '/';
    if (value.length === 3) value += '0';
    e.target.value = value;
}

// Función para el CVV (3 dígitos)
function setupCVVListener() {
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', (e) => {
            formatearCVV(e.target);
        });

        cvvInput.addEventListener('paste', (e) => {
            e.preventDefault();
            const pastedText = (e.clipboardData || window.clipboardData).getData('text');
            const numericText = pastedText.replace(/\D/g, '');
            formatearCVV({
                value: numericText,
                target: e.target
            });
        });
    }
}

function formatearCVV(input) {
    let value = input.value.replace(/\D/g, '');
    value = value.substring(0, 3); // Limitar a 3 dígitos
    input.value = value;
}

// Función para verificar si el usuario está autenticado
function verificarSesion() {
    const userEmail = sessionStorage.getItem('userEmail');
    const userName = sessionStorage.getItem('userName');
    const userToken = sessionStorage.getItem('userToken'); // Si usas token de autenticación

    if (!userEmail || !userName) {
        return false;
    }
    return true;
}

// En tu función de login, asegúrate de guardar correctamente los datos
function login(userData) {
    sessionStorage.setItem('userEmail', userData.email);
    sessionStorage.setItem('userName', userData.name);
    sessionStorage.setItem('userToken', userData.token); // Si usas token

    // Verificar si es la cuenta de administrador
    if (userData.email === 'admin@gmail.com') {
        window.location.href = 'usuario.html';
    } else {
        window.location.href = 'index.html';
    }
}

function logout() {
    sessionStorage.clear();
    // Redirigir a home.html
    window.location.href = 'home.html';
}

// Agregar este código en index.js o en un script en index.html
function cargarCalificaciones() {
    const testimonialsList = document.getElementById('testimonialsList');
    const calificaciones = JSON.parse(localStorage.getItem('calificaciones') || '[]');
    
    testimonialsList.innerHTML = calificaciones.map(cal => `
        <div class="testimonial-card">
            <div class="testimonial-header">
                <img src="${cal.userImage}" alt="${cal.userName}" class="testimonial-user-img">
                <div class="testimonial-user-info">
                    <h4>${cal.userName}</h4>
                    <div class="testimonial-rating">
                        ${'★'.repeat(cal.rating)}${'☆'.repeat(5-cal.rating)}
                    </div>
                </div>
            </div>
            <p class="testimonial-text">${cal.feedback}</p>
        </div>
    `).join('');
}

// Asegúrate de llamar a cargarCalificaciones() cuando se cargue la página del index
document.addEventListener('DOMContentLoaded', cargarCalificaciones);
