import ReconnectingWebSocket from 'reconnecting-websocket';

let socket = null;

export const connectWebSocket = (token) => {
  if (socket) {
    socket.close();
  }

//   const wsScheme = window.location.protocol === 'https:' ? 'wss' : 'ws';
//   const wsUrl = `${wsScheme}://${window.location.host}/ws/tasks/?token=${token}`;

  const wsUrl = `ws://localhost:8000/ws/tasks/?token=${token}`;


  console.log('Attempting to connect WebSocket at:', wsUrl);

  socket = new ReconnectingWebSocket(wsUrl);

  socket.onopen = () => {
    console.log('WebSocket connected successfully');
  };

  socket.onmessage = (event) => {
    console.log('WebSocket message received:', event.data);
    try {
      const data = JSON.parse(event.data);
      console.log('Parsed WebSocket data:', data);
      // Handle the message here or pass it to a handler function
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  };

  socket.onclose = (event) => {
    console.log('WebSocket disconnected. Code:', event.code, 'Reason:', event.reason);
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  return socket;
};

export const disconnectWebSocket = () => {
  if (socket) {
    console.log('Closing WebSocket connection');
    socket.close();
  }
};