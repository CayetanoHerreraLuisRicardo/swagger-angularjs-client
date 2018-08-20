## swagger-angularjs-client
###Example swagger client for angular (using nodejs)

ANTES DE EMPEZAR TIENES QUE TENER INSTALADO nodejs Y npm

#### 1.- ENTRAR A 'http://editor.swagger.io/#!/'

#### 2.- CREA LA DOCUMENTACION DE TU API EN EL EDITOR DE SWAGGER (para documentar tu API apoyate de la especificación 'OpenAPI Specification'  https://swagger.io/specification y de este ejemplo https://github.com/OAI/OpenAPI-Specification/blob/master/examples/v2.0/yaml/uber.yaml), LOS FORMATOS QUE MANEJA SWAGGER SON 'YAML' Y 'JSON'

#### 3.- EN LA CARPETA DEL PROYECTO (AÚN VACIA) EJECUTA 'npm init -y' E INSTALA swagger-js-codegen 'npm install swagger-js-codegen --save'

![result firebug](https://github.com/CayetanoHerreraLuisRicardo/swagger-angularjs-client/blob/master/screenshot/2.png)

#### 4.- CREA TU ARCHIVO .js EN MI CASO LLAMADO "app.js" CON LAS SIGUIENTES LINEAS DE CODIGO =>
```javascript
////////INICIO//////////
//módulo para manipulación de archivos
var fs = require('fs');
//módulo para generar el cliente js
var CodeGen = require('swagger-js-codegen').CodeGen;
//https://github.com/wcandillon/swagger-js-codegen

//archivo .json generado desde el editor de swagger
var fileJSON = 'swagger/swaggerUber.json';
//http://editor.swagger.io/

var swagger = JSON.parse(fs.readFileSync(fileJSON, 'UTF-8'));
//elegimos generar el cliente para angularjs
var angularjsSourceCode = CodeGen.getAngularCode({ className: 'clientSwagger', swagger: swagger });

//nombre del archivo donde se guardará el cliente angularjs generado
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
```
PARA MI EJEMPLO LLAMADO app.js

#### 5.- UNA VEZ CREADA LA DOCUMENTACIÓN DE TU API DESDE EL EDITOR DEL SWAGGER, LO DESCARGAMOS EN FORMATO JSON, CREAMOS UNA CARPETA EN MI CASO 'swagger' Y PEGAMOS EL ARCHIVOS JSON Y LE PONES EL NOMBRE QUE GUSTES EN MI CASO 'swaggerUber.json' 

#### NOTA: SI QUIERES OMITIR ESTE PUNTO AQUI ESTA EL EJEMPLO DE UBER 'https://github.com/OAI/OpenAPI-Specification/blob/master/examples/v2.0/json/uber.json' ESTO PARA HACER TU PRUEBA Y GENERAR TU CLIENTE ANGULARJS

![download in json format](https://github.com/CayetanoHerreraLuisRicardo/swagger-angularjs-client/blob/master/screenshot/1.png)

#### 6.- EJECUTAMOS EL SIGUIENTE COMANDO 'node app' EN LA RAIZ DEL PROYECTO

![command](https://github.com/CayetanoHerreraLuisRicardo/swagger-angularjs-client/blob/master/screenshot/3.png)

#### 7.- LISTO SE GENERÓ NUESTRO CLIENTE PARA ANGULARJS

![code-angular](https://github.com/CayetanoHerreraLuisRicardo/swagger-angularjs-client/blob/master/screenshot/4.PNG)

![file-js-angular](https://github.com/CayetanoHerreraLuisRicardo/swagger-angularjs-client/blob/master/screenshot/5.PNG)
