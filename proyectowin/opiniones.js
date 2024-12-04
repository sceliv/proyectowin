document.addEventListener('DOMContentLoaded', function() {
    cargarCalificaciones();
    actualizarEstadisticas();
});

function cargarCalificaciones() {
    const testimonialsList = document.getElementById('testimonialsList');
    const calificaciones = JSON.parse(localStorage.getItem('calificaciones') || '[]');
    
    if (calificaciones.length === 0) {
        testimonialsList.innerHTML = '<p class="no-reviews">Aún no hay opiniones.</p>';
        return;
    }
    
    // Ordenar calificaciones por fecha (más recientes primero)
    calificaciones.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    testimonialsList.innerHTML = calificaciones.map(cal => `
        <div class="testimonial-card">
            <div class="testimonial-header">
                <img src="${cal.userImage}" alt="${cal.userName}" class="testimonial-user-img">
                <div class="testimonial-user-info">
                    <h4>${cal.userName}</h4>
                    <div class="testimonial-rating">
                        ${'★'.repeat(cal.rating)}${'☆'.repeat(5-cal.rating)}
                    </div>
                    <div class="testimonial-date">
                        ${new Date(cal.fecha).toLocaleDateString()}
                    </div>
                </div>
            </div>
            <p class="testimonial-text">${cal.feedback}</p>
        </div>
    `).join('');
}

function actualizarEstadisticas() {
    const calificaciones = JSON.parse(localStorage.getItem('calificaciones') || '[]');
    const totalReviews = calificaciones.length;
    
    if (totalReviews === 0) {
        document.getElementById('averageScore').textContent = '0.0';
        document.getElementById('totalReviews').textContent = 'No hay opiniones';
        return;
    }

    // Calcular promedio
    const suma = calificaciones.reduce((acc, cal) => acc + Number(cal.rating), 0);
    const promedio = (suma / totalReviews).toFixed(1);
    
    // Calcular distribución de estrellas
    const distribucion = {1:0, 2:0, 3:0, 4:0, 5:0};
    calificaciones.forEach(cal => distribucion[cal.rating]++);
    
    // Actualizar estadísticas en la UI
    document.getElementById('averageScore').textContent = promedio;
    document.getElementById('totalReviews').textContent = `de ${totalReviews} opiniones`;
    
    // Actualizar barras de distribución
    Object.keys(distribucion).forEach(rating => {
        const porcentaje = (distribucion[rating] / totalReviews * 100).toFixed(0);
        const barElement = document.querySelector(`.rating-bar[data-rating="${rating}"] .bar`);
        if (barElement) {
            barElement.style.width = `${porcentaje}%`;
            barElement.nextElementSibling.textContent = `${porcentaje}%`;
        }
    });
} 