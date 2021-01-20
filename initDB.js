require("dotenv").config();
const faker = require("faker");
const { random } = require("lodash");
const getDB = require("./db.js");
const { formatDateToDB } = require("./helpers");
const fs = require("fs").promises;

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
    connection;
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

    //Leemos el script de creación de la base de datos
    const sqlScript = await (
      await fs.readFile("./baseDatos/creacionBaseDatos.sql")
    ).toString();

    console.log("Ejecutando creacionBaseDatos.sql...");
    //Ejecutamos el contenido del script sql
    await connection.query(sqlScript);
    console.log("Tablas creadas");

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
    INSERT INTO users(name, surname, nif, password, email, tel, company, verified, admin,last_auth_date)
    VALUES("SUPERADMIN","SUPERADMIN", "123456789",SHA2("${process.env.ADMIN_PASSWORD}", 512),"${process.env.ADMIN_EMAIL}","000000000","COWORKIT", 1,1,"2020-01-01")
    `);
    // Inserición de usuario normal
    await connection.query(`
  INSERT INTO users(name, surname, nif, password, email, tel, company, verified, admin,last_auth_date)
  VALUES("Normal","user", "123456788",SHA2("${process.env.ADMIN_PASSWORD}", 512),"normaluser_coworkit@gmail.com","000000000","COWORKIT", 1,0,"2020-01-01")
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

    // Frases épicas
    const frases = [
      "¿Este ejercicio lo puse yo? Pues no tego ni puta idea de cómo se resuelve.",
      "Algún día se acabarán tambien las IPs de IPv6, pero ese día ya no estaremos aquí. Por lo tanto: nos la suda.",
      "Poner el WHERE en una sentencia DELETE FROM es una de las enseñanzas más importantes de la vida, pero no tanto como 'O viño non é auga'.",
      "Teneis que seguir la regla RTFM: Read The Fucking Manual.",
      "Lula, roncas como un minero con silicosis",
      "Berto ha salido a pasear a Lula y no nos ha dejado más frases épicas :'(",
    ];

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
