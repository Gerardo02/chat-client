import './style.css'

interface sendMessage {
    user_name: string
    message: string
}

const msgList = document.getElementById('messages');
const nameInput: HTMLInputElement = document.getElementById('name-chooser') as HTMLInputElement;
const input: HTMLInputElement = document.getElementById('message-input') as HTMLInputElement;
const sendBtn = document.getElementById('send-message');
const connectBtn = document.getElementById('connect');
const chatContainer = document.getElementById('chat-container');

let connected = false;

const defaultName = "default-client"

let socket: WebSocket | null = null



connectBtn?.addEventListener('click', () => {
    if (chatContainer === null) return;
    if (nameInput === null) return;

    chatContainer.hidden = !chatContainer.hidden;
    nameInput.hidden = !nameInput.hidden;

    if (connected) {
        connectBtn.textContent = "Conectar";
        socket?.close()
    } else {
        connectBtn.textContent = "Desconectar";
        connectWebsocket()
    }

    connected = !connected;
})

sendBtn?.addEventListener('click', () => {
    if (input === null) return;
    if (input.value === "") return;
    if (msgList === null) return;

    console.log(input.value);
    const message: sendMessage = {
        user_name: nameInput.value === "" ? defaultName : nameInput.value,
        message: input.value
    }
    socket?.send(JSON.stringify(message))

    msgList.innerHTML += `
        <li><span id="prefix-message"><strong>${nameInput.value === "" ? defaultName : nameInput.value}: </strong></span>${input.value}</li>
    `;

    input.value = "";
})


function connectWebsocket() {
    socket = new WebSocket("ws://localhost:8080/ws/chat");

    socket.onopen = () => {
        console.log("Connected to the server");
        connected = true
        const message: sendMessage = {
            user_name: nameInput.value === "" ? defaultName : nameInput.value,
            message: "READY"
        }
        socket?.send(JSON.stringify(message));
    };

    socket.onmessage = (event) => {
        if (msgList === null) return;

        console.log("Message from server:", event.data);
        msgList.innerHTML += `
            <li><span id="prefix-message"><strong>Server: </strong></span>${event.data}</li>
        `;
    };

    socket.onclose = () => {
        console.log("Disconnected from WebSocket server");
        connected = false;
        connectBtn!.textContent = "Connect";
    };

    socket.onerror = (error) => {
        console.error("WebSocket error:", error);
    };
}
