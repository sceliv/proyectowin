<?php
try {
    $host = "127.0.0.1";
    $port = "33065";
    $dbname = "win_db";
    $user = "root";
    $password = "";
    
    $conn = new PDO(
        "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4",
        $user,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
        ]
    );
    
    // Configurar timezone y modo estricto
    $conn->exec("SET time_zone = '+00:00'");
    $conn->exec("SET SESSION sql_mode = 'STRICT_ALL_TABLES'");
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error de conexión: ' . $e->getMessage()
    ]);
    exit;
}
?>
