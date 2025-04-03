const mongoose =require('mongoose');

const connectdatabase =() =>{
    mongoose.connect(process.env.DB_URL).then((con)=>{
        console.log('MongoDB connected to the host:'+con.connection.host)
    })

}
module.exports = connectdatabase;