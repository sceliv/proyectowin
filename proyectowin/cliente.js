window.onload = function() {
    if (performance.navigation.type === 1) {
        location.reload(true);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM cargado');
    setupNavigation();
    cargarDatosPerfil();
});

function setupNavigation() {
    console.log('Configurando navegación...');
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Obtener la sección objetivo
            const targetSection = this.getAttribute('data-section');
            console.log('Navegando a:', targetSection);
            
            // Actualizar clases active en nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Ocultar todas las secciones
            document.querySelectorAll('.content-section').forEach(section => {
                section.style.display = 'none';
                section.classList.remove('active');
            });
            
            // Mostrar la sección seleccionada
            const selectedSection = document.getElementById(targetSection);
            if (selectedSection) {
                selectedSection.style.display = 'block';
                selectedSection.classList.add('active');
            }
        });
    });
}

function toggleUser() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
}

function cambiarSeccion(seccionId) {
    if (!seccionId) return;
    
    console.log('Cambiando a sección:', seccionId);
    
    // Ocultar todas las secciones
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
        section.classList.remove('active');
    });
    
    // Mostrar la sección seleccionada
    const seccionSeleccionada = document.getElementById(seccionId);
    if (seccionSeleccionada) {
        seccionSeleccionada.style.display = 'block';
        seccionSeleccionada.classList.add('active');
        console.log('Sección mostrada:', seccionId);
    }
}

function editarPerfil() {
    const modal = document.getElementById('editProfileModal');
    modal.style.display = 'block';
}

function verBoleta(boletaId) {
    const modal = document.getElementById('boletaModal');
    modal.style.display = 'block';
}

function imprimirBoleta(boletaId) {
    window.print();
}

document.addEventListener('DOMContentLoaded', () => {
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (newPassword !== confirmPassword) {
                mostrarAlerta('Las contraseñas no coinciden', 'error');
                return;
            }

            mostrarAlerta('Contraseña actualizada exitosamente', 'success');
            passwordForm.reset();
        });
    }
});

function cargarDatosUsuario() {
    const userEmail = sessionStorage.getItem('userEmail');
    const userName = sessionStorage.getItem('userName');

    document.getElementById('userName').textContent = userName || 'Usuario';
    document.getElementById('profileName').textContent = userName || 'Usuario';
    document.getElementById('profileEmail').textContent = userEmail || 'email@ejemplo.com';
}

function cargarHistorialCompras() {
    const comprasGuardadas = localStorage.getItem('compras');
    const compras = comprasGuardadas ? JSON.parse(comprasGuardadas) : [];

    const purchasesList = document.getElementById('purchasesList');
    
    if (compras.length === 0) {
        purchasesList.innerHTML = '<div class="no-purchases">No hay compras realizadas</div>';
        return;
    }

    purchasesList.innerHTML = compras.map(compra => `
        <div class="purchase-item">
            <div class="purchase-header">
                <h3>Boleta #${compra.boletaId}</h3>
                <span class="purchase-date">${formatearFecha(compra.fecha)}</span>
                <span class="purchase-status completed">Completado</span>
            </div>
            <div class="purchase-details">
                ${compra.items.map(item => `
                    <div class="purchase-item-detail">
                        <span>${item.nombre}</span>
                        <span>x${item.cantidad}</span>
                        <span>S/. ${formatearPrecio(item.precio)}</span>
                    </div>
                `).join('')}
            </div>
            <div class="purchase-footer">
                <span class="purchase-total">Total: S/. ${formatearPrecio(compra.total)}</span>
                <button onclick="verBoleta('${compra.boletaId}')" class="action-button">Ver Boleta</button>
                <button onclick="imprimirBoleta('${compra.boletaId}')" class="action-button">Imprimir</button>
            </div>
        </div>
    `).join('');
}

function setupRatingSystem() {
    const stars = document.querySelectorAll('.star');
    let selectedRating = 0;

    stars.forEach(star => {
        star.addEventListener('click', () => {
            selectedRating = star.dataset.rating;
            updateStars(selectedRating);
        });

        star.addEventListener('mouseover', () => {
            updateStars(star.dataset.rating);
        });

        star.addEventListener('mouseout', () => {
            updateStars(selectedRating);
        });
    });
}

