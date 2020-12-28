require("dotenv").config();
const faker = require("faker");
const { random } = require("lodash");
const getDB = require("./db.js");
const { formatDateToDB } = require("./helpers");
let connection;
async function main() {
  try {
    connection = await getDB();

    //Borrar tablas
    await connection.query(`DROP TABLE IF EXISTS pedidos`);
    await connection.query(`DROP TABLE IF EXISTS reportes`);
    await connection.query(`DROP TABLE IF EXISTS valoraciones`);
    await connection.query(`DROP TABLE IF EXISTS fotos`);
    await connection.query(`DROP TABLE IF EXISTS usuarios`);
    await connection.query(`DROP TABLE IF EXISTS espacios`);
    await connection.query(`DROP TABLE IF EXISTS packs`);

    console.log("Tablas  borradas");

    // Crear tabla espacios

    await connection.query(`

CREATE TABLE usuarios (
    ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    nif CHAR(9) NOT NULL UNIQUE,
    clave VARCHAR(500) NOT NULL, 
    foto VARCHAR(50) DEFAULT '/img/default.png', 
    email VARCHAR(100) NOT NULL UNIQUE, 
    tlf VARCHAR(30) NOT NULL UNIQUE, 
    administrador TINYINT DEFAULT 0, 
    verificado TINYINT DEFAULT 0, 
    fecha_nacimiento DATE NOT NULL,
    empresa VARCHAR(50), 
    CONSTRAINT usuarios_administrador_ck1 CHECK (administrador = 1 OR administrador = 0),
	CONSTRAINT usuarios_verificado_ck2 CHECK (verificado = 1 OR verificado = 0)
);
`);
    console.log("Tabla usuarios creados");

    //Crear tabla espacios

    await connection.query(`
    CREATE TABLE espacios (
        ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        tipo ENUM("Sala de reuniones", "Oficina individual", "Auditorio", "Sala audiovisual", "Oficina compartida") NOT NULL, 
        nombre VARCHAR(50) NOT NULL,
        precio SMALLINT UNSIGNED NOT NULL,
        aforo SMALLINT UNSIGNED NOT NULL
        );
        `);
    console.log("Tabla espacios creada");

    //Crear tabla fotos

    await connection.query(`

        CREATE TABLE fotos (
            ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            url VARCHAR(50) UNIQUE NOT NULL, 
            id_espacio INT UNSIGNED,  
            CONSTRAINT espacios_fotos_fk1 FOREIGN KEY (id_espacio)
                REFERENCES espacios (ID)
        );`);
    console.log("Tabla fotos creada");

    //Crear tabla packs

    await connection.query(`
        CREATE TABLE packs ( 
            ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            tipo ENUM('Básico', 'Intermedio', 'Audiovisual', 'Informático') NOT NULL, 
            texto_contenido TEXT NOT NULL, 
            precio SMALLINT UNSIGNED NOT NULL,
            foto VARCHAR(50) NOT NULL 
        );`);
    console.log("Tabla packs creada");

    //Crear tabla valoraciones

    await connection.query(`
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
        );`);
    console.log("Tabla valoraciones creada");

    //Crear tabla reportes

    await connection.query(`
        CREATE TABLE reportes (
            ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            categoria ENUM('Hardware', 'Software', 'Conectividad', 'Limpieza', 'Atención al cliente', 'Otros') NOT NULL, 
            descripcion VARCHAR(500) NOT NULL,
            resuelta TINYINT DEFAULT 0,
            fecha_incidencia DATE NOT NULL,
            foto VARCHAR(50) UNIQUE,
            id_usuario INT UNSIGNED NOT NULL,
            id_espacio INT UNSIGNED NOT NULL,
            CONSTRAINT reportes_usuarios_fk1 FOREIGN KEY (id_usuario)
                REFERENCES usuarios (ID),
            CONSTRAINT reportes_espacios_fk2 FOREIGN KEY (id_espacio)
                REFERENCES espacios (ID),
            CONSTRAINT reportes_resuelta_ck1 CHECK (resuelta IN (0 , 1))
        );`);
    console.log("Tabla reportes creada");

    //Crear tabla pedidos

    await connection.query(`
        CREATE TABLE pedidos (
            ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            fecha_pedido DATETIME NOT NULL, 
            fecha_inicio DATE NOT NULL,
            fecha_fin DATE NOT NULL,	
            precio_pedido SMALLINT NOT NULL,
            id_usuario INT UNSIGNED NOT NULL,
            id_espacio INT UNSIGNED NOT NULL,
            id_pack INT UNSIGNED NOT NULL,
            CONSTRAINT pedidos_usuarios_fk1 FOREIGN KEY (id_usuario)
                REFERENCES usuarios (ID),
            CONSTRAINT pedidos_espacios_fk2 FOREIGN KEY (id_espacio)
                REFERENCES espacios (ID),
            CONSTRAINT pedidos_packs_fk3 FOREIGN KEY (id_pack)
                REFERENCES packs (ID)
            -- CONSTRAINT espacios_fecha_inicio_uq1 UNIQUE (id_espacio, fecha_inicio), 
            -- CONSTRAINT espacios_fecha_fin_uq2 UNIQUE (id_espacio, fecha_fin),  
            -- CONSTRAINT pedididos_fechas_ck1 CHECK(fecha_inicio <= fecha_fin AND fecha_pedido <= fecha_inicio)  
            );`);
    console.log("Tabla pedidos creada");

    //Introducimos datos de prueba (10 entradas en la base de datos):
    console.log(
      "Fin de la creación de las tablas, iniciando inserción de datos"
    );

    //Datos tablas packs:
    await connection.query(`
    INSERT INTO packs (tipo, texto_contenido, precio, foto)
    VALUES ("Básico", "Si quieres más, paga", 0, "img/pack1.jpg"),
    ("Intermedio", "Este no está mal, pero podría estar mejor", 5, "img/pack2.jpg"),
    ("Audiovisual", "Tus presentaciones parecerán películas", 10, "img/pack3.jpg"),
    ("Informático", "Podrás sacar al hacker que llevas dentro", 15, "img/pack4.jpg");
    `);
    console.log("Datos añadidos en la tabla packs");

    //creamos espacios para probar
    const listTypeSpaces = [
      "Sala de reuniones",
      "Oficina individual",
      "Auditorio",
      "Sala audiovisual",
      "Oficina compartida",
    ];
    const numSpaces = 10;
    for (let i = 0; i < numSpaces; i++) {
      await connection.query(`
      INSERT INTO espacios (tipo, nombre, precio, aforo)
      VALUES ("${listTypeSpaces[random(0, 4)]}","espacio_${i}",${
        100 * random(1, 5)
      },${random(1, 50)})
      
      `);
    }
    console.log("espacios creados");

    // Introducimos varios usuarios aleatorios
    const users = 10;

    for (let index = 0; index < users; index++) {
      const name = faker.name.findName();
      const lastName = faker.name.lastName();
      const nif = 100000000 + index;
      const password = faker.internet.password();
      const email = faker.internet.email();
      const tlf = faker.phone.phoneNumber();
      const birthDay = faker.date.past();

      await connection.query(`
        INSERT INTO usuarios(nombre, apellidos, nif, clave,email,tlf,fecha_nacimiento)
        VALUES("${name}","${lastName}", "${nif}",SHA2("${password}", 512),"${email}","${tlf}","${formatDateToDB(
        birthDay
      )}")
      `);
    }
    console.log("datos usuarios introducidos");
    const orders = 40;
    //Introducimos pedidos
    for (let i = 0; i < orders; i++) {
      const orderDate = formatDateToDB(faker.date.past());
      const bookingEnd = formatDateToDB(faker.date.future());
      const bookingBegin = formatDateToDB(
        faker.date.between(orderDate, bookingEnd)
      );

      const userID = random(1, 10);
      const packID = random(1, 4);
      const spaceID = random(1, 10);
      const [
        result,
      ] = await connection.query(`SELECT SUM(e.precio+p.precio) as "precio" 
                                                FROM espacios e, packs p 
                                                WHERE e.id =${spaceID} AND p.id=${packID}`);
      const [object] = result;
      const { precio } = object;

      await connection.query(`
            INSERT INTO pedidos (fecha_pedido, fecha_inicio, fecha_fin, precio_pedido, id_usuario, id_espacio, id_pack) 
            VALUES ("${orderDate}","${bookingBegin}", "${bookingEnd}", ${precio}, ${userID}, ${spaceID}, ${packID});
        `);
    }

    console.log("Datos de pedidos introducidos");
    //cremos unas fotos e espacios par probar
    for (let i = 0; i < numSpaces; i++) {
      const urlImageOfSpace = `http://placeimg.com/640/48${i}`;
      await connection.query(`
    INSERT INTO fotos (ID, url,id_espacio)
    VALUES (NULL,"${urlImageOfSpace}",${i + 1})
        `);
    }
    console.log("fotos añadidas");

    // Introducimos varios usuarios valoraciones
    const valoraciones = 50;

    for (let index = 0; index < valoraciones; index++) {
      const coment = faker.lorem.sentence();
      const valoration = random(1, 10);
      const valorationDate = faker.date.past();
      const userId = random(1, 10);
      const spacesId = random(1, 10);

      await connection.query(`
        INSERT INTO valoraciones(comentario,calificacion, fecha_valoracion, id_usuario, id_espacio)
        VALUES("${coment}",${valoration},"${formatDateToDB(
        valorationDate
      )}",${userId},${spacesId})
      `);
    }
    console.log("Datos valoraciones introducidos");

    //creamos unas reportes para probar
    const listOfReportsCategories = [
      "Hardware",
      "Software",
      "Conectividad",
      "Limpieza",
      "Atención al cliente",
      "Otros",
    ];
    for (let i = 0; i < numSpaces; i++) {
      const urlImageOfSpace = `http://placeimg.com/640/48${i}`;
      await connection.query(`
     INSERT INTO reportes (ID, categoria, descripcion, resuelta, fecha_incidencia, foto, id_espacio, id_usuario)
     VALUES (NULL,"${
       listOfReportsCategories[random(0, 5)]
     }","${faker.lorem.paragraph()}",${random(0, 1)},"${formatDateToDB(
        faker.date.recent()
      )}","${urlImageOfSpace}",${i + 1},${i + 1})`);
    }

    console.log("reportes añadidos");
  } catch (error) {
    console.error(error);
  } finally {
    // Libera la conexión
    if (connection) connection.release();
    process.exit();
  }
}

main();
