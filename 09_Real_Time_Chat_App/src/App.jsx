import React, { useState, useEffect, useRef } from 'react';
import ZIM from 'zego-zim-web';
import './App.css';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';

function App() {
  const [zimInstance, setZimInstance] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [selectedUser, setSelectedUser] = useState('suraj');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const appID = parseInt(import.meta.env.VITE_APP_ID);
  const tokenA = import.meta.env.VITE_TOKEN_A;
  const tokenB = import.meta.env.VITE_TOKEN_B;

  const messageEndRef = useRef(null);
  const selectedUserRef = useRef(selectedUser);

  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  useEffect(() => {
    if (!appID || !tokenA || !tokenB) {
      console.error("VITE_APP_ID, VITE_TOKEN_A, or VITE_TOKEN_B is not defined in .env file");
      alert("Configuration error: App ID or Tokens are missing.");
      return;
    }
    const instance = ZIM.create(appID);
    if (!instance) {
      console.error("Failed to create ZIM instance. AppID:", appID);
      alert("Failed to initialize ZIM SDK.");
      return;
    }
    setZimInstance(instance);

    instance.on('error', (zim, errorInfo) => console.log('error', errorInfo.code, errorInfo.message));
    instance.on('connectionStateChanged', (zim, { state, event }) => console.log('connectionStateChanged', state, event));
    instance.on('receivePeerMessage', (zim, { messageList: newMessages }) => {
      console.log('receivePeerMessage', newMessages);
      setMessageList(prev => [...prev, ...newMessages.filter(msg => msg.type === 1).map(msg => ({ ...msg, state: 'success' }))]);
    });
    instance.on('tokenWillExpire', (zim, { second }) => {
      console.log('tokenWillExpire', second);
      zim.renewToken(selectedUserRef.current === 'suraj' ? tokenA : tokenB)
        .then(() => console.log('Token renewed successfully'))
        .catch((err) => console.log('Token renewal failed', err));
    });

    return () => {
      if (instance) instance.destroy();
    };
  }, [appID, tokenA, tokenB]);

  useEffect(() => {
    // Only scroll if logged in and messages are present
    // No need to check isLoggedIn here as MessageList won't be rendered if not logged in (implicitly)
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messageList]);

  const handleLogin = () => {
    if (!zimInstance) { alert('ZIM instance not initialized.'); return; }
    const info = { userID: selectedUser, userName: selectedUser === 'suraj' ? 'Suraj' : 'Aman' };
    setUserInfo(info);
    const loginToken = selectedUser === 'suraj' ? tokenA : tokenB;
    zimInstance.login(info, loginToken)
      .then(() => setIsLoggedIn(true))
      .catch((err) => alert(`Login failed: ${err.message} (code: ${err.code})`));
  };

  const handleSendMessage = () => {
    if (!zimInstance || !isLoggedIn) { alert('Please login first.'); return; }
    if (!messageText.trim()) {
      alert('Message cannot be empty.');
      return;
    }

    const toConversationID = selectedUser === 'suraj' ? 'aman' : 'suraj';
    const messageObject = { type: 1, message: messageText };
    
    const tempTextMessage = {
        ...messageObject,
        senderUserID: userInfo.userID,
        timestamp: Date.now(),
        state: 'sending', 
        localMessageID: `local_${Date.now()}_${Math.random()}`
    };
    setMessageList(prev => [...prev, tempTextMessage]);

    zimInstance.sendMessage(messageObject, toConversationID, 0, { priority: 1 })
      .then(({ message: sentMessage }) => {
        setMessageList(prev => prev.map(msg => 
            msg.localMessageID === tempTextMessage.localMessageID 
            ? { ...sentMessage, state: 'success' } 
            : msg
        ));
        setMessageText('');
      })
      .catch((err) => {
        alert(`Text Message sending failed: ${err.message}`);
        setMessageList(prev => prev.map(msg => 
            msg.localMessageID === tempTextMessage.localMessageID 
            ? { ...msg, state: 'failed', error: err.message } 
            : msg
        ));
      });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleUserChange = (event) => {
    if (isLoggedIn) { alert("Please logout to switch user."); return; }
    setSelectedUser(event.target.value);
  };

  const handleLogout = () => {
    if (zimInstance && isLoggedIn) {
      zimInstance.logout().then(() => {
        setIsLoggedIn(false); setUserInfo(null); setMessageList([]);
      }).catch(err => alert("Logout failed: " + err.message));
    }
  };

  return (
    <div className="app-container">
      <div className="chat-window">
        <ChatHeader
          userInfo={userInfo}
          selectedUser={selectedUser}
          handleUserChange={handleUserChange}
          handleLogin={handleLogin}
          handleLogout={handleLogout}
          isLoggedIn={isLoggedIn}
          zimInstance={zimInstance}
        />
        {/* MessageList and MessageInput are always rendered here;
            Their internal logic or props (like isLoggedIn for MessageInput)
            will determine their behavior/visibility of certain parts.
            Or, App.jsx can control their rendering based on isLoggedIn if preferred.
            For now, keeping them rendered and letting MessageInput handle its own visibility.
            MessageList will just be empty if not logged in and no messages.
        */}
        <MessageList {...{ messageList, userInfo, formatTime, messageEndRef }} />
        <MessageInput {...{ messageText, setMessageText, handleSendMessage, isLoggedIn }} />
      </div>
    </div>
  );
}

export default App;