<?php
try {
    require_once 'config/db.php';
    
    // Definir la estructura esperada
    $expected_tables = [
        'users' => ['id', 'name', 'email', 'password', 'created_at'],
        'products' => ['id', 'name', 'description', 'price', 'stock', 'image_url', 'created_at'],
        'orders' => ['id', 'user_id', 'total_amount', 'payment_method', 'payment_status', 'created_at'],
        'order_items' => ['id', 'order_id', 'product_id', 'quantity', 'price'],
        'payment_details' => ['id', 'order_id', 'card_holder', 'card_number', 'expiry_date', 'payment_method']
    ];
    
    $database_check = [];
    
    // Verificar cada tabla
    foreach ($expected_tables as $table => $expected_columns) {
        $query = $conn->query("SHOW COLUMNS FROM $table");
        $columns = $query->fetchAll(PDO::FETCH_COLUMN, 0); // Solo obtener nombres de columnas
        
        $database_check[$table] = [
            'exists' => true,
            'columns' => $columns,
            'columns_match' => array_diff($expected_columns, $columns) === array_diff($columns, $expected_columns)
        ];
    }
    
    // Verificar foreign keys
    $foreign_keys = [
        'orders' => ['users' => 'user_id'],
        'order_items' => ['orders' => 'order_id', 'products' => 'product_id'],
        'payment_details' => ['orders' => 'order_id']
    ];
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Conexión y estructura verificada',
        'database_info' => [
            'name' => $dbname,
            'host' => $host . ':' . $port,
            'tables' => $database_check,
            'server_version' => $conn->getAttribute(PDO::ATTR_SERVER_VERSION)
        ]
    ], JSON_PRETTY_PRINT);

} catch(Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Error en la verificación',
        'error' => $e->getMessage()
    ]);
}
?> 