
// Variables globales
let productos = [];
const API_URL = 'api/productos.php'; // Ajusta esta URL según tu estructura

function toggleUser() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

function cerrarSesion() {
    window.location.href = 'home.html';
}

// Cerrar el menú al hacer clic fuera de él
document.addEventListener('click', function(e) {
    const dropdown = document.getElementById('userDropdown');
    const userIcon = document.querySelector('.user-icon');
    
    if (!userIcon.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.style.display = 'none';
    }
});

function mostrarFormularioProducto() {
    const modalHTML = `
        <div class="modal-producto" id="modalProducto">
            <div class="modal-content-producto">
                <div class="modal-header">
                    <h2>Agregar Nuevo Producto</h2>
                    <button class="close-modal" onclick="cerrarModalProducto()">&times;</button>
                </div>
                
                <form class="producto-form" id="formProducto" onsubmit="guardarProducto(event)">
                    <div class="form-group-producto">
                        <label for="nombreProducto">Nombre del Producto</label>
                        <input type="text" id="nombreProducto" required>
                    </div>
                    
                    <div class="form-group-producto">
                        <label for="descripcionProducto">Descripción</label>
                        <textarea id="descripcionProducto" rows="3" required></textarea>
                    </div>
                    
                    <div class="form-group-producto">
                        <label for="precioProducto">Precio (S/.)</label>
                        <input type="number" id="precioProducto" step="0.01" required>
                    </div>
                    
                    <div class="form-group-producto">
                        <label for="stockProducto">Stock</label>
                        <input type="number" id="stockProducto" required>
                    </div>

                    <!-- Nuevo campo para imagen -->
                    <div class="form-group-producto">
                        <label>Imagen del Producto</label>
                        <div class="imagen-input-container">
                            <div class="imagen-preview" id="imagenPreview">
                                <img id="previewImg" src="" alt="" style="display: none;">
                                <span class="placeholder-text">Vista previa de imagen</span>
                            </div>
                            <div class="imagen-opciones">
                                <input type="file" id="imagenFile" accept="image/*" onchange="previewImagen(event)" style="display: none;">
                                <input type="text" id="imagenUrl" placeholder="O ingresa la URL de la imagen">
                                <button type="button" class="btn btn-secondary" onclick="document.getElementById('imagenFile').click()">
                                    <i class="fas fa-upload"></i> Subir Imagen
                                </button>
                            </div>
                        </div>
                    </div>
                
                    <div class="form-group-producto acciones-formulario">
                        <button type="submit" class="btn btn-primary" title="Guardar">
                            <i class="fas fa-save"></i> Guardar
                        </button>
                        <button type="button" class="btn btn-danger" title="Cancelar" onclick="cerrarModalProducto()">
                            <i class="fas fa-times"></i> Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    // Agregar el event listener después de crear el modal
    document.querySelector('#formProducto').addEventListener('submit', function(event) {
        event.preventDefault();
        guardarProducto(event);
    });
}

// Función para mostrar diferentes secciones
function mostrarSeccion(seccionId) {
    // Ocultar todas las secciones
    document.querySelectorAll('.content').forEach(seccion => {
        seccion.style.display = 'none';
    });
    
    // Mostrar la sección seleccionada
    document.getElementById(seccionId).style.display = 'block';
    
    // Si es la sección de catálogo, cargar los productos
    if (seccionId === 'catalogo') {
        cargarCatalogo();
    }
}

// Función unificada para mostrar productos
function mostrarProductos() {
    const contenedor = document.getElementById('listaProductos');
    contenedor.innerHTML = '';

    // Crear la estructura de tabla
    const tablaHTML = `
        <table class="tabla-productos">
            <thead>
                <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                ${productos.map(producto => `
                    <tr>
                        <td>
                            <img src="${producto.image_url || 'https://via.placeholder.com/50'}" 
                                alt="${producto.name}" 
                                class="producto-imagen-mini"
                                onerror="this.src='https://via.placeholder.com/50'">
                        </td>
                        <td>${producto.name || ''}</td>
                        <td>${producto.description || ''}</td>
                        <td>S/. ${parseFloat(producto.price || 0).toFixed(2)}</td>
                        <td>${producto.stock || 0}</td>
                        <td>
                            <button onclick="editarProducto(${producto.id})" class="btn-secondary">
                                <i class="fas fa-edit"></i> Editar
                            </button>
                            <button onclick="eliminarProducto(${producto.id})" class="btn-danger">
                                <i class="fas fa-trash"></i> Eliminar
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>`;

    contenedor.innerHTML = tablaHTML;
}

// Función para guardar o actualizar un producto
async function guardarProducto(event) {
    event.preventDefault();
    
    // Obtener y validar los valores
    const nombre = document.getElementById('nombre').value.trim();
    const descripcion = document.getElementById('descripcionProducto').value.trim();
    const precio = parseFloat(document.getElementById('precioProducto').value);
    const stock = parseInt(document.getElementById('stockProducto').value);
    const imagen = document.getElementById('previewImg').src || document.getElementById('imagenUrl').value;

    // Log para verificar los valores individuales
    console.log('Valores capturados:', {
        nombre,
        descripcion,
        precio,
        stock,
        imagen
    });

    // Validación más específica
    if (!nombre) {
        mostrarAlerta('El nombre del producto es requerido', 'error');
        return;
    }
    if (!descripcion) {
        mostrarAlerta('La descripción del producto es requerida', 'error');
        return;
    }
    if (isNaN(precio) || precio <= 0) {
        mostrarAlerta('El precio debe ser un número válido mayor a 0', 'error');
        return;
    }
    if (isNaN(stock) || stock < 0) {
        mostrarAlerta('El stock debe ser un número válido no negativo', 'error');
        return;
    }

    const producto = {
        name: nombre,
        description: descripcion,
        price: precio,
        stock: stock,
        image_url: imagen || 'https://via.placeholder.com/150' // URL por defecto si no hay imagen
    };

    console.log('Objeto producto a enviar:', producto);

    try {
        const response = await fetch('api/productos.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(producto)
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        const responseText = await response.text();
        console.log('Texto de la respuesta:', responseText);

        let data;
        try {
            data = JSON.parse(responseText);
            console.log('Datos parseados:', data);
        } catch (e) {
            console.error('Error al parsear JSON:', e);
            throw new Error('Error en el formato de la respuesta del servidor');
        }

        if (data.success) {
            mostrarAlerta('Producto guardado exitosamente', 'success');
            agregarProductoALaLista(data.producto);
            cerrarModalProducto();
            await cargarProductos();
        } else {
            throw new Error(data.message || 'Error al guardar el producto');
        }
    } catch (error) {
        console.error('Error completo:', error);
        mostrarAlerta('Error al guardar el producto: ' + error.message, 'error');
    }
}

// Función para previsualizar la imagen
function previewImagen(event) {
    const preview = document.getElementById('previewImg');
    const placeholder = document.querySelector('.placeholder-text');
    const file = event.target.files[0];
    
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
            if (placeholder) {
                placeholder.style.display = 'none';
            }
        }
        
        reader.readAsDataURL(file);
    }
}

function agregarProductoALaLista(producto) {
    const listaProductos = document.getElementById('listaProductos');
    const fila = document.createElement('tr');

    fila.innerHTML = `
        <td><img src="${producto.image_url}" alt="${producto.name}" class="producto-imagen-mini"></td>
        <td>${producto.name}</td>
        <td>${producto.description}</td>
        <td>S/. ${parseFloat(producto.price).toFixed(2)}</td>
        <td>${producto.stock}</td>
        <td>
            <button onclick="editarProducto(${producto.id})" class="btn-secondary">
                <i class="fas fa-edit"></i> Editar
            </button>
            <button onclick="eliminarProducto(${producto.id})" class="btn-danger">
                <i class="fas fa-trash"></i> Eliminar
            </button>
        </td>
    `;

    listaProductos.appendChild(fila);
}

// Función para cargar la lista de productos
async function cargarProductos() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error al cargar productos');
        
        productos = await response.json();
        mostrarProductos();
    } catch (error) {
        mostrarAlerta('Error al cargar productos: ' + error.message, 'error');
    }
}

