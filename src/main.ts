import './style.css'

const msgList = document.getElementById('messages');
const input: HTMLInputElement = document.getElementById('message-input') as HTMLInputElement;
const sendBtn = document.getElementById('send-message');
const connectBtn = document.getElementById('connect');
const chatContainer = document.getElementById('chat-container');

let connected = false;

connectBtn?.addEventListener('click', () => {
    if(chatContainer === null) return;

    chatContainer.hidden = !chatContainer.hidden;

    if(connected) {
        connectBtn.textContent = "Conectar";
    }else {
        connectBtn.textContent = "Desconectar";
    }

    connected = !connected;
})

sendBtn?.addEventListener('click', () => {
    if(input === null) return;
    if(input.value === "") return;
    if(msgList === null) return;
    
    msgList.innerHTML += `
        <li><span id="prefix-message"><strong>Client: </strong></span>${input.value}</li>
    `;

    console.log(input.value);
    input.value = "";
})