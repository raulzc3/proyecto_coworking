
CREATE DATABASE IF NOT EXISTS coworking CHARSET "utf8mb4" COLLATE "utf8mb4_spanish_ci";

USE coworking;

CREATE TABLE usuarios (
    ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
    nombre VARCHAR(50) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    foto VARCHAR(50) DEFAULT 'img/default.png',
    localidad VARCHAR(200) NOT NULL,
    biografia VARCHAR(280),
    email VARCHAR(100) NOT NULL UNIQUE,
    tlf VARCHAR(30) NOT NULL UNIQUE,
    administrador TINYINT DEFAULT 0,
    fecha_nacimiento DATE NOT NULL,
    CONSTRAINT usuarios_administrador_ck1 CHECK (administrador = 1 OR administrador = 0)
);

CREATE TABLE espacios (
    ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	tipo ENUM("Sala de reuniones", "Oficina individual", "Auditorio", "Sala audiovisual", "Oficina compartida") NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    hora_apertura TIME NOT NULL,
    hora_cierre TIME NOT NULL,
    precio SMALLINT UNSIGNED NOT NULL    
);

CREATE TABLE packs (
    ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tipo ENUM('Básico', 'Intermedio', 'Audiovisual', 'Informático') NOT NULL,
    texto_contenido TEXT NOT NULL, -- Extras que incluirá cada pack
    precio SMALLINT UNSIGNED NOT NULL
);

CREATE TABLE valoraciones (
    ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    calificacion TINYINT UNSIGNED DEFAULT 5,
    comentario VARCHAR(500) NOT NULL,
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
    resuelta TINYINT DEFAULT 0,
    fecha_incidencia DATE NOT NULL,
    id_usuario INT UNSIGNED NOT NULL,
    id_espacio INT UNSIGNED NOT NULL,
    CONSTRAINT reportes_usuarios_fk1 FOREIGN KEY (id_usuario)
        REFERENCES usuarios (ID),
    CONSTRAINT reportes_espacios_fk2 FOREIGN KEY (id_espacio)
        REFERENCES espacios (ID),
    CONSTRAINT reportes_resuelta_ck1 CHECK (resuelta IN (0 , 1))
);


CREATE TABLE pedidos (
    ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    fecha_pedido DATETIME NOT NULL, -- Momento en el que se realiza la reserva
    fecha_inicio DATE NOT NULL, -- Fecha de inicio de la reserva
    fecha_fin DATE NOT NULL,	-- Fecha fin de la reserva 
    precio_pedido SMALLINT NOT NULL, -- Precio total del pedido (pack + espacio)
    hora_uso_inicio TIME NOT NULL, -- Hora a la que tendrán acceso al espacio reservado
    hora_uso_fin TIME NOT NULL, -- Hora a la que dejarán de tener acceso al espacio reservado 
    id_usuario INT UNSIGNED NOT NULL,
    id_espacio INT UNSIGNED NOT NULL,
    id_pack INT UNSIGNED NOT NULL,
    CONSTRAINT pedidos_usuarios_fk1 FOREIGN KEY (id_usuario)
        REFERENCES usuarios (ID),
    CONSTRAINT pedidos_espacios_fk2 FOREIGN KEY (id_espacio)
        REFERENCES espacios (ID),
    CONSTRAINT pedidos_packs_fk3 FOREIGN KEY (id_pack)
        REFERENCES packs (ID),
    CONSTRAINT pedididos_fechas_ck1 CHECK(fecha_inicio <= fecha_fin AND fecha_pedido <= fecha_inicio) 
);
