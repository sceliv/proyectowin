<?php
require_once 'config/db.php';

try {
    // Probar conexión a la tabla users
    $stmt = $conn->query("SELECT COUNT(*) FROM users");
    $userCount = $stmt->fetchColumn();
    
    // Probar estructura de la tabla
    $stmt = $conn->query("SHOW COLUMNS FROM users");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'message' => 'Conexión exitosa',
        'data' => [
            'total_users' => $userCount,
            'table_structure' => $columns
        ]
    ]);
    
} catch (PDOException $e) {
    error_log('Test error: ' . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Error de conexión',
        'error' => $e->getMessage()
    ]);
}
?> 