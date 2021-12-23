const express = require('express')
var cors = require('cors');
const { dbConnection } = require('../database/connection.js');
const fileUpload = require('express-fileupload');
const { socketController } = require('../sockets/controller.socket.js');

class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.server = require('http').createServer( this.app );
        this.io = require('socket.io')(this.server)


        this.paths = {

            auth:"/api/auth",
            usuario:"/api/usuarios" ,
            categorias : "/api/categorias", 
            productos : "/api/productos", 
            buscar : "/api/buscar", 
            uploads : "/api/uploads", 

        }
        // this.usuariosPath ="/api/usuarios" 
        // this.authPath ="/api/auth" 
        // this.authCategoria ="/api/categorias" 

        //Conectyar a la base de datos:
        this.conectarBD();
        
        // Middlewares
        this.middlewares();


        // Rutas de mi aplicacion
        this.route();

        //Socket
        this.socket();
    }

    async conectarBD(){
        await dbConnection();
    }

    



    middlewares(){

        //cors
        this.app.use( cors() )

        //Lectura y parseo del body
        this.app.use(  express.json() );

        // Directorio publico
        this.app.use( express.static('public') );

        //Carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));

    }

    route(){

        this.app.use( this.paths.auth, require('../routes/auth.js') );
        this.app.use( this.paths.categorias, require('../routes/categorias.js') );
        this.app.use( this.paths.productos, require('../routes/productos.js') );
        this.app.use( this.paths.buscar, require('../routes/buscar.js') );
        this.app.use( this.paths.usuario, require('../routes/usuarios.js') );
        this.app.use( this.paths.uploads, require('../routes/uploads.js') );

    }

    socket(  ){

        this.io.on('connection', (socket)=> socketController( socket, this.io ))

    }

    listen(){
        this.server.listen( this.port , ()=>{
            console.log("Corriendo en el puerto", this.port )
        })
    }


}



module.exports = Server;