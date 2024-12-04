<?php
require_once '../config/db.php';

header('Content-Type: application/json');

try {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Validar que todos los campos requeridos existan
    if (empty($data['name']) || empty($data['email']) || empty($data['password'])) {
        throw new Exception('Todos los campos son requeridos');
    }
    
    // Sanitizar y validar datos
    $name = filter_var($data['name'], FILTER_SANITIZE_STRING);
    $email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Email inválido');
    }
    
    // Verificar si el email ya existe
    $checkEmail = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $checkEmail->execute([$email]);
    if ($checkEmail->fetch()) {
        throw new Exception('Este email ya está registrado');
    }
    
    // Validar contraseña
    if (strlen($data['password']) < 8) {
        throw new Exception('La contraseña debe tener al menos 8 caracteres');
    }
    
    $password = password_hash($data['password'], PASSWORD_DEFAULT);

    $stmt = $conn->prepare("INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, NOW())");
    $stmt->execute([$name, $email, $password]);

    http_response_code(201); // Created
    echo json_encode(['success' => true, 'message' => 'Usuario registrado exitosamente']);
    
} catch(Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error en el servidor']);
    error_log($e->getMessage()); // Log del error real
}
?> 