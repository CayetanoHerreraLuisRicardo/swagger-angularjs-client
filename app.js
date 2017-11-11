//móndulo para manipulación de archivos
var fs = require('fs');
//módulo para generar el cliente js
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
