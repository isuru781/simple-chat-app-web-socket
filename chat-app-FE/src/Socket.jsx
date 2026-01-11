import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';


const Socket = () => {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const stompClient = useRef(null);

  useEffect(() => {
    // 1. Initialize connection
    const socket = new SockJS('http://localhost:8080/websocket');
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('Connected!');
        setIsConnected(true);
        // 2. Subscribe to a topic
        stompClient.current.subscribe('/topic/messages', (msg) => {
          setMessages(prev => [...prev, msg.body]);
        });
      },
      onDisconnect: () => {
        console.log('Disconnected!');
        setIsConnected(false);
      },
    });

    stompClient.current.activate();

    return () => stompClient.current.deactivate(); // Cleanup
  }, []);

  const sendMessage = () => {
    if (isConnected && stompClient.current && inputMessage.trim()) {
      stompClient.current.publish({
        destination: '/app/chat',
        body: inputMessage
      });
      setInputMessage('');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage} disabled={!isConnected}>
        {isConnected ? 'Send Message' : 'Connecting...'}
      </button>
      <ul>{messages.map((m, i) => <li key={i}>{m}</li>)}</ul>
    </div>

  );
};

export default Socket;