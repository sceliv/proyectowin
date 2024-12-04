// Función para mostrar diferentes secciones
function mostrarSeccion(seccion) {
    // Ocultar todas las secciones
    document.querySelectorAll('.content').forEach(el => el.style.display = 'none');
    // Mostrar la sección seleccionada
    document.getElementById(seccion).style.display = 'block';
}

// Funciones para el Perfil
function actualizarPerfil(event) {
    event.preventDefault();
    const nombre = document.getElementById('nombreUsuario').value;
    const email = document.getElementById('emailUsuario').value;
    const telefono = document.getElementById('telefonoUsuario').value;

    // Aquí normalmente harías una llamada al servidor
    alert(`Perfil actualizado:\nNombre: ${nombre}\nEmail: ${email}\nTeléfono: ${telefono}`);
}

// Funciones para Productos
let productos = [];

function mostrarFormularioProducto() {
    const nombre = prompt('Nombre del producto:');
    const precio = prompt('Precio del producto:');
    if (nombre && precio) {
        agregarProducto({ nombre, precio });
    }
}

function agregarProducto(producto) {
    productos.push(producto);
    actualizarListaProductos();
}

function actualizarListaProductos() {
    const lista = document.getElementById('listaProductos');
    lista.innerHTML = '';
    
    productos.forEach((producto, index) => {
        const card = document.createElement('div');
        card.className = 'producto-card';
        card.innerHTML = `
            <h3>${producto.nombre}</h3>
            <p>Precio: S/${producto.precio}</p>
            <button onclick="eliminarProducto(${index})">Eliminar</button>
        `;
        lista.appendChild(card);
    });
}

function eliminarProducto(index) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
        productos.splice(index, 1);
        actualizarListaProductos();
    }
}

// Funciones para Catálogo
function filtrarCatalogo() {
    const categoria = document.getElementById('filtroCategoria').value;
    const listaCatalogo = document.getElementById('listaCatalogo');
    
    // Simulación de filtrado
    listaCatalogo.innerHTML = `<p>Mostrando productos de categoría: ${categoria || 'Todas'}</p>`;
}

// Funciones para Servicios/Clientes
const servicios = {
    activos: [
        { cliente: 'Juan Pérez', servicio: 'Internet 100Mbps', estado: 'Activo' },
        { cliente: 'María García', servicio: 'Internet 200Mbps', estado: 'Activo' }
    ],
    pendientes: [
        { cliente: 'Carlos López', servicio: 'Internet 300Mbps', estado: 'Pendiente' }
    ]
};

function mostrarServiciosTab(tipo) {
    const listaServicios = document.getElementById('listaServicios');
    listaServicios.innerHTML = '';
    
    servicios[tipo].forEach(servicio => {
        const item = document.createElement('div');
        item.className = 'servicio-item';
        item.innerHTML = `
            <h3>Cliente: ${servicio.cliente}</h3>
            <p>Servicio: ${servicio.servicio}</p>
            <p>Estado: ${servicio.estado}</p>
        `;
        listaServicios.appendChild(item);
    });
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Mostrar perfil por defecto
    mostrarSeccion('perfil');
    
    // Cargar datos de ejemplo
    actualizarListaProductos();
    mostrarServiciosTab('activos');
}); 