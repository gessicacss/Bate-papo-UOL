let username;
let receiver = 'todos';
let type = 'message';

//login functions
function stillLogged(responseStatus) {
    console.log(`${username} entrou`);
}

function loggedOut(errorStatus) {
    window.location.reload(true);
}

function statusUser() {
    const status = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', {name:username});

    status.then(stillLogged);
    status.catch(loggedOut);
}

function loggedIn(response){
    document.querySelector('.login-container').classList.add('hidden');

    getMessage();

    setInterval(statusUser, 5000);
    setInterval(getMessage, 3000);
}

function loginFailed(error){
    const statusCode = error.response.status;

    if (statusCode === 400) {
        document.querySelector('.login-div').classList.remove('hidden');
        document.querySelector('.error').classList.remove('hidden');
        document.querySelector('.login-username').classList.add('border');
        document.querySelector('.loading').classList.add('hidden');
    }
}

function login() {
    username = document.querySelector('.login-div .login-username').value;

    if(username == ''){
        let errorMessage = document.querySelector('.error');
        errorMessage.classList.remove('hidden');
        errorMessage.textContent = `Coloque um nome de usuário`;
        document.querySelector('.login-username').classList.add('border');
        return;
      }

    document.querySelector('.login-div').classList.add('hidden');
    document.querySelector('.loading').classList.remove('hidden');

    const loginUser = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', {name: username});
    loginUser.then (loggedIn);
    loginUser.catch(loginFailed);
}

//messages functions
function showMessages(messages){

    let messagesSent = document.querySelector('main');

    messagesSent.innerHTML = '';

    for (let i= 0; i < messages.data.length; i++){
        let from = messages.data[i].from;
		let to = messages.data[i].to;
		let text = messages.data[i].text;
		let type = messages.data[i].type;
		let time = messages.data[i].time;

        if (type === 'status') {
            messagesSent.innerHTML += `
            <div data-test="message" class="message status"><p><span class="time">(${time})</span> 
            <span>${from}</span> ${text}</p></div>
            `;
        } else if (type === 'message') {
            messagesSent.innerHTML += `
            <div data-test="message" class="message public"><p><span class="time">(${time})</span> <span>${from} 
            </span>para<span> ${to}:</span> ${text}</p></div>
            `;
        } else if (
            type === 'private_message' && 
            (to === username || from === username)
            ) {
            messagesSent.innerHTML += `
            <div data-test="message" class="message private"> <p><span class="time">(${time})</span> 
            <span>${from} </span>reservadamente para<span> ${to}:</span> ${text}</p></div>
            `;
        }
    }
    document.querySelector('.message:last-child').scrollIntoView();
}


function errorInShowingMessages(errorMsg){
    console.log(errorMsg);
}

function getMessage() {
    const getMessages = axios.get ('https://mock-api.driven.com.br/api/v6/uol/messages');

    getMessages.then(showMessages);
    getMessages.catch(errorInShowingMessages);
}

//sending messages
function errorMessage(error){
    console.log(error.response.status);
    windows.location.reload(true);
}

function SendMessage() {
    let userMessage = document.querySelector('.send-message .reply').value;

    const msgBody = {
        from: username,
        to: receiver,
        text: userMessage,
        type: type,
        };

    const sendingMsg = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', msgBody);

    document.querySelector(".send-message .reply").value = "";
    sendingMsg.then (res => console.log(res.response.status));
    sendingMsg.catch (errorMessage);
}