(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))f(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const u of t.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&f(u)}).observe(document,{childList:!0,subtree:!0});function p(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function f(e){if(e.ep)return;e.ep=!0;const t=p(e);fetch(e.href,t)}})();const a=document.getElementById("messages"),o=document.getElementById("name-chooser"),c=document.getElementById("message-input"),d=document.getElementById("send-message"),l=document.getElementById("connect"),m=document.getElementById("chat-container"),g="default-client";let i=!1,n=null;l==null||l.addEventListener("click",()=>{m!==null&&o!==null&&(m.hidden=!m.hidden,o.hidden=!o.hidden,i?(l.textContent="Conectar",n==null||n.close()):(l.textContent="Desconectar",y()),i=!i)});d==null||d.addEventListener("click",()=>{if(c===null||c.value===""||a===null)return;const r={user_name:o.value===""?g:o.value,message:c.value,first_message:!1};n==null||n.send(JSON.stringify(r)),a.innerHTML+=`
        <li class="message client">
            <span class="bubble" style="background-color: #595959;">
                <span>${c.value}</span>
            </span>
        </li>
    `,c.value=""});function y(){n=new WebSocket("ws://localhost:8080/ws/chat"),n.onopen=()=>{console.log("Connected to the server"),i=!0;const r={user_name:o.value===""?g:o.value,message:"READY",first_message:!0};n==null||n.send(JSON.stringify(r))},n.onmessage=r=>{if(a===null)return;const s=JSON.parse(r.data);if(console.log("Message from server:",s.message),s.user_name==="Server"){a.innerHTML+=`
                <li class="server">
                    ${s.message}
                </li>
            `;return}a.innerHTML+=`
            <li class="message other-client">
                <span class="bubble" style="background-color: #3d3d3d;">
                    <span id="prefix-message">
                        <strong>${s.user_name}</strong>
                    </span>

                    <span>${s.message}</span>
                </span>
            </li>
        `},n.onclose=()=>{console.log("Disconnected from WebSocket server"),i=!1,l.textContent="Connect"},n.onerror=r=>{console.error("WebSocket error:",r)}}
