/* 
Script de creación de la base de datos para el proyecto "GESTIÓN DE COWORKING".

    Creado por:
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
    foto VARCHAR(50) DEFAULT 'img/default.png', -- En caso de que un usuario no suba una foto, le asignaremos una por defecto
    localidad VARCHAR(200) NOT NULL,
    biografia VARCHAR(280),
    email VARCHAR(100) NOT NULL UNIQUE, -- UNIQUE para que no se pueda crear más de un usuario con el mismo correo
    tlf VARCHAR(30) NOT NULL UNIQUE, -- UNIQUE para que no se pueda crear más de un usuario con el mismo teléfono
    administrador TINYINT DEFAULT 0, -- Por defecto, los usuarios no serán administradores
    fecha_nacimiento DATE NOT NULL,
    CONSTRAINT usuarios_administrador_ck1 CHECK (administrador = 1 OR administrador = 0) -- Hacemos que el campo administrador se asemeje a un booleano
);

CREATE TABLE espacios (
    ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	tipo ENUM("Sala de reuniones", "Oficina individual", "Auditorio", "Sala audiovisual", "Oficina compartida") NOT NULL, -- Solo existirán los tipos de espacios aquí definidos
    nombre VARCHAR(50) NOT NULL,
    hora_apertura TIME NOT NULL,
    hora_cierre TIME NOT NULL, 
    precio SMALLINT UNSIGNED NOT NULL    
);

CREATE TABLE packs ( -- Los packs serán conjuntos preestablecidos de servicios que se incluirán en el pedido
    ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tipo ENUM('Básico', 'Intermedio', 'Audiovisual', 'Informático') NOT NULL, -- Algunos de los tipos de packs que existirán, se añadirán más durante el desarrollo del proyecto 
    texto_contenido TEXT NOT NULL, -- Todos los servicios que incluirá cada pack (mayor velocidad de conexión, proyector, cafetería...)
    precio SMALLINT UNSIGNED NOT NULL
);

CREATE TABLE valoraciones (
    ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    comentario VARCHAR(500) NOT NULL,
    calificacion TINYINT UNSIGNED DEFAULT 5, 
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
    fecha_incidencia DATE NOT NULL,
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
    fecha_pedido DATETIME NOT NULL, -- Momento en el que se realiza la reserva
    fecha_inicio DATE NOT NULL, -- Fecha de inicio del periodo reservado
    fecha_fin DATE NOT NULL,	-- Fecha final del periodo reservado
    precio_pedido SMALLINT NOT NULL, -- Precio total del pedido (precio pack + precio espacio)
    hora_uso_inicio TIME NOT NULL, -- Hora a la que tendrán acceso al espacio reservado cada uno de los días (todos a la misma hora) dentro del periodo reservado
    hora_uso_fin TIME NOT NULL, -- Hora a la que dejarán de tener acceso al espacio reservado cada uno de los días (todos a la misma hora) dentro del periodo reservado
    id_usuario INT UNSIGNED NOT NULL,
    id_espacio INT UNSIGNED NOT NULL,
    id_pack INT UNSIGNED NOT NULL,
    CONSTRAINT pedidos_usuarios_fk1 FOREIGN KEY (id_usuario)
        REFERENCES usuarios (ID),
    CONSTRAINT pedidos_espacios_fk2 FOREIGN KEY (id_espacio)
        REFERENCES espacios (ID),
    CONSTRAINT pedidos_packs_fk3 FOREIGN KEY (id_pack)
        REFERENCES packs (ID),
    CONSTRAINT pedididos_fechas_ck1 CHECK(fecha_inicio <= fecha_fin AND fecha_pedido <= fecha_inicio) /* Nos aseguramos de que la fecha de inicio de la reserva es anterior 
                                                                                                        a la fecha de finalización de la misma y de que no se hace una reserva que se inicie
                                                                                                        antes del día en el que se realiza el pedido */    
);