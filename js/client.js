const socket=io('http://localhost:8000');

// Get DOM elements in respective JS variables
const form=document.getElementById('send-container');
const messageInput=document.getElementById('messageInp');
const messageContainer=document.querySelector('.container');

// Audio that will play on receiving messages
var audio = new Audio('ting.mp3');

// Function which will append event to the container
const append=(message, position)=>{
    const messageElement=document.createElement('div');
    messageElement.innerText=message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position=='left'){
        audio.play();
    }
}

// Ask new user for his/her name and let the server know
const userName=prompt('Enter your name to join');
socket.emit('new-user-joined', userName);

// if a new user joins, receive his/her name from the server
socket.on('user-joined', userName =>{
    append(`${userName} joined the chat`, 'right')
})

// if server sends a message, receive it
socket.on('receive', data =>{
    append(`${data.userName}: ${data.message}`, 'left')
})

// if a user leaves the caht, append the info to the container
socket.on('left', userName =>{
    append(`${userName} left the chat`, 'right')
})

// if the form get submitted, send server the message
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value='';
})