// Función para mostrar los productos en la interfaz
function mostrarProductos() {
    const contenedor = document.getElementById('listaProductos');
    contenedor.innerHTML = '';

    productos.forEach(producto => {
        const productoHTML = `
            <div class="producto-card">
                <img src="${producto.image_url}" alt="${producto.name}" class="producto-imagen">
                <div class="producto-info">
                    <h3>${producto.name}</h3>
                    <p class="precio">S/. ${parseFloat(producto.price).toFixed(2)}</p>
                    <p class="stock">Stock: ${producto.stock}</p>
                    <p class="descripcion">${producto.description}</p>
                    <div class="producto-actions">
                        <button onclick="editarProducto(${producto.id})" class="btn-secondary">
                            Editar
                        </button>
                        <button onclick="eliminarProducto(${producto.id})" class="btn-danger">
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>`;

        contenedor.insertAdjacentHTML('beforeend', productoHTML);
    });
}

// Función para editar un producto
async function editarProducto(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) {
        mostrarAlerta('Producto no encontrado', 'error');
        return;
    }

    // Mostrar el modal y llenar los campos
    mostrarFormularioProducto();
    
    // Llenar los campos del formulario con los datos del producto
    document.getElementById('nombreProducto').value = producto.name || '';
    document.getElementById('descripcionProducto').value = producto.description || '';
    document.getElementById('precioProducto').value = producto.price || '';
    document.getElementById('stockProducto').value = producto.stock || '';
    
    // Mostrar la imagen si existe
    const previewImg = document.getElementById('previewImg');
    const placeholder = document.querySelector('.placeholder-text');
    if (producto.image_url) {
        previewImg.src = producto.image_url;
        previewImg.style.display = 'block';
        if (placeholder) placeholder.style.display = 'none';
    }
}

