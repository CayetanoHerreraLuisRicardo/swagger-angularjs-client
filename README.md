### swagger-angularjs-client
##Example swagger client for angular (using nodejs)

ANTES DE EMPEZAR TIENES QUE TENER INSTALADO nodejs Y npm

1.- ENTRAR A => http://editor.swagger.io/#!/

2.- CREA LA DOCUMENTACION DE TU API EN EL EDITOR DE SWAGGER, LOS FORMATOS QUE MANEJA SWAGGER SON => YAML Y JSON

3.- CREA LA CARPETA DEL PROYECTO E INSTALA swagger-js-codegen => npm install swagger-js-codegen

![result firebug](https://github.com/CayetanoHerreraLuisRicardo/swagger-angularjs-client/blob/master/screenshot/2.png)

4.- CREA TU ARCHIVO .js EN MI CASO LLAMADO CON LAS SIGUIENTES LINEAS DE CODIGO =>

////////INICIO//////////
//móndulo para manipulacion de archivos
var fs = require('fs');
//móndulo para generar el cliente js
var CodeGen = require('swagger-js-codegen').CodeGen;
//https://github.com/wcandillon/swagger-js-codegen

//archivo .json generado desde el editor de swagger
var fileJSON = 'swagger/swaggerUber.json';
//http://editor.swagger.io/

var swagger = JSON.parse(fs.readFileSync(fileJSON, 'UTF-8'));
//elegimos generar el cliente para angular
var angularjsSourceCode = CodeGen.getAngularCode({ className: 'clientSwagger', swagger: swagger });

//nombre del archivo donde se guarda el cliente angularjs generado
var dirAjs = './clientAngularSwagger.js';

//función que crea o sobre-escribe en el archivo
function generaAngularJS(file,client){
	fs.exists(file, function(res) {
		if(res)
			fs.writeFile(file, client, function(err) {
				if( err ){
					console.log(err);
				}
				else{
					console.log('Se sobre-escribió y generó el archivo '+file);
				}
			});
		else{
			var wstream = fs.createWriteStream(file);
			wstream.write(client)
			wstream.end(function () {
				console.log('archivo creado y generado '+file); 
			});
		}
	});	
}
generaAngularJS(dirAjs,angularjsSourceCode);
////////FIN//////////

PARA MI EJEMPLO LLAMADO app.js

5.- UNA VEZ CREADA LA DOCUMENTACIÓN DE TU API DESDE EL EDITOR DEL SWAGGER, LO DESCARGAMOS EN FORMATO JSON.

![download in json format](https://github.com/CayetanoHerreraLuisRicardo/swagger-angularjs-client/blob/master/screenshot/1.png)

6.- EJECUTAMOS EL SIGUIENTE COMANDO => node app

![command](https://github.com/CayetanoHerreraLuisRicardo/swagger-angularjs-client/blob/master/screenshot/3.png)

7.- LISTO SE GENERÓ NUESTRO CLIENTE PARA ANGULARJS

![client generated](https://github.com/CayetanoHerreraLuisRicardo/swagger-angularjs-client/blob/master/screenshot/5.png)

![client generated](https://github.com/CayetanoHerreraLuisRicardo/swagger-angularjs-client/blob/master/screenshot/4.png)
