require("dotenv").config();
const faker = require("faker");
const { random } = require("lodash");
const getDB = require("./db.js");
const { formatDateToDB } = require("./helpers");

if (process.env.NODE_ENV !== "development") process.exit();
/*

 ********************************************************************************************************************************
 * Este script puede mostrar un error en el momento de la inserción de datos en algunas tablas, si esto pasa: ejecutar de nuevo *
 ********************************************************************************************************************************

 El error es producido por las restricciones creadas en la base de datos, al introducir datos aleatorios no podemos controlar que
 no se produzcan colisiones con determinados campos UNIQUE

 */

let connection;
async function main() {
  try {
    connection = await getDB();
    console.log("****************************");
    console.log("* Borrando tablas antiguas *");
    console.log("****************************");

    //Borrar tablas
    await connection.query(`DROP TABLE IF EXISTS reviews`);
    console.log("Tabla reviews eliminada");
    await connection.query(`DROP TABLE IF EXISTS reports`);
    console.log("Tabla reports eliminada");
    await connection.query(`DROP TABLE IF EXISTS orders`);
    console.log("Tabla orders eliminada");
    await connection.query(`DROP TABLE IF EXISTS photos`);
    console.log("Tabla photos eliminada");
    await connection.query(`DROP TABLE IF EXISTS users`);
    console.log("Tabla users eliminada");
    await connection.query(`DROP TABLE IF EXISTS spaces`);
    console.log("Tabla spaces eliminada");
    await connection.query(`DROP TABLE IF EXISTS packs`);
    console.log("Tabla packs eliminada");

    console.log("**********************************************************");
    console.log("* Tablas antiguas borradas, iniciando creación de tablas *");
    console.log("**********************************************************");

    //Creamos de nuevo las tablas

    // Crear tabla users

    await connection.query(`
    CREATE TABLE users (
      ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      surname VARCHAR(100) NOT NULL,
      nif CHAR(9) UNIQUE,
      password VARCHAR(512) NOT NULL,
      photo VARCHAR(50) NOT NULL DEFAULT '/img/default.png', 
      email VARCHAR(100) NOT NULL UNIQUE,
      tel VARCHAR(30) UNIQUE, 
      registration_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
      company VARCHAR(50), 
      admin TINYINT DEFAULT 0, 
      verified TINYINT DEFAULT 0, 
      deleted TINYINT DEFAULT 0, 
      validation_code CHAR(100),
      recovery_code  CHAR(100), 
      last_auth_date DATETIME,
      CONSTRAINT users_admin_ck1 CHECK (admin = 1 OR admin = 0),
      CONSTRAINT users_verified_ck2 CHECK (verified = 1 OR verified = 0),
      CONSTRAINT users_deleted_ck3 CHECK (deleted = 1 OR deleted = 0)
  );
`);
    console.log("Tabla users creados");

    //Crear tabla espacios

    await connection.query(`
    CREATE TABLE spaces (
      ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      type ENUM("Sala de reuniones", "Oficina individual", "Auditorio", "Sala audiovisual", "Oficina compartida") NOT NULL, 
      name VARCHAR(50) NOT NULL,
      description TEXT NOT NULL, 
      price SMALLINT UNSIGNED NOT NULL,
      capacity SMALLINT UNSIGNED NOT NULL,
      enabled TINYINT DEFAULT 1,
    CONSTRAINT spaces_price_ck1 CHECK (price > 0),
    CONSTRAINT spaces_capacity_ck2 CHECK (capacity > 0),
    CONSTRAINT spaces_enabled_ck3 CHECK (enabled = 0 OR enabled = 1)
  );
        `);
    console.log("Tabla spaces creada");

    //Crear tabla photos

    await connection.query(`
    CREATE TABLE photos (
        ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        url VARCHAR(50) UNIQUE NOT NULL, 
        space_id INT UNSIGNED,  
        CONSTRAINT spaces_photos_fk1 FOREIGN KEY (space_id)
        REFERENCES spaces (ID)
    );
    `);
    console.log("Tabla photos creada");

    //Crear tabla packs

    await connection.query(`        
    CREATE TABLE packs ( 
      ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      type ENUM('Básico', 'Intermedio', 'Audiovisual', 'Informático') NOT NULL, 
      content TEXT NOT NULL, 
      price SMALLINT UNSIGNED NOT NULL,
      photo VARCHAR(50) NOT NULL 
  );
    `);
    console.log("Tabla packs creada");

    const frases = [
      "¿Este ejercicio lo puse yo? Pues no tego ni puta idea de cómo se resuelve.",
      "Algún día se acabarán tambien las IPs de IPv6, pero ese día ya no estaremos aquí. Por lo tanto: nos la suda.",
      "Poner el WHERE en una sentencia DELETE FROM es una de las enseñanzas más importantes de la vida, pero no tanto como 'O viño non é auga'.",
      "Teneis que seguir la regla RTFM: Read The Fucking Manual.",
      "Lula, roncas como un minero con silicosis",
      "Berto ha salido a pasear a Lula y no nos ha dejado más frases épicas :'(",
    ];

    //Crear tabla reviews

    await connection.query(`
    CREATE TABLE reviews (
      ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
      comment VARCHAR(500) NOT NULL, 
      score TINYINT UNSIGNED DEFAULT 5, 
      review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      user_id INT UNSIGNED NOT NULL, 
      space_id INT UNSIGNED NOT NULL,     
      CONSTRAINT reviews_users_fk1 FOREIGN KEY (user_id) 
          REFERENCES users (ID), 
      CONSTRAINT reviews_spaces_fk2 FOREIGN KEY (space_id) 
          REFERENCES spaces (ID), 
      CONSTRAINT reviews_score_ck1 CHECK (score BETWEEN 1 AND 10)
    );`);
    console.log("Tabla reviews creada");

    //Crear tabla reports

    await connection.query(`
    CREATE TABLE reports (
      ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      category ENUM('Hardware', 'Software', 'Conectividad', 'Limpieza', 'Atención al cliente', 'Otros') NOT NULL, 
      description VARCHAR(500) NOT NULL,
      solved TINYINT DEFAULT 0, 
      report_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      photo VARCHAR(50) UNIQUE,
      user_id INT UNSIGNED NOT NULL,
      space_id INT UNSIGNED NOT NULL,
      CONSTRAINT reports_users_fk1 FOREIGN KEY (user_id)
          REFERENCES users (ID),
      CONSTRAINT reports_spaces_fk2 FOREIGN KEY (space_id)
          REFERENCES spaces (ID),
      CONSTRAINT reports_solved_ck1 CHECK (solved IN (0 , 1)) 
    );
  
        `);
    console.log("Tabla reports creada");

    //Crear tabla pedidos

    await connection.query(`
    CREATE TABLE orders (
      ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
      start_date DATE NOT NULL, 
      end_date DATE NOT NULL,	
      price SMALLINT UNSIGNED NOT NULL, 
      user_id INT UNSIGNED NOT NULL,
      space_id INT UNSIGNED NOT NULL,
      pack_id INT UNSIGNED NOT NULL,
      CONSTRAINT orders_users_fk1 FOREIGN KEY (user_id)
          REFERENCES users (ID),
      CONSTRAINT orders_spaces_fk2 FOREIGN KEY (space_id)
          REFERENCES spaces (ID),
      CONSTRAINT orders_packs_fk3 FOREIGN KEY (pack_id)
          REFERENCES packs (ID),
      CONSTRAINT spaces_start_date_uq1 UNIQUE (space_id, start_date),
      CONSTRAINT spaces_end_date_uq2 UNIQUE (space_id, end_date), 
      CONSTRAINT orders_price_ck1 CHECK(price > 0),
      CONSTRAINT orders_dates_ck2 CHECK(start_date <= end_date AND order_date <= start_date)
    );
      `);
    console.log("Tabla orders creada");

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

    // Inserición de usuario administrador
    await connection.query(`
    INSERT INTO users(name, surname, nif, password, email, tel, company, verified, admin)
    VALUES("SUPERADMIN","SUPERADMIN", "123456789",SHA2("${process.env.ADMIN_PASSWORD}", 512),"${process.env.ADMIN_EMAIL}","000000000","COWORKIT", 1,1)
    `);
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
      const verified = random(0, 1);

      await connection.query(`
        INSERT INTO users(name, surname, nif, password, email, tel, company, verified)
        VALUES("${name}","${lastName}", "${nif}",SHA2("${password}", 512),"${email}","${tlf}","${company}", ${verified})
      `);
    }
    console.log("Datos de users añadidos");

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
      INSERT INTO spaces (type, name, description, price, capacity)
      VALUES ("${
        listTypeSpaces[random(0, 4)]
      }","espacio_${i}", "${description}" ,${
        random(5, 15) * random(1, 5)
      },${random(1, 50)})
      
      `);
    }
    console.log("Datos de spaces añadidos");

    // Inserción de fotos
    for (let i = 0; i < numSpaces; i++) {
      const urlImageOfSpace = `http://placeimg.com/640/48${i}`;
      await connection.query(`
    INSERT INTO photos (url, space_id)
    VALUES ("${urlImageOfSpace}",${i + 1})
        `);
    }
    console.log("Datos de photos añadidos");

    // Inserción de packs
    await connection.query(`
    INSERT INTO packs (type, content, price, photo)
    VALUES ("Básico", "Si quieres más, paga", 0, "img/pack1.jpg"),
    ("Intermedio", "Este no está mal, pero podría estar mejor", 5, "img/pack2.jpg"),
    ("Audiovisual", "Tus presentaciones parecerán películas", 10, "img/pack3.jpg"),
    ("Informático", "Podrás sacar al hacker que llevas dentro", 15, "img/pack4.jpg");
    `);
    console.log("Datos de packs añadidos");

    // Inserción de reviews
    const reviews = 50;

    for (let index = 0; index < reviews; index++) {
      const coment = faker.lorem.sentence();
      const rating = random(1, 10);
      const userId = random(1, users);
      const spacesId = random(1, numSpaces);

      await connection.query(`
        INSERT INTO reviews(comment, score,  user_id, space_id)
        VALUES("${coment}",${rating},${userId},${spacesId})
      `);
    }
    console.log("Datos de reviews añadidos");

    // Inserción de incidencias

    const reports = 20;
    const listOfReportsCategories = [
      "Hardware",
      "Software",
      "Conectividad",
      "Limpieza",
      "Atención al cliente",
      "Otros",
    ];

    for (let i = 0; i < reports; i++) {
      const category = listOfReportsCategories[random(0, 5)];
      const description = faker.lorem.paragraph();
      const solved = random(0, 1);
      const reportDate = formatDateToDB(faker.date.recent());
      const urlImageOfSpace = `./files/reports/report_${i}.jpg`;
      const spaceId = random(1, numSpaces);
      const userId = random(1, users);

      await connection.query(`
     INSERT INTO reports (category, description, solved, report_Date, photo, space_id, user_id)
     VALUES ("${category}","${description}",${solved},"${reportDate}","${urlImageOfSpace}",${spaceId},${userId})`);
    }

    console.log("Datos de reports añadidos");

    // Inserción de pedidos
    const orders = 20;

    for (let i = 0; i < orders; i++) {
      const orderDate = formatDateToDB(faker.date.past());
      const end_dates = [
        faker.date.future(),
        faker.date.between(orderDate, new Date()),
      ];
      const bookingEnd = end_dates[random(0, 1)];
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
      ] = await connection.query(`SELECT SUM(s.price+p.price) as "price" 
                                                FROM spaces s, packs p 
                                                WHERE s.id =${spaceID} AND p.id=${packID}`);
      const [object] = result;
      let { price } = object;
      price *= reservedDays;

      await connection.query(`
            INSERT INTO orders (order_date, start_date, end_date, price, user_id, space_id, pack_id) 
            VALUES ("${orderDate}","${formatDateToDB(
        bookingBegin
      )}", "${formatDateToDB(
        bookingEnd
      )}", ${price}, ${userID}, ${spaceID}, ${packID});
        `);
    }

    console.log("Datos de orders añadidos");

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
