
const miFormulario = document.querySelector('form');

const url = ( window.location.hostname.includes('localhost') )
? 'http://localhost:4000/api/auth/'
: 'https://node-restserver-cascaron.herokuapp.com/api/auth/'


miFormulario.addEventListener('submit',ev=>{

    ev.preventDefault();
    const formData = {};

    for (let el of miFormulario) {
       if(el.name.length >0){

        formData[el.name] = el.value

       }
    }

    fetch(url + 'login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {'Content-Type': 'application/json'}
    }).then(resp => resp.json())
    .then(({ msg, token }) => {
        if ( !token ){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: msg
            })
            return;

        }else{
            
            Swal.fire({ 
                icon: 'success',
                title: 'OK!',
                text: "SE logeo correctamente",
            })

            localStorage.setItem('token',token);
            window.location = 'chat.html'
        }

    })
    .catch( err => {
        console.log(err);
    })



})




function onSignIn(googleUser) {
   

    var id_token = googleUser.getAuthResponse().id_token;
    const data = { id_token }

    fetch ( url + 'google', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify( data )
    })
    .then( res => res.json() )
    .then( ( {token} ) =>{ 
        localStorage.setItem('token',token);
        
        console.log("33333333333333333333");
        console.log(token)
        window.location = 'chat.html'

    })
    .catch( console.log  );
}




function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
    console.log('User signed out.');
    });
}
