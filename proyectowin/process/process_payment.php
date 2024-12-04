<?php
require_once '../config/db.php';
session_start();

header('Content-Type: application/json');

try {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Iniciar transacción
    $conn->beginTransaction();
    
    // Insertar orden
    $stmt = $conn->prepare("INSERT INTO orders (user_id, total_amount, payment_method, payment_status) VALUES (?, ?, ?, ?)");
    $stmt->execute([
        $_SESSION['user_id'],
        $data['totalAmount'],
        $data['paymentMethod'],
        'completed'
    ]);
    
    $orderId = $conn->lastInsertId();
    
    // Insertar items de la orden
    $stmt = $conn->prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
    foreach ($data['items'] as $item) {
        $stmt->execute([
            $orderId,
            $item['productId'],
            $item['quantity'],
            $item['price']
        ]);
    }
    
    // Insertar detalles del pago
    if ($data['paymentMethod'] !== 'paypal') {
        $stmt = $conn->prepare("INSERT INTO payment_details (order_id, card_holder, card_number, expiry_date, payment_method) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([
            $orderId,
            $data['cardHolder'],
            $data['cardNumber'],
            $data['expiryDate'],
            $data['paymentMethod']
        ]);
    }
    
    // Confirmar la transacción
    $conn->commit();
    
    echo json_encode(['status' => 'success', 'message' => 'Pago procesado correctamente']);
} catch (Exception $e) {
    // En caso de error, revertir la transacción
    $conn->rollback();
    
    echo json_encode(['status' => 'error', 'message' => 'Hubo un error al procesar el pago: ' . $e->getMessage()]);
} 