function updateStars(rating) {
    document.querySelectorAll('.star').forEach(star => {
        star.classList.toggle('active', star.dataset.rating <= rating);
    });
}

function enviarCalificacion() {
    const rating = document.querySelector('.star.selected')?.dataset.rating || 0;
    const feedback = document.getElementById('feedbackText').value;
    
    if (!rating) {
        alert('Por favor, selecciona una calificación');
        return;
    }

    if (!feedback.trim()) {
        alert('Por favor, escribe tu opinión');
        return;
    }

    // Crear objeto con la calificación
    const calificacion = {
        rating: parseInt(rating),
        comentario: feedback,
        fecha: new Date().toISOString(),
        usuario: document.getElementById('userName').textContent // O obtén el nombre del usuario de donde lo tengas guardado
    };

    // Obtener calificaciones existentes del localStorage
    let calificaciones = JSON.parse(localStorage.getItem('calificaciones')) || [];
    
    // Agregar nueva calificación
    calificaciones.push(calificacion);
    
    // Guardar en localStorage
    localStorage.setItem('calificaciones', JSON.stringify(calificaciones));

    // Mostrar mensaje de confirmación
    const confirmacion = document.getElementById('confirmacionCalificacion');
    confirmacion.style.display = 'block';

    // Limpiar el formulario
    document.getElementById('feedbackText').value = '';
    document.querySelectorAll('.star').forEach(star => star.classList.remove('selected'));
    document.getElementById('ratingText').textContent = 'Selecciona tu calificación';

    // Ocultar mensaje después de 3 segundos
    setTimeout(() => {
        confirmacion.style.display = 'none';
    }, 3000);
}

function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-PE');
}

function formatearPrecio(precio) {
    return parseFloat(precio).toFixed(2);
}

function traducirEstado(estado) {
    const estados = {
        'completed': 'Completado',
        'pending': 'Pendiente'
    };
    return estados[estado] || estado;
}

