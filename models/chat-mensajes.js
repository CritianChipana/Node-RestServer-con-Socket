
class Mensaje{


    constructor(uid, nombre, mensaje ){
        this.uid = uid;
        this.nombre = nombre;
        this.mensaje = mensaje
    }

}

class MensajePrivado{


    constructor(uid, nombre, mensaje ){
        this.uid = uid;
        this.nombre = nombre;
        this.mensaje = mensaje
    }

}


class ChatMensajes{

    constructor(){

        this.mensajes = [];
        this.mensajesPrivado = [];
        this.usuarios = {};

    }

    get ultimos10(){

        this.mensajes = this.mensajes.splice( 0,10);
        return this.mensajes;

    }

    get usuariosArr(){

        return Object.values( this.usuarios );


    }

    enviarMensaje( uid, nombre, mensaje ){
        this.mensajes.unshift(
            new Mensaje( uid , nombre, mensaje )
        )
    }

    conectarUsuario( usuario ){
        this.usuarios[ usuario.id] = usuario
    }

    desconectarUsuario (id){
        delete this.usuarios[id];
    }

    //? Mi metodos

    enviarMensajePrivado( uid, nombre, mensaje ){
        this.mensajesPrivado.unshift(
            new Mensaje( uid , nombre, mensaje )
        )
    }

    get mensajesPrivados(){

        // this.mensajesPrivado = this.mensajesPrivado.splice( 0,10);
        return this.mensajesPrivado;
    }

}

module.exports = ChatMensajes;