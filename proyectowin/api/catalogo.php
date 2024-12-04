<?php
require_once 'config.php';

// Obtener productos para el catálogo con filtros adicionales
try {
    $query = "SELECT * FROM products WHERE stock > 0";
    $params = [];

    // Aplicar filtros adicionales
    if (isset($_GET['categoria'])) {
        $query .= " AND categoria = ?";
        $params[] = $_GET['categoria'];
    }

    if (isset($_GET['precio_min'])) {
        $query .= " AND price >= ?";
        $params[] = $_GET['precio_min'];
    }

    if (isset($_GET['precio_max'])) {
        $query .= " AND price <= ?";
        $params[] = $_GET['precio_max'];
    }

    // Aplicar ordenamiento
    $query .= " ORDER BY " . ($_GET['ordenar'] ?? 'name') . " " . ($_GET['direccion'] ?? 'ASC');

    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'data' => $productos
    ]);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?> 