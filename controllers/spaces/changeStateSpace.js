const getDB=require("../../db");

const changeStateSpace=async(req,res,next)=>{
    let connection;

    try {
        connection=await getDB();

        const { id } = req.params;

        //Ejecutamos la edición en la base de datos
        await connection.query(
          `
          UPDATE spaces s1, spaces s2 
          SET s1.enabled = IF(s2.enabled = 0, 1,0)     
          WHERE s1.ID = s2.ID and s1.ID = ?;
    
        `,
          [id]
        );
    
        const [
          result,
        ] = await connection.query(`SELECT * FROM  spaces WHERE ID = ?;`, [
          id,
        ]);
    
        res.send({
          status: "ok",
          data: {
            ...result["0"],
          },
        });
      }  catch (error) {
        next(error)
    }

}

module.exports=changeStateSpace;