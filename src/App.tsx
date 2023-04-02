import React, {useEffect, useState} from 'react';
import './App.css';
import io, {Socket} from "socket.io-client";

const socketIoApi = {
    socket: null as null | Socket,

    createConnection() {
        const options = {
            extraHeaders: {
                participantId: '1',
                roomKey: 'test_room'
            }
        }

        this.socket = io('http://localhost:5001/participant', options);

        this.socket.on("connect", () => {
            console.log("ws:connect")
        })

        this.socket.on("disconnect", (e) => {
            console.log("ws:disconnect")
        })
    },
}


function App() {
    const [status, setStatus] = useState('');
    const [quizIsActive, setQuizIsActive] = useState(false);

    const connectSocket = () => {
        socketIoApi.createConnection()
        socketIoApi.socket?.on('auth', (data: { status: string }
        ) => {
            setStatus(data.status)
        })
        socketIoApi.socket?.on('quiz-public', (data: any
        ) => {
            console.log('data: ', data)
            setQuizIsActive(data.payload.status)
        })

        socketIoApi.socket?.onAny( (data: any
        ) => {
            console.log(data)
        })
    }

    useEffect(() => {
        connectSocket()
    }, [])

    return (
        <div className="App">
            <header className="App-header">
                <h1>Client-Participant</h1>
                <h3>Participant status: {status ? 'approved' : 'notApproved'}</h3>
                <h3>Quiz launched: {quizIsActive ? 'TRUE' : 'FALSE'}</h3>
            </header>
        </div>
    );

}

export default App;
