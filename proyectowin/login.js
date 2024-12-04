function iniciarSesion(email, password) {
    // Obtener credenciales de admin desde una configuración segura o backend
    const adminCredentials = obtenerCredencialesAdmin();
    
    if (email === adminCredentials.email && verificarPassword(password, adminCredentials.hash)) {
        const usuario = {
            email: email,
            isAdmin: true,
            token: generarToken() // Añadir un token de sesión
        };
        localStorage.setItem('usuarioActual', JSON.stringify(usuario));
        window.location.href = 'usuario.html';
    } else {
        // ... código de verificación de usuarios normales ...
        
        const usuario = {
            email: email,
            isAdmin: false,
            token: generarToken() // Añadir un token de sesión
        };
        localStorage.setItem('usuarioActual', JSON.stringify(usuario));
        window.location.href = 'cliente.html';
    }
} 