import ReconnectingWebSocket from 'reconnecting-websocket';

let socket = null;

export const connectWebSocket = (token) => {
  if (socket) {
    socket.close();
  }

  const wsScheme = window.location.protocol === 'https:' ? 'wss' : 'ws';
  const wsUrl = `${wsScheme}://localhost:8000/ws/tasks/`;

  console.log('Attempting to connect WebSocket at:', wsUrl);

  socket = new ReconnectingWebSocket(wsUrl);

  socket.onopen = () => {
    console.log('WebSocket connected successfully');
    // Authenticate the WebSocket connection
    socket.send(JSON.stringify({ token }));
  };

  socket.onmessage = (event) => {
    console.log('WebSocket message received:', event.data);
    // Handle the message here or pass it to a handler function
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