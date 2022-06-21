// Node server which will handle socket io connections
// const io=require('socket.io')(8000) // it will give CORS issue

const io=require('socket.io')(8000,{
    cors:{
        origin: '*',
    }
});

const users={};

io.on('connection', socket =>{
    // if any new user joins, let other users connected to the server know!
    socket.on('new-user-joined', userName=>{
        // console.log('New user', userName);
        users[socket.id]=userName;
        socket.broadcast.emit('user-joined', userName);
    });

    // if someone sends a message, broadcast it to other people
    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message: message, userName: users[socket.id]})
    });

    // if someone leaves the chat, let others know
    socket.on('disconnect', message =>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
})