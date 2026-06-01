function setupSocket(io){

    io.on("connection",(socket)=>{

        console.log(
            "New User Connected",
            socket.id
        );

        socket.on(
            "registerUser",
            (userId)=>{

                socket.join(userId);

                console.log(
                    `User ${userId} joined room`
                );

            }
        );

        socket.on(
            "disconnect",
            ()=>{

                console.log(
                    "Disconnected",
                    socket.id
                );

            }
        );

    });

}

module.exports = {
    setupSocket
};