import io from 'socket.io-client';

const socket = io("http://localhost:3000", {
    withCredentials: true,
    extraHeaders: {
        "Content-Type": "application/json"
    }
});

export default socket;