// Función para eliminar un producto
async function eliminarProducto(id) {
    if (!confirm('¿Está seguro de eliminar este producto?')) return;

    try {
        const response = await fetch(`api/productos.php?id=${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        
        if (data.success) {
            mostrarAlerta('Producto eliminado exitosamente', 'success');
            cargarProductos(); // Recargar la lista de productos
        } else {
            throw new Error(data.message || 'Error al eliminar el producto');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error al eliminar el producto: ' + error.message, 'error');
    }
}

// Funciones auxiliares
function cerrarModalProducto() {
    const modal = document.getElementById('modalProducto');
    if (modal) {
        modal.remove(); // Eliminamos el modal del DOM en lugar de solo ocultarlo
    }
}

function mostrarAlerta(mensaje, tipo) {
    const alertaExistente = document.querySelector('.alerta');
    if (alertaExistente) {
        alertaExistente.remove();
    }

    const alerta = document.createElement('div');
    alerta.className = `alerta alerta-${tipo}`;
    alerta.innerHTML = `
        ${mensaje}
        <button onclick="this.parentElement.remove()" class="cerrar-alerta">&times;</button>
    `;
    
    document.body.appendChild(alerta);
    
    setTimeout(() => {
        if (alerta) {
            alerta.remove();
        }
    }, 3000);
}

// Funciones para Gestión de Catálogo

// Función para cargar el catálogo
async function cargarCatalogo() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Error al cargar el catálogo');
        }
        const productos = await response.json();
        mostrarCatalogo(productos);
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error al cargar el catálogo: ' + error.message, 'error');
    }
}

// Función para mostrar el catálogo
function mostrarCatalogo(productos) {
    const contenedor = document.getElementById('listaCatalogo');
    contenedor.innerHTML = ''; // Limpiar el contenedor

    productos.forEach(producto => {
        const catalogoHTML = `
            <div class="catalogo-item">
                <div class="catalogo-imagen">
                    <img src="${producto.image_url}" alt="${producto.name}">
                </div>
                <div class="catalogo-info">
                    <h3>${producto.name}</h3>
                    <p class="descripcion">${producto.description}</p>
                    <div class="precio-container">
                        <span class="precio-label">Precio:</span>
                        <span class="precio-valor">S/. ${parseFloat(producto.price).toFixed(2)}</span>
                        <button onclick="editarPrecioCatalogo(${producto.id}, ${producto.price})" 
                                class="btn-secondary btn-small">
                            Editar precio
                        </button>
                    </div>
                    <div class="stock-info">
                        <span>Stock disponible: ${producto.stock}</span>
                    </div>
                    <div class="catalogo-actions">
                        <button onclick="editarProductoCatalogo(${producto.id})" 
                                class="btn-secondary">
                            Editar
                        </button>
                        <button onclick="eliminarProductoCatalogo(${producto.id})" 
                                class="btn-danger">
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>`;

        contenedor.insertAdjacentHTML('beforeend', catalogoHTML);
    });
}

// Función para filtrar el catálogo
function filtrarCatalogo() {
    const categoria = document.getElementById('filtroCategoria').value;
    const url = categoria ? `${API_URL}?categoria=${categoria}` : API_URL;

    fetch(url)
        .then(response => response.json())
        .then(productos => mostrarCatalogo(productos))
        .catch(error => mostrarAlerta('Error al filtrar catálogo: ' + error.message, 'error'));
}

// Función para editar precio en el catálogo
function editarPrecioCatalogo(id, precioActual) {
    const nuevoPrecio = prompt('Ingrese el nuevo precio:', precioActual);
    
    if (nuevoPrecio === null || nuevoPrecio === '') return;
    
    if (isNaN(nuevoPrecio) || parseFloat(nuevoPrecio) < 0) {
        mostrarAlerta('Por favor ingrese un precio válido', 'error');
        return;
    }

    actualizarPrecioCatalogo(id, parseFloat(nuevoPrecio));
}

// Función para actualizar precio en la base de datos
async function actualizarPrecioCatalogo(id, nuevoPrecio) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                price: nuevoPrecio
            })
        });

        if (!response.ok) throw new Error('Error al actualizar el precio');

        mostrarAlerta('Precio actualizado exitosamente', 'success');
        cargarCatalogo();
    } catch (error) {
        mostrarAlerta('Error al actualizar precio: ' + error.message, 'error');
    }
}

// Función para editar producto en el catálogo
function editarProductoCatalogo(id) {
    // Reutilizamos la función de editar producto de la gestión de productos
    editarProducto(id);
}

// Función para eliminar producto del catálogo
async function eliminarProductoCatalogo(id) {
    if (!confirm('¿Está seguro de eliminar este producto del catálogo?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Error al eliminar el producto');

        mostrarAlerta('Producto eliminado exitosamente', 'success');
        cargarCatalogo();
    } catch (error) {
        mostrarAlerta('Error al eliminar: ' + error.message, 'error');
    }
}

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    // Mostrar la sección de perfil por defecto
    mostrarSeccion('perfil');
}); 

function previewImagen(event) {
    const preview = document.getElementById('previewImg');
    const placeholder = document.querySelector('.placeholder-text');
    const file = event.target.files[0];
    
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
            if (placeholder) {
                placeholder.style.display = 'none';
            }
        }
        
        reader.readAsDataURL(file);
    }
}

// También agregar este listener para la URL de la imagen
document.addEventListener('DOMContentLoaded', function() {
    document.body.addEventListener('input', function(e) {
        if (e.target && e.target.id === 'imagenUrl') {
            const preview = document.getElementById('previewImg');
            const placeholder = document.querySelector('.placeholder-text');
            const url = e.target.value;
            
            if (url) {
                preview.src = url;
                preview.style.display = 'block';
                if (placeholder) {
                    placeholder.style.display = 'none';
                }
            } else {
                preview.style.display = 'none';
                if (placeholder) {
                    placeholder.style.display = 'block';
                }
            }
        }
    });
});

// Para manejar la URL de la imagen
document.getElementById('imagenUrl').addEventListener('change', function(e) {
    const preview = document.getElementById('previewImg');
    const placeholder = document.querySelector('.placeholder-text');
    const url = e.target.value;
    
    if (url) {
        preview.src = url;
        preview.style.display = 'block';
        if (placeholder) placeholder.style.display = 'none';
    }
});

