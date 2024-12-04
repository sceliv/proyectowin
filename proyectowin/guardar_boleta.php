<?php
// Deshabilitar la salida de errores PHP al navegador
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Asegurarnos de que no haya salida antes del JSON
ob_clean();

header('Content-Type: application/json');
require_once 'api/config.php';

try {
    if (!$pdo) {
        throw new Exception('Error de conexión a la base de datos');
    }

    // Capturar y decodificar el input
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Error al decodificar JSON: ' . json_last_error_msg());
    }
    
    if (!isset($data['orderDetails'])) {
        throw new Exception('Datos de la orden incompletos');
    }

    $orderDetails = $data['orderDetails'];
    $userId = isset($orderDetails['userId']) ? $orderDetails['userId'] : null;

    // Iniciar transacción
    $pdo->beginTransaction();

    try {
        // Insertar en la tabla orders
        $stmt = $pdo->prepare("
            INSERT INTO orders 
            (user_id, total_amount, payment_method, payment_status, created_at) 
            VALUES 
            (?, ?, ?, 'completed', NOW())
        ");
        
        if (!$stmt->execute([
            $userId,
            $orderDetails['total'],
            $orderDetails['paymentMethod'] ?? 'credit_card'
        ])) {
            throw new Exception('Error al insertar la orden');
        }
        
        $orderId = $pdo->lastInsertId();
        
        // Insertar items
        $stmt = $pdo->prepare("
            INSERT INTO order_items 
            (order_id, product_id, quantity, price) 
            VALUES 
            (?, ?, ?, ?)
        ");

        foreach ($orderDetails['items'] as $item) {
            if (!$stmt->execute([
                $orderId,
                $item['id'],
                $item['cantidad'],
                $item['precio']
            ])) {
                throw new Exception('Error al insertar item de la orden');
            }
        }   

        $pdo->commit();

        // Asegurarnos de que no haya salida antes de enviar la respuesta
        ob_clean();
        echo json_encode([
            'success' => true,
            'message' => 'Orden guardada correctamente',
            'orderId' => $orderId
        ]);

    } catch (Exception $e) {
        $pdo->rollBack();
        throw new Exception('Error al procesar la orden: ' . $e->getMessage());
    }

} catch (Exception $e) {
    // Log del error para debugging
    error_log('Error en guardar_boleta.php: ' . $e->getMessage());
    
    // Asegurarnos de que no haya salida antes de enviar la respuesta
    ob_clean();
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

// Asegurarnos de que no haya más salida después
exit();
?> 