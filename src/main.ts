import './style.css'

interface sendMessage {
    user_name: string
    message: string
    first_message: boolean
}

const msgList = document.getElementById('messages');
const nameInput: HTMLInputElement = document.getElementById('name-chooser') as HTMLInputElement;
const input: HTMLInputElement = document.getElementById('message-input') as HTMLInputElement;
const sendBtn = document.getElementById('send-message');
const connectBtn = document.getElementById('connect');
const chatContainer = document.getElementById('chat-container');

const defaultName = "default-client"

let connected = false;
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

    const message: sendMessage = {
        user_name: nameInput.value === "" ? defaultName : nameInput.value,
        message: input.value,
        first_message: false
    }
    socket?.send(JSON.stringify(message))

    msgList.innerHTML += `
        <li class="message client">
            <span class="bubble" style="background-color: #595959;">
                <span>${input.value}</span>
            </span>
        </li>
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
            message: "READY",
            first_message: true
        }
        socket?.send(JSON.stringify(message));
    };

    socket.onmessage = (event) => {
        if (msgList === null) return;

        const response: sendMessage = JSON.parse(event.data)
        console.log("Message from server:", response.message);

        if (response.user_name === "Server") {
            msgList.innerHTML += `
                <li class="server">
                    ${response.message}
                </li>
            `;

            return
        }

        msgList.innerHTML += `
            <li class="message other-client">
                <span class="bubble" style="background-color: #3d3d3d;">
                    <span id="prefix-message">
                        <strong>${response.user_name}</strong>
                    </span>

                    <span>${response.message}</span>
                </span>
            </li>
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
