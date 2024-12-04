<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

// Configuración de la conexión a la base de datos
$servername = "127.0.0.1";
$username = "root";
$password = "";
$dbname = "win_db";
$port = "33065";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname, $port);

// Verificar conexión
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Error de conexión: ' . $conn->connect_error]));
}

// Agregar log file
$logFile = 'debug.log';
function writeLog($message) {
    global $logFile;
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$timestamp] $message\n", FILE_APPEND);
}

// Manejar solicitud POST para crear nuevo producto
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    writeLog("Solicitud POST recibida");
    
    $rawData = file_get_contents('php://input');
    writeLog("Datos recibidos: " . $rawData);
    
    $data = json_decode($rawData, true);
    writeLog("Datos decodificados: " . print_r($data, true));
    
    if (!$data) {
        writeLog("Error decodificando JSON: " . json_last_error_msg());
        die(json_encode([
            'success' => false,
            'message' => 'Error decodificando JSON: ' . json_last_error_msg()
        ]));
    }
    
    // Normalizar los nombres de los campos
    $data = array_change_key_case($data, CASE_LOWER);
    writeLog("Datos normalizados: " . print_r($data, true));
    
    // Mapear los nombres en español a inglés si es necesario
    if (isset($data['nombre']) && !isset($data['name'])) {
        $data['name'] = $data['nombre'];
    }
    if (isset($data['descripcion']) && !isset($data['description'])) {
        $data['description'] = $data['descripcion'];
    }
    if (isset($data['precio']) && !isset($data['price'])) {
        $data['price'] = $data['precio'];
    }
    
    // Verificar que todos los campos requeridos estén presentes
    $requiredFields = ['name', 'description', 'price', 'stock'];
    foreach ($requiredFields as $field) {
        if (empty($data[$field])) {
            writeLog("Campo requerido faltante: $field");
            die(json_encode([
                'success' => false,
                'message' => "Campo requerido faltante: $field"
            ]));
        }
    }

    try {
        // Validar que los valores numéricos sean válidos
        $price = str_replace(',', '.', $data['price']); // Convertir comas a puntos si existen
        $price = floatval($price);
        
        if (!is_numeric($price) || $price <= 0) {
            writeLog("Error de validación: precio=$price");
            throw new Exception('El precio debe ser un número válido mayor o igual a 0');
        }
        
        if (!is_numeric($data['stock']) || $data['stock'] < 0) {
            throw new Exception('El stock debe ser un número entero válido mayor o igual a 0');
        }

        $name = $conn->real_escape_string($data['name']);
        $description = $conn->real_escape_string($data['description']);
        $price = number_format($price, 2, '.', '');
        $stock = (int)$data['stock'];
        $image_url = isset($data['image_url']) ? $conn->real_escape_string($data['image_url']) : '';

        writeLog("Valores procesados: price=$price, stock=$stock");

        $sql = "INSERT INTO products (name, description, price, stock, image_url, created_at) 
                VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)";
                
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssdis", $name, $description, $price, $stock, $image_url);
        
        writeLog("Ejecutando SQL con valores: name=$name, price=$price, stock=$stock");
        
        if ($stmt->execute()) {
            $nuevoId = $stmt->insert_id;
            writeLog("Producto insertado con ID: $nuevoId");
            
            // Obtener el producto recién insertado
            $sqlSelect = "SELECT id, name, description, price, stock, image_url, created_at 
                          FROM products 
                          WHERE id = ?";
            $stmtSelect = $conn->prepare($sqlSelect);
            $stmtSelect->bind_param("i", $nuevoId);
            $stmtSelect->execute();
            $result = $stmtSelect->get_result();
            $producto = $result->fetch_assoc();
            
            $stmt->close();
            $stmtSelect->close();
            
            echo json_encode([
                'success' => true,
                'message' => 'Producto agregado exitosamente',
                'producto' => $producto
            ]);
        } else {
            writeLog("Error al insertar: " . $stmt->error);
            throw new Exception($stmt->error);
        }
    } catch (Exception $e) {
        writeLog("Error: " . $e->getMessage());
        echo json_encode([
            'success' => false,
            'message' => 'Error al agregar el producto: ' . $e->getMessage()
        ]);
    }
}

$conn->close();
?> 