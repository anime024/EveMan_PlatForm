const socket = io();

socket.on("connect", () => {

    console.log(
        "Socket Connected:",
        socket.id
    );

    if(window.currentUserId){

        socket.emit(
            "registerUser",
            window.currentUserId
        );

        console.log(
            "Joined room:",
            window.currentUserId
        );
    }
});


socket.on("notification",(data)=>{

    console.log(
        "🔔 Notification:",
        data.message
    );

    const notificationList =
    document.getElementById(
        "notificationList"
    );

    const notificationCount =
    document.getElementById(
        "notificationCount"
    );

    if(notificationList){

        const li =
        document.createElement("li");

        li.textContent =
        data.message;

        notificationList.prepend(li);
    }

    if(notificationCount){

        let count =
        Number(notificationCount.innerText);

        notificationCount.innerText =
        count + 1;
    }
});