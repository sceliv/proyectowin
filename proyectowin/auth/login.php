<?php
header('Content-Type: application/json');
require_once '../config/db.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Validar datos de entrada
    if (!$data || empty($data['email']) || empty($data['password'])) {
        throw new Exception('Email y contraseña son requeridos');
    }

    // Buscar usuario
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$data['email']]);
    $user = $stmt->fetch();

    // Si no existe el usuario
    if (!$user) {
        throw new Exception('Usuario no encontrado');
    }

    // Verificar contraseña
    $passwordValid = password_verify($data['password'], $user['password']);
    
    if (!$passwordValid) {
        throw new Exception('Contraseña incorrecta');
    }

    // Login exitoso
    echo json_encode([
        'success' => true,
        'message' => 'Login exitoso',
        'user' => [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email']
        ]
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
} catch (PDOException $e) {
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error en el servidor'
    ]);
}
?> 