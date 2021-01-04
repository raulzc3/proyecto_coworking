const getDB=require("../../db");
const {createError}=require("../../helpers");
const editSpace=async (req,res,next)=>{
    let connection;

    try {
        connection=await getDB();
        const {id}=req.params;
     
        //Comprobamos que los datos mínimos están en el body (NOT NULL) y que son correctos
const {type,description,name,price,capacity}=req.body;

if(!type||!description||!name||!price||!capacity){
throw await createError("Faltan campos",400);
}

 typeArray=['Sala de reuniones','Oficina individual','Auditorio','Sala audiovisual','Oficina compartida'];

if(!typeArray.includes(type)||description.length>60000||name.length>50||price<=0||capacity<=0){
    throw await createError("Datos incorrectos",400);
}
//hago un query de SQL Update para editar los datos
await connection.query(`
    UPDATE spaces SET type=?,description=?,name=?,price=?,capacity=?
    WHERE ID=?
    ;`,
    [type,description,name,price,capacity,id])

res.send({
    status:"ok",
    data:{
        id,type,description,name,price,capacity
    },
})
    } catch (error) {
        next(error)
    }finally {
        if (connection) connection.release();
      }
};
module.exports=editSpace;