
const url = ( window.location.hostname.includes('localhost') )
? 'http://localhost:4000/api/auth/'
: 'https://node-restserver-cascaron.herokuapp.com/api/auth/'

let usuario = null;
let socket = null;

//? REFERENCIAS HTML
const txtUid  = document.querySelector('#txtUid');
const txtMensaje  = document.querySelector('#txtMensaje');
const ulUsuario  = document.querySelector('#ulUsuario');
const ulMensajes  = document.querySelector('#ulMensajes');
const btnSalir  = document.querySelector('#btnSalir');
const ulPrivado = document.querySelector('#ulPrivado');

console.log("estas en chat")

const validarJWT = async () =>{

  const token = localStorage.getItem('token') || '';

  if( token.length <=10 ){
    window.location = 'index.html';
    throw new Error('No hay token en el servidor');
  }

  const resp = await fetch( url ,{
    headers : {'x-token' : token}
  });

  //? se puede hacer un try catch

  const { usuario: userDB, token : tokenDB } = await resp.json();

  localStorage.setItem('token', token);

  console.log(userDB);
  console.log("22222222222222222222222")
  console.log(tokenDB);

  usuario = userDB;

  document.title = usuario.nombre;

  await conectarSocket();

}


const conectarSocket = async ()=>{

  socket = io({
    'extraHeaders':{
      'x-token' : localStorage.getItem('token')
    }
  });

  socket.on('connect', ()=>{
    console.log('Sockets offline');
  });

  socket.on('disconnect', ()=>{
    console.log('Sockets offline');
  });

  socket.on('recibir-mensaje' , dibujarMensaje )

  socket.on('usuarios-activos' , dibujarUsuario )

  socket.on('mensaje-privado' ,dibujarMensajePrivado);

}

const dibujarMensaje = ( mensaje = [] ) =>{

  let mensajeHTML = "";
  mensaje.forEach( ({nombre,mensaje}) =>{

    mensajeHTML += `
      <li>
        <p>
          <span class="text-primary" > ${ nombre }</span>
          <span class="fs-6 text-muted" >${ mensaje }</span>
        </p>
      </li>
    `;

  } );

  ulMensajes.innerHTML = mensajeHTML;
}



const dibujarUsuario = ( usuario = [] ) =>{

  let usersHTML = "";
  usuario.forEach( ({nombre,uid}) =>{

    usersHTML += `
    
      <li>
        <p>
          <h5 class="text-success" > ${ nombre }</h5>
          <span class="fs-6 text-muted" >${ uid }</span>
        </p>
      </li>
    
    `;

  } );

  ulUsuario.innerHTML = usersHTML;

}


const dibujarMensajePrivado = ( mensajes = []  ) =>{

  let privadosHTML = "";
  mensajes.forEach( ({nombre,mensaje}) =>{

    privadosHTML += `
      <li>
        <p>
          <h5 class="text-success" > ${ nombre }</h5>
          <span class="fs-6 text-muted" >${ mensaje }</span>
        </p>
      </li>
    `;

  } );

  ulPrivado.innerHTML = privadosHTML;

}


txtMensaje.addEventListener( 'keyup',( {keyCode} )=>{

  const mensaje = txtMensaje.value;
  const uid = txtUid.value;

  if( keyCode !== 13 ){ return; }

  if( ulMensajes.length === 0 ){ return; }

  socket.emit( 'enviar-mensaje' , {mensaje, uid})

  txtMensaje.value = '';

} );

btnSalir.addEventListener( 'click', ()=>{
    console.log(usuario.id)
    // socket.emit('desconectar-usuario', usuario.id );


} );


const main = async ()=>{


  // Validar JWT
  await validarJWT();
}

main();