function mostrarAlerta(mensaje, tipo) {
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${tipo}`;
    alertElement.textContent = mensaje;

    document.querySelector('.main-content').insertAdjacentElement('afterbegin', alertElement);

    setTimeout(() => {
        alertElement.remove();
    }, 3000);
}

function cerrarSesion() {
    sessionStorage.clear();
    window.location.href = 'index.html';
}

function verBoleta(boletaId) {
    const comprasGuardadas = JSON.parse(localStorage.getItem('compras') || '[]');
    const boleta = comprasGuardadas.find(compra => compra.boletaId === boletaId);

    if (!boleta) {
        mostrarAlerta('Boleta no encontrada', 'error');
        return;
    }

    const modalContent = `
        <div class="modal-content">
            <span class="close" onclick="cerrarModal('boletaModal')">&times;</span>
            <div class="boleta-header">
                <img src="https://win.pe/img/logo-oct-white.png" alt="WIN" class="boleta-logo">
                <h2>Boleta de Venta</h2>
                <p>Nº ${boleta.boletaId}</p>
                <p>Fecha: ${formatearFecha(boleta.fecha)}</p>
            </div>
            <div class="boleta-cliente">
                <p><strong>Cliente:</strong> ${sessionStorage.getItem('userName') || 'Cliente'}</p>
                <p><strong>Email:</strong> ${sessionStorage.getItem('userEmail')}</p>
            </div>
            <div class="boleta-items">
                <table>
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio Unit.</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${boleta.items.map(item => `
                            <tr>
                                <td>${item.nombre}</td>
                                <td>${item.cantidad}</td>
                                <td>S/. ${formatearPrecio(item.precio)}</td>
                                <td>S/. ${formatearPrecio(item.precio * item.cantidad)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            <div class="boleta-totales">
                <p><strong>Subtotal:</strong> S/. ${formatearPrecio(boleta.subtotal)}</p>
                <p><strong>IGV (18%):</strong> S/. ${formatearPrecio(boleta.igv)}</p>
                <p><strong>Total:</strong> S/. ${formatearPrecio(boleta.total)}</p>
            </div>
        </div>
    `;

    const modal = document.getElementById('boletaModal');
    modal.innerHTML = modalContent;
    modal.style.display = 'block';
}

function imprimirBoleta(boletaId) {
    const comprasGuardadas = JSON.parse(localStorage.getItem('compras') || '[]');
    const boleta = comprasGuardadas.find(compra => compra.boletaId === boletaId);

    if (!boleta) {
        mostrarAlerta('Boleta no encontrada', 'error');
        return;
    }

    const ventanaImpresion = window.open('', 'PRINT', 'height=600,width=800');
    ventanaImpresion.document.write(`
        <html>
            <head>
                <title>Boleta de Venta - ${boleta.boletaId}</title>
                <style>
                    body { font-family: Arial, sans-serif; }
                    .boleta-container { max-width: 800px; margin: 20px auto; padding: 20px; }
                    .boleta-header { text-align: center; margin-bottom: 20px; }
                    .boleta-logo { height: 50px; margin-bottom: 10px; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
                    .boleta-totales { text-align: right; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class="boleta-container">
                    <div class="boleta-header">
                        <img src="https://win.pe/img/logo-oct-white.png" alt="WIN" class="boleta-logo">
                        <h2>Boleta de Venta</h2>
                        <p>Nº ${boleta.boletaId}</p>
                        <p>Fecha: ${formatearFecha(boleta.fecha)}</p>
                    </div>
                    <div class="boleta-cliente">
                        <p><strong>Cliente:</strong> ${sessionStorage.getItem('userName') || 'Cliente'}</p>
                        <p><strong>Email:</strong> ${sessionStorage.getItem('userEmail')}</p>
                    </div>
                    <div class="boleta-items">
                        <table>
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Precio Unit.</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${boleta.items.map(item => `
                                    <tr>
                                        <td>${item.nombre}</td>
                                        <td>${item.cantidad}</td>
                                        <td>S/. ${formatearPrecio(item.precio)}</td>
                                        <td>S/. ${formatearPrecio(item.precio * item.cantidad)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    <div class="boleta-totales">
                        <p><strong>Subtotal:</strong> S/. ${formatearPrecio(boleta.subtotal)}</p>
                        <p><strong>IGV (18%):</strong> S/. ${formatearPrecio(boleta.igv)}</p>
                        <p><strong>Total:</strong> S/. ${formatearPrecio(boleta.total)}</p>
                    </div>
                </div>
            </body>
        </html>
    `);

    ventanaImpresion.document.close();
    ventanaImpresion.focus();
    ventanaImpresion.print();
    ventanaImpresion.close();
}

function cerrarModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Función para cargar los datos del perfil
function cargarDatosPerfil() {
    const userEmail = sessionStorage.getItem('userEmail');
    const userName = sessionStorage.getItem('userName');

    // Verificar si hay datos de sesión
    if (!userName || !userEmail) {
        mostrarAlerta('No hay datos de sesión. Por favor, inicia sesión nuevamente.', 'error');
        window.location.href = 'index.html';
        return;
    }

    // Actualizar TODOS los elementos que muestran el nombre/email
    const nombreElementos = document.querySelectorAll('#userName, .user-name, #profileName');
    nombreElementos.forEach(elemento => {
        if (elemento) elemento.textContent = userName;
    });

    const emailElementos = document.querySelectorAll('#userEmail, .user-email, #profileEmail');
    emailElementos.forEach(elemento => {
        if (elemento) elemento.textContent = userEmail;
    });
}

// Función para actualizar el perfil
async function actualizarPerfil(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('nombreUsuario').value;
    const email = document.getElementById('emailUsuario').value;
    
    try {
        const response = await fetch('/api/perfil/actualizar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                nombre,
                email
            })
        });
        
        if (!response.ok) throw new Error('Error al actualizar');
        
        const resultado = await response.json();
        mostrarNotificacion('Perfil actualizado correctamente', 'success');
        
        // Actualizar la información en el sidebar
        document.getElementById('userName').textContent = nombre;
        document.getElementById('userEmail').textContent = email;
        
    } catch (error) {
        mostrarNotificacion('Error al actualizar el perfil', 'error');
    }
}

// Función para cambiar la foto de perfil
function cambiarFotoPerfil() {
    document.getElementById('imageInput').click();
}

// Manejador para la subida de la imagen
document.getElementById('imageInput').addEventListener('change', async function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('imagen', file);
    
    try {
        const response = await fetch('/api/perfil/actualizar-foto', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });
        
        if (!response.ok) throw new Error('Error al subir la imagen');
        
        const resultado = await response.json();
        document.getElementById('profileImage').src = resultado.foto_url;
        mostrarNotificacion('Foto de perfil actualizada', 'success');
        
    } catch (error) {
        mostrarNotificacion('Error al actualizar la foto de perfil', 'error');
    }
});

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo) {
    // Implementa tu sistema de notificaciones aquí
    alert(mensaje);
}

// Cargar datos al iniciar
document.addEventListener('DOMContentLoaded', cargarDatosPerfil);

// Función para actualizar el texto de calificación
function actualizarTextoCalificacion(rating) {
    const textos = {
        1: "Muy insatisfecho",
        2: "Insatisfecho",
        3: "Normal",
        4: "Satisfecho",
        5: "Muy satisfecho"
    };
    document.getElementById('ratingText').textContent = textos[rating] || "Selecciona tu calificación";
}

// Función para mostrar el mensaje de éxito
function mostrarMensajeExito() {
    const successMessage = document.getElementById('successMessage');
    const button = document.querySelector('.action-button');
    const buttonText = button.querySelector('.button-text');
    const buttonLoader = button.querySelector('.button-loader');

    // Ocultar loader y mostrar texto del botón
    buttonLoader.style.display = 'none';
    buttonText.style.display = 'block';
    
    // Mostrar mensaje de éxito
    successMessage.style.display = 'flex';
    
    // Ocultar mensaje después de 3 segundos
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 3000);
}

// Inicializar estrellas
document.addEventListener('DOMContentLoaded', function() {
    const stars = document.querySelectorAll('.star');
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            selectedRating = parseInt(this.dataset.rating);
            updateStars(selectedRating);
            actualizarTextoCalificacion(selectedRating);
        });
    });
});

let selectedRating = 0;

function showRatingText(rating) {
    const ratingText = document.getElementById('ratingText');
    const textos = {
        1: "Muy insatisfecho - El servicio necesita mejorar significativamente",
        2: "Insatisfecho - El servicio no cumplió mis expectativas",
        3: "Regular - El servicio fue aceptable",
        4: "Satisfecho - Buen servicio",
        5: "Muy satisfecho - ¡Excelente servicio!"
    };
    const ratingText = document.getElementById('ratingText');
    ratingText.textContent = textos[rating] || "Selecciona tu calificación";
}

function selectRating(rating) {
    selectedRating = rating;
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        star.classList.toggle('selected', index < rating);
    });
    showRatingText(rating);
}

function enviarCalificacion() {
    if (!selectedRating) {
        alert('Por favor, selecciona una calificación');
        return;
    }

    // Crear objeto con la calificación
    const calificacion = {
        rating: selectedRating,
        fecha: new Date().toISOString(),
        usuario: document.getElementById('userName').textContent
    };

    // Obtener calificaciones existentes del localStorage
    let calificaciones = JSON.parse(localStorage.getItem('calificaciones')) || [];
    
    // Agregar nueva calificación
    calificaciones.push(calificacion);
    
    // Guardar en localStorage
    localStorage.setItem('calificaciones', JSON.stringify(calificaciones));

    // Mostrar mensaje de confirmación
    const confirmacionElement = document.getElementById('confirmacionCalificacion');
    confirmacionElement.style.display = 'block';

    // Ocultar mensaje después de 3 segundos
    setTimeout(() => {
        confirmacionElement.style.display = 'none';
    }, 3000);

    // Resetear la calificación
    selectedRating = 0;
    document.querySelectorAll('.star').forEach(star => star.classList.remove('selected'));
    document.getElementById('ratingText').textContent = 'Selecciona tu calificación';
}

// Inicializar el sistema de calificación cuando se carga el documento
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar las estrellas
    const stars = document.querySelectorAll('.star');
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            selectRating(parseInt(this.dataset.rating));
        });
    });

    // Agregar evento para resetear el texto cuando el mouse sale del área de estrellas
    const ratingContainer = document.querySelector('.rating-stars');
    if (ratingContainer) {
        ratingContainer.addEventListener('mouseleave', () => {
            if (!selectedRating) {
                document.getElementById('ratingText').textContent = 'Selecciona tu calificación';
            } else {
                showRatingText(selectedRating);
            }
        });
    }
});