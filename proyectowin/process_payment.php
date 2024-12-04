<?php
session_start();
header('Content-Type: application/json');

// Incluir archivo de conexión a la base de datos
require_once '../config/db.php';

try {
    // Obtener los datos del pago
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Validar que los datos necesarios estén presentes
    if (!isset($data['paymentMethod']) || !isset($data['items']) || !isset($data['totalAmount'])) {
        throw new Exception('Datos de pago incompletos');
    }

    // Iniciar transacción
    $conn->beginTransaction();

    // 1. Crear la orden
    $sql = "INSERT INTO orders (user_id, total_amount, payment_method, status) 
            VALUES (:user_id, :total_amount, :payment_method, 'completed')";
    
    $stmt = $conn->prepare($sql);
    $stmt->execute([
        ':user_id' => $_SESSION['user_id'] ?? 1, // Asegúrate de tener el user_id en sesión
        ':total_amount' => $data['totalAmount'],
        ':payment_method' => $data['paymentMethod']
    ]);
    
    $orderId = $conn->lastInsertId();

    // 2. Guardar los items de la orden
    $sql = "INSERT INTO order_items (order_id, product_id, quantity, price) 
            VALUES (:order_id, :product_id, :quantity, :price)";
    
    $stmt = $conn->prepare($sql);
    
    foreach ($data['items'] as $item) {
        $stmt->execute([
            ':order_id' => $orderId,
            ':product_id' => $item['productId'],
            ':quantity' => $item['quantity'],
            ':price' => $item['price']
        ]);
    }

    // 3. Si es pago con tarjeta, guardar los detalles
    if ($data['paymentMethod'] !== 'paypal') {
        $sql = "INSERT INTO payment_details (order_id, card_holder, card_number, exp_date) 
                VALUES (:order_id, :card_holder, :card_number, :exp_date)";
        
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ':order_id' => $orderId,
            ':card_holder' => $data['cardHolder'],
            ':card_number' => substr($data['cardNumber'], -4), // Solo guardamos los últimos 4 dígitos
            ':exp_date' => $data['expDate']
        ]);
    }

    // Confirmar transacción
    $conn->commit();

    // Generar número de boleta
    $boletaNumber = 'BE-' . str_pad($orderId, 8, '0', STR_PAD_LEFT);

    // Devolver respuesta exitosa
    echo json_encode([
        'success' => true,
        'orderId' => $boletaNumber,
        'message' => 'Pago procesado exitosamente',
        'orderDetails' => [
            'orderId' => $boletaNumber,
            'date' => date('Y-m-d'),
            'time' => date('H:i:s'),
            'items' => $data['items'],
            'total' => $data['totalAmount'],
            'paymentMethod' => $data['paymentMethod']
        ]
    ]);

} catch (Exception $e) {
    // Si hay error, revertir transacción
    if (isset($conn)) {
        $conn->rollBack();
    }

    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>