# keylogger-api-rest
Keylogger creado para victimas de manera local que entren a la computadora del atacante<br/>

Tema creado para el curso de sistema operativos de la universidad nacional de ingeniería<br/>

Integrantes:<br/>
-Ataucuri Velasquez, Jhon Oscar   <b><i>20091274F</i></b><br/>
-Dextre Zubieta Gustavo Anthony   <b><i>20160218I</i></b><br/>
-Trujillo Delgado, Jose Luis      <b><i>20150293H</i></b><br/>
-Ventura Cuestas, Jose Luis       <b><i>20141233F</i></b><br/>

Para poder ejecutar el código, se debe tener instalado NodeJS, Python en su última version y mongoDB<br/>

En primero instancia se clona el código<br/>

Luego se ejecuta en la termnal del directorio actual el comando "npm install" para instalar las dependencias.<br/>

Crear un archivo llamado .env y colocar MONGO_URI=[SU CREDENCIAL DE MONGODB] en caso fuera en la nube o colocar MONGO_URI="mongodb://localhost:27017/dbvictima", siendo dbvictima
el nombre de la base de datos.<br/>

Luego ejecutar en NodeJS el comando "npm run dev" para que se ejecute en el puerto 3000.<br/><br/>

La ruta para la victima será http://localhost:3000/victima<br/>

La ruta para la atacante será http://localhost:3000/atacante<br/>

La diferencia es que, quien entra a la ruta victima, serán registradas sus teclas, mientras que la ruta del atacante solo será de espectador que es lo que escribe la victima.
