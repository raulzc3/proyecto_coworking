require("dotenv").config();
const { parseISO } = require("date-fns");
const faker = require("faker");
const { random } = require("lodash");
const getDB = require("./db.js");
const { formatDateToDB } = require("./helpers");

let connection;
async function main() {
  try {
    connection = await getDB();
    console.log("****************************");
    console.log("* Borrando tablas antiguas *");
    console.log("****************************");

    //Borrar tablas
    await connection.query(`DROP TABLE IF EXISTS pedidos`);
    console.log("Tabla pedidos eliminada");
    await connection.query(`DROP TABLE IF EXISTS reportes`);
    console.log("Tabla reportes eliminada");
    await connection.query(`DROP TABLE IF EXISTS valoraciones`);
    console.log("Tabla valoraciones eliminada");
    await connection.query(`DROP TABLE IF EXISTS fotos`);
    console.log("Tabla fotos eliminada");
    await connection.query(`DROP TABLE IF EXISTS usuarios`);
    console.log("Tabla usuarios eliminada");
    await connection.query(`DROP TABLE IF EXISTS espacios`);
    console.log("Tabla espacios eliminada");
    await connection.query(`DROP TABLE IF EXISTS packs`);

    console.log("**********************************************************");
    console.log("* Tablas antiguas borradas, iniciando creación de tablas *");
    console.log("**********************************************************");

    //Creamos de nuevo las tablas
    // Crear tabla usuarios

    await connection.query(`
    CREATE TABLE usuarios (
      ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(50) NOT NULL,
      apellidos VARCHAR(100) NOT NULL,
      nif CHAR(9) NOT NULL UNIQUE,
      clave VARCHAR(512) NOT NULL, -- Contraseña del usuario (cifrada)
      foto VARCHAR(50) DEFAULT '/img/default.png', -- En caso de que un usuario no suba una foto, le asignaremos una por defecto
      email VARCHAR(100) NOT NULL UNIQUE, -- UNIQUE para que no se pueda crear más de un usuario con el mismo correo
      tlf VARCHAR(30) UNIQUE, -- UNIQUE para que no se pueda crear más de un usuario con el mismo teléfono
      fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
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
`);
    console.log("Tabla usuarios creados");

    //Crear tabla espacios

    await connection.query(`
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
        `);
    console.log("Tabla espacios creada");

    //Crear tabla fotos

    await connection.query(`
    CREATE TABLE fotos (
        ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        url VARCHAR(50) UNIQUE NOT NULL, -- URL de la imagen
        id_espacio INT UNSIGNED,  
    CONSTRAINT espacios_fotos_fk1 FOREIGN KEY (id_espacio)
        REFERENCES espacios (ID)
    );`);
    console.log("Tabla fotos creada");

    //Crear tabla packs

    await connection.query(`        
    CREATE TABLE packs ( -- Los packs serán conjuntos preestablecidos de servicios que se incluirán en el pedido
        ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        tipo ENUM('Básico', 'Intermedio', 'Audiovisual', 'Informático') NOT NULL, -- Algunos de los tipos de packs que existirán, se añadirán más durante el desarrollo del proyecto 
        texto_contenido TEXT NOT NULL, -- Todos los servicios que incluirá cada pack (mayor velocidad de conexión, proyector, acceso a cafetería...)
        precio SMALLINT UNSIGNED NOT NULL,
        foto VARCHAR(50) NOT NULL -- URL de la imagen
);`);
    console.log("Tabla packs creada");

    const frases = [
      "¿Este ejercicio lo puse yo? Pues no tego ni puta idea de cómo se resuelve.",
      "Algún día se acabarán tambien las IPs de IPv6, pero ese día ya no estaremos aquí. Por lo tanto: nos la suda.",
      "Poner el where en una sentencia DELETE FROM es una de las enseñanzas más importantes de la vida, pero no tanto como 'O viño non é auga'.",
      "Teneis que seguir la regla RTFM: Read the Fucking Manual.",
      "Lula, roncas como un minero con silicosis",
      "Berto ha salido a pasear a Lula y no nos ha dejado más frases épicas :'(",
    ];

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
            fecha_incidencia TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
    );`);
    console.log("Tabla pedidos creada");

    //Introducimos datos de prueba:
    console.log(
      "******************************************************************"
    );
    console.log(
      "* Fin de la creación de las tablas, iniciando inserción de datos *"
    );
    console.log(
      "******************************************************************"
    );

    // Inserición de usuarios aleatorios
    const users = 10;

    for (let index = 0; index < users; index++) {
      const name = faker.name.findName();
      const lastName = faker.name.lastName();
      const nif = random(10000000, 99999999) + faker.random.alpha();
      const password = faker.internet.password();
      const email = faker.internet.email();
      const tlf = faker.phone.phoneNumber();
      const company = faker.company.companyName();
      const birthDay = new Date(
        random(1950, 2003),
        random(1, 12),
        random(1, 28)
      );
      const verified = random(0, 1);

      await connection.query(`
        INSERT INTO usuarios(nombre, apellidos, nif, clave,email,tlf,fecha_nacimiento, empresa, verificado)
        VALUES("${name}","${lastName}", "${nif}",SHA2("${password}", 512),"${email}","${tlf}","${formatDateToDB(
        birthDay
      )}", "${company}", ${verified})
      `);
    }
    console.log("Datos de usuarios añadidos");

    // Inserción de espacios
    const listTypeSpaces = [
      "Sala de reuniones",
      "Oficina individual",
      "Auditorio",
      "Sala audiovisual",
      "Oficina compartida",
    ];

    const numSpaces = 10;

    for (let i = 0; i < numSpaces; i++) {
      const description = faker.lorem.paragraph();
      await connection.query(`
      INSERT INTO espacios (tipo, nombre, descripcion, precio, aforo)
      VALUES ("${
        listTypeSpaces[random(0, 4)]
      }","espacio_${i}", "${description}" ,${
        random(5, 15) * random(1, 5)
      },${random(1, 50)})
      
      `);
    }
    console.log("Datos de espacios añadidos");

    // Inserción de fotos
    for (let i = 0; i < numSpaces; i++) {
      const urlImageOfSpace = `http://placeimg.com/640/48${i}`;
      await connection.query(`
    INSERT INTO fotos (ID, url,id_espacio)
    VALUES (NULL,"${urlImageOfSpace}",${i + 1})
        `);
    }
    console.log("Datos de fotos añadidos");

    // Inserción de packs
    await connection.query(`
    INSERT INTO packs (tipo, texto_contenido, precio, foto)
    VALUES ("Básico", "Si quieres más, paga", 0, "img/pack1.jpg"),
    ("Intermedio", "Este no está mal, pero podría estar mejor", 5, "img/pack2.jpg"),
    ("Audiovisual", "Tus presentaciones parecerán películas", 10, "img/pack3.jpg"),
    ("Informático", "Podrás sacar al hacker que llevas dentro", 15, "img/pack4.jpg");
    `);
    console.log("Datos de packs añadidos");

    // Inserción de valoraciones
    const valoraciones = 50;

    for (let index = 0; index < valoraciones; index++) {
      const coment = faker.lorem.sentence();
      const rating = random(1, 10);
      const valorationDate = formatDateToDB(faker.date.past());
      const userId = random(1, users);
      const spacesId = random(1, numSpaces);

      await connection.query(`
        INSERT INTO valoraciones(comentario,calificacion, fecha_valoracion, id_usuario, id_espacio)
        VALUES("${coment}",${rating},"${valorationDate}",${userId},${spacesId})
      `);
    }
    console.log("Datos de valoraciones añadidos");

    // Inserción de reportes

    const reportes = 20;
    const listOfReportsCategories = [
      "Hardware",
      "Software",
      "Conectividad",
      "Limpieza",
      "Atención al cliente",
      "Otros",
    ];

    for (let i = 0; i < reportes; i++) {
      const category = listOfReportsCategories[random(0, 5)];
      const description = faker.lorem.paragraph();
      const solved = random(0, 1);
      const reportDate = formatDateToDB(faker.date.recent());
      const urlImageOfSpace = `./files/reports/report_${i}.jpg`;
      const spaceId = random(1, numSpaces);
      const userId = random(1, users);

      await connection.query(`
     INSERT INTO reportes (categoria, descripcion, resuelta, fecha_incidencia, foto, id_espacio, id_usuario)
     VALUES ("${category}","${description}",${solved},"${reportDate}","${urlImageOfSpace}",${spaceId},${userId})`);
    }

    console.log("Datos de reportes añadidos");

    // Inserción de pedidos
    const orders = 20;

    for (let i = 0; i < orders; i++) {
      const orderDate = formatDateToDB(faker.date.past());
      const bookingEnd = faker.date.future();
      const bookingBegin = faker.date.between(orderDate, bookingEnd);
      const reservedDays = Math.ceil(
        Math.abs(
          new Date(bookingEnd).getTime() - new Date(bookingBegin).getTime()
        ) /
          (1000 * 3600 * 24)
      );
      const userID = random(1, users);
      const packID = random(1, 4);
      const spaceID = random(1, numSpaces);
      const [
        result,
      ] = await connection.query(`SELECT SUM(e.precio+p.precio) as "precio" 
                                                FROM espacios e, packs p 
                                                WHERE e.id =${spaceID} AND p.id=${packID}`);
      const [object] = result;
      let { precio } = object;
      precio *= reservedDays;

      await connection.query(`
            INSERT INTO pedidos (fecha_pedido, fecha_inicio, fecha_fin, precio_pedido, id_usuario, id_espacio, id_pack) 
            VALUES ("${orderDate}","${formatDateToDB(
        bookingBegin
      )}", "${formatDateToDB(
        bookingEnd
      )}", ${precio}, ${userID}, ${spaceID}, ${packID});
        `);
    }

    console.log("Datos de pedidos añadidos");

    console.log("**********************");
    console.log("* Init DB finalizado *");
    console.log("**********************");

    console.log("Y para acabar, una frase épica de Berto:");
    console.log(frases[random(0, 5)]);
  } catch (error) {
    console.error(error);
  } finally {
    // Libera la conexión
    if (connection) connection.release();
    process.exit();
  }
}

main();
