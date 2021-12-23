
const { Socket } = require('socket.io');
const { comprobarJWT } = require('../helpers/generarJWT.JS');
const ChatMensajes = require('../models/chat-mensajes');

const chatMensaje = new ChatMensajes();

const socketController =async ( socket = new Socket(), io )=>{

    const usuario = await comprobarJWT (socket.handshake.headers['x-token']);

    if( !usuario ){
        return socket.disconnect();
    }
    
    //* Agregar el usuario conectado
    chatMensaje.conectarUsuario(usuario );
    io.emit('usuarios-activos', chatMensaje.usuariosArr );
    socket.emit('recibir-mensaje', chatMensaje.ultimos10 )
 
    //? Conectarlo a una sala especial
    socket.join( usuario.id ); // global, socke.id, usuario.id

    //* Limpiar cuando alguien se desconecta

    socket.on('disconnect', () => {
        chatMensaje.desconectarUsuario(usuario.id)

        io.emit('usuarios-activos', chatMensaje.usuariosArr)
        
    })

    socket.on( 'enviar-mensaje', ( {uid, mensaje} ) =>{
        console.log(uid)
        if( uid ){

            //? Mnesaje privado
            chatMensaje.enviarMensajePrivado( usuario.id, usuario.nombre , mensaje)
            socket.to( uid ).emit("mensaje-privado", chatMensaje.mensajesPrivados )
            socket.emit("mensaje-privado", chatMensaje.mensajesPrivados )

        }else{

            chatMensaje.enviarMensaje( usuario.id, usuario.nombre , mensaje)
            io.emit( 'recibir-mensaje', chatMensaje.ultimos10 )
        }


    } )

 }

module.exports = {
    socketController
}