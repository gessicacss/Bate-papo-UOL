let username;
let receiver = 'Todos';
let typeMsg = 'message';
let visibility = 'Público';
const fiveSecs = 5000;
const threeSecs = 3000;
const tenSecs = 10000;
const errorStatus = 400;

//login functions
function stillLogged() {
    console.log(`${username} entrou`);
}

function loggedOut() {
    window.location.reload(true);
}

function statusUser() {
    const status = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', {name:username});

    status.then(stillLogged);
    status.catch(loggedOut);
}

function loggedIn(){
    document.querySelector('.login-container').classList.add('hidden');

    getMessage();
    getParticipants();
    showReceiver();

    setInterval(statusUser, fiveSecs);
    setInterval(getMessage, threeSecs);
    setInterval(getParticipants, tenSecs);
}

function loginFailed(error){
    const statusCode = error.response.status;

    if (statusCode === errorStatus) {
        document.querySelector('.login-div').classList.remove('hidden');
        document.querySelector('.error').classList.remove('hidden');
        document.querySelector('.login-username').classList.add('border');
        document.querySelector('.loading').classList.add('hidden');
    }
}

function login() {
    username = document.querySelector('.login-div .login-username').value;

    if(username === ''){
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
        let msgFrom = messages.data[i].from;
		let msgTo = messages.data[i].to;
		let txt = messages.data[i].text;
		let msgType = messages.data[i].type;
		let msgTime = messages.data[i].time;

        if (msgType === 'status') {
            messagesSent.innerHTML += `
            <div data-test="message" class="message status"><p><span class="time">(${msgTime})</span> 
            <span class="name">${msgFrom}</span> ${txt}</p></div>
            `;
        } else if (msgType === 'message') {
            messagesSent.innerHTML += `
            <div data-test="message" class="message public"><p><span class="time">(${msgTime})</span> <span class="name">${msgFrom} 
            </span>para<span class="name"> ${msgTo}:</span> ${txt}</p></div>
            `;
        } else if (
            msgType === 'private_message' && 
            (msgTo === username || msgFrom === username)
            ) {
            messagesSent.innerHTML += `
            <div data-test="message" class="message private"> <p><span class="time">(${msgTime})</span> 
            <span class="name">${msgFrom} </span>reservadamente para<span class="name"> ${msgTo}:</span> ${txt}</p></div>
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
    window.location.reload(true);
}

function sendMessage() {
    let userMessage = document.querySelector('.send-message .reply').value;

    const msgBody = {
        from: username,
        to: receiver,
        text: userMessage,
        type: typeMsg,
        };

    const sendingMsg = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', msgBody);

    document.querySelector(".reply").value = "";
    getMessage();
    sendingMsg.then (res => console.log(res));
    sendingMsg.catch (errorMessage);
}

//sidebar functions
function openSidebar () {
    document.querySelector('.sidebar-container').classList.remove('hidden');
}

function closeSidebar(){
    document.querySelector('.sidebar-container').classList.add('hidden');
}


//getting participants functions
function showParticipants(participant){
    let showOnline = document.querySelector('.online-list');

    showOnline.innerHTML = '';

    showOnline.innerHTML += `
        <li data-test="all" class="contact" onclick="selectContact(this)">
        <div class="contact-part">
        <ion-icon name="people-sharp"></ion-icon>
        <p class="contact-name">Todos</p>
        </div>
        <ion-icon data-test="check" class="checkmark selected" name="checkmark"></ion-icon>
        `;
    
    for (let j = 0; j < participant.data.length; j++){
        let user = participant.data[j].name;

        showOnline.innerHTML += `
            <li data-test="participant" class="contact" onclick="selectContact(this)">
            <div class="contact-part">
            <ion-icon name="people-sharp"></ion-icon>
            <p class="contact-name">${user}</p>
            </div>
            <ion-icon data-test="check" class="checkmark" name="checkmark"></ion-icon>
        `;
        }
    }
    
function getParticipants(){
    const participantsList = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');

    participantsList.then(showParticipants);
    participantsList.catch(error => console.log(error));
}

//selecting participants functions
function selectContact(receiverName){
    let previousReceiver = document.querySelector('.contact .checkmark.selected');
    if (previousReceiver !== null) {
        previousReceiver.classList.remove('selected');
    }

    let newCheckmark = receiverName.querySelector('.checkmark');
    newCheckmark.classList.add('selected');

    receiver = receiverName.querySelector('.contact-name').innerHTML;
    showReceiver();
    }
    
function selectVisibility(visibilityDiv) {
    const previousVisibility = document.querySelector('.visibility-option .checkmark.selected');
    if (previousVisibility !== null) {
        previousVisibility.classList.remove('selected');
    }

    let newVisibility = visibilityDiv.querySelector('.checkmark');
    newVisibility.classList.add('selected');

    visibility = visibilityDiv.querySelector('.visibility-type').textContent;
    if (visibility === "Reservadamente"){
        typeMsg = 'private_message';
    } else {
        typeMsg = 'message';
    }
    showReceiver();
}
    
function showReceiver() {
    const input = document.querySelector('.send-message-input');
    input.innerHTML = '';

    input.innerHTML += `
        <input data-test="input-message" type="text" class="reply" placeholder="Escreva aqui...">
        <div data-test="recipient" class="sending-message-to">
        Enviando para ${receiver} (${visibility})</div>
    `;
}

//enviar a mensagem ao apertar enter
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter'){
        sendMessage();
    };
});