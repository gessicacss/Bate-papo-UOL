let username;

//login functions
function loggedIn (response){
    document.querySelector('.login-container').classList.add('hidden');
}

function loginFailed (error){
    const statusCode = error.response.status;

    if (statusCode === 400) {
        document.querySelector('.login-div').classList.remove('hidden');
        document.querySelector('.error').classList.remove('hidden');
        document.querySelector('.login-username').classList.add('border')

        document.querySelector('.loading').classList.add('hidden');
    }
}

function login() {
    username = document.querySelector('.login-div .login-username').value;

    if(username == ""){
        let errorMessage = document.querySelector('.error')
        errorMessage.classList.remove('hidden');
        errorMessage.textContent = `Coloque um nome de usuário`
        document.querySelector('.login-username').classList.add('border');
        return;
      }

    let loginScreen = document.querySelector('.login-div');
    loginScreen.classList.add('hidden');

    let loadingScreen = document.querySelector('.loading');
    loadingScreen.classList.remove('hidden');

    const loginUser = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', {name: username})
    loginUser.then (loggedIn);
    loginUser.catch(loginFailed);
}