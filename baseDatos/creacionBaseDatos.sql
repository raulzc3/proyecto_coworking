/* 
Script de creación de la base de datos para el proyecto "GESTIÓN DE COWORKING" creado por:
    Julián David Calle Cristancho
    Raúl González Seco
    Iago Ubeira Martínez
*/

CREATE DATABASE IF NOT EXISTS coworking CHARSET "utf8mb4" COLLATE "utf8mb4_spanish_ci";

USE coworking;

CREATE TABLE usuarios (
    ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    nif CHAR(9) NOT NULL UNIQUE,
    clave VARCHAR(512) NOT NULL, -- Contraseña del usuario (cifrada)
    foto VARCHAR(50) NOT NULL DEFAULT '/img/default.png', -- En caso de que un usuario no suba una foto, le asignaremos una por defecto
    email VARCHAR(100) NOT NULL UNIQUE, -- UNIQUE para que no se pueda crear más de un usuario con el mismo correo
    tlf VARCHAR(30) UNIQUE, -- UNIQUE para que no se pueda crear más de un usuario con el mismo teléfono
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    fecha_nacimiento DATE, 
    empresa VARCHAR(50), -- Empresa en la que trabaja el usuario
    administrador TINYINT DEFAULT 0, -- Por defecto, los usuarios no serán administradores
    verificado TINYINT DEFAULT 0, -- Por defecto, un usuario no estará verificado
    eliminado TINYINT DEFAULT 0, -- Por defecto, un usuario no está eliminado
    codigo_validacion CHAR(100), -- Codigo de validación del correo electrónico
    codigo_recuperacion  CHAR(100), -- Código  de recuperación de la contraseña
    last_auth_date DATETIME, -- Última autenticación del usuario
    CONSTRAINT usuarios_administrador_ck1 CHECK (administrador = 1 OR administrador = 0), -- Hacemos que el campo administrador se asemeje a un booleano
	CONSTRAINT usuarios_verificado_ck2 CHECK (verificado = 1 OR verificado = 0), -- Hacemos que el campo verificado se asemeje a un booleano
    CONSTRAINT usuarios_eliminado_ck3 CHECK (eliminado = 1 OR eliminado = 0)
);

CREATE TABLE espacios (
    ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	tipo ENUM("Sala de reuniones", "Oficina individual", "Auditorio", "Sala audiovisual", "Oficina compartida") NOT NULL, -- Solo existirán los tipos de espacios aquí definidos
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT NOT NULL, 
    precio SMALLINT UNSIGNED NOT NULL,
    aforo SMALLINT UNSIGNED NOT NULL,
    habilitado TINYINT DEFAULT 1,
    CONSTRAINT espacios_precio_ck1 CHECK (precio > 0),
    CONSTRAINT espacios_aforo_ck2 CHECK (aforo > 0),
    CONSTRAINT espacios_habilitado_ck3 CHECK (habilitado = 0 OR habilitado = 1)
);

CREATE TABLE fotos (
	ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    url VARCHAR(50) UNIQUE NOT NULL, -- URL de la imagen
	id_espacio INT UNSIGNED,  
    CONSTRAINT espacios_fotos_fk1 FOREIGN KEY (id_espacio)
		REFERENCES espacios (ID)
);

CREATE TABLE packs ( -- Los packs serán conjuntos preestablecidos de servicios que se incluirán en el pedido
    ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tipo ENUM('Básico', 'Intermedio', 'Audiovisual', 'Informático') NOT NULL, -- Algunos de los tipos de packs que existirán, se añadirán más durante el desarrollo del proyecto 
    texto_contenido TEXT NOT NULL, -- Todos los servicios que incluirá cada pack (mayor velocidad de conexión, proyector, acceso a cafetería...)
    precio SMALLINT UNSIGNED NOT NULL,
    foto VARCHAR(50) NOT NULL -- URL de la imagen
);

CREATE TABLE valoraciones (
    ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
    comentario VARCHAR(500) NOT NULL, 
    calificacion TINYINT UNSIGNED DEFAULT 5, 
    fecha_valoracion DATE NOT NULL, 
    id_usuario INT UNSIGNED NOT NULL, 
    id_espacio INT UNSIGNED NOT NULL,     
    CONSTRAINT valoraciones_usuarios_fk1 FOREIGN KEY (id_usuario) 
        REFERENCES usuarios (ID), 
    CONSTRAINT valoraciones_espacios_fk2 FOREIGN KEY (id_espacio) 
        REFERENCES espacios (ID), 
    CONSTRAINT valoraciones_calificacion_ck1 CHECK (calificacion BETWEEN 1 AND 10)
);

CREATE TABLE reportes (
    ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    categoria ENUM('Hardware', 'Software', 'Conectividad', 'Limpieza', 'Atención al cliente', 'Otros') NOT NULL, 
    descripcion VARCHAR(500) NOT NULL,
    resuelta TINYINT DEFAULT 0, -- Por defecto, un reporte no estará resuelto (0) al momento de publicarlo 
    fecha_incidencia TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    foto VARCHAR(50) UNIQUE,
    id_usuario INT UNSIGNED NOT NULL,
    id_espacio INT UNSIGNED NOT NULL,
    CONSTRAINT reportes_usuarios_fk1 FOREIGN KEY (id_usuario)
        REFERENCES usuarios (ID),
    CONSTRAINT reportes_espacios_fk2 FOREIGN KEY (id_espacio)
        REFERENCES espacios (ID),
    CONSTRAINT reportes_resuelta_ck1 CHECK (resuelta IN (0 , 1)) -- Hacemos que el campo resuelta se asemeje a un booleano
);

CREATE TABLE pedidos (
    ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Momento en el que se realiza la reserva
    fecha_inicio DATE NOT NULL, -- Fecha de inicio del periodo reservado
    fecha_fin DATE NOT NULL,	-- Fecha final del periodo reservado
    precio_pedido SMALLINT UNSIGNED NOT NULL, -- Precio total del pedido (precio pack + precio espacio)
    id_usuario INT UNSIGNED NOT NULL,
    id_espacio INT UNSIGNED NOT NULL,
    id_pack INT UNSIGNED NOT NULL,
    CONSTRAINT pedidos_usuarios_fk1 FOREIGN KEY (id_usuario)
        REFERENCES usuarios (ID),
    CONSTRAINT pedidos_espacios_fk2 FOREIGN KEY (id_espacio)
        REFERENCES espacios (ID),
    CONSTRAINT pedidos_packs_fk3 FOREIGN KEY (id_pack)
        REFERENCES packs (ID),
    CONSTRAINT espacios_fecha_inicio_uq1 UNIQUE (id_espacio, fecha_inicio), -- Nos aseguramos que no se puede reservar el mismo espacio en la misma fecha más de una vez
    CONSTRAINT espacios_fecha_fin_uq2 UNIQUE (id_espacio, fecha_fin),  -- Nos aseguramos que no se puede reservar el mismo espacio en la misma fecha más de una vez
    CONSTRAINT pedido_precio_ck1 CHECK(precio_pedido > 0),
    CONSTRAINT pedidos_fechas_ck2 CHECK(fecha_inicio <= fecha_fin AND fecha_pedido <= fecha_inicio) /* Nos aseguramos de que la fecha de inicio de la reserva es anterior 																								antes del día en el que se realiza el pedido */    
	);
    
    
    