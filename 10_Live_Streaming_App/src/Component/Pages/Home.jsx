import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Home() {

    let [input, setInput] = useState("");
    const navigate = useNavigate(); // useNavigate is a hook that returns a function that lets you navigate programmatically

    const handleJoin = () => {
        navigate(`/room/${input}`);
    }
    
    return (
        <div className="home-container">
            <h1 className="home-title">Welcome to LiveStream Pro</h1>
            <div className="input-container">
                <input
                    type="text"
                    placeholder='Enter Your Room ID....'
                    onChange={(e) => setInput(e.target.value)}
                    value={input}
                    className="room-input"
                />
                <button onClick={handleJoin} className="join-button">Join Room</button>
            </div>
        </div>
    )
}

export default Home