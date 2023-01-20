let username;

//login functions
function stillLogged (responseStatus) {
    console.log(`${username} entrou`);
}

function loggedOut (errorStatus) {
    window.location.reload(true);
}

function statusUser () {
    const status = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', {name:username});

    status.then(stillLogged);
    status.catch(loggedOut);
}
function loggedIn (response){
    document.querySelector('.login-container').classList.add('hidden');

    setInterval(statusUser, 5000);
    setInterval (getMessage, 3000);
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

//messages functions
function showMessages (messages){

    for (let i= 0; i < messages.data.length; i++){
        let from = messages.data[i].from;
		let to = messages.data[i].to;
		let text = messages.data[i].text;
		let type = messages.data[i].type;
		let time = messages.data[i].time;

        let messagesSent = document.querySelector('main');

        if (type === 'status') {
            messagesSent.innerHTML += 
            `<div class="message status"><p><span class="time">(${time})</span> 
            <span>${from}</span> ${text}</p></div>`;
        }
        if (type === 'message') {
            messagesSent.innerHTML += 
            `<div class="message public"><p><span class="time">(${time})</span> <span>${from} 
            </span>para<span> ${to}:</span> ${text}</p></div>`;
        } else if (type === 'private_message' && (to === username || from === username)) {
            messagesSent.innerHTML += `
            <div class="message private"> <p><span class="time">(${time})</span> 
         <span>${from} </span>reservadamente para<span> ${to}:</span> ${text}</p></div>`;
        }
    }

    const showLastMessage = document.querySelector('.message:last-child');
    showLastMessage.scrollIntoView();
}


function errorInShowingMessages(errorMsg){
    console.log(errorMsg)
}

function getMessage () {
    const getMessages = axios.get ('https://mock-api.driven.com.br/api/v6/uol/messages');

    getMessages.then(showMessages);
    getMessages.catch(errorInShowingMessages);
}