import { io } from 'socket.io-client';

let socket;

export const initSocket = (userId) => {
  socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:3000', {
    auth: {
      token: localStorage.getItem('token')
    },
    query: {
      userId
    }
  });

  socket.on('connect', () => {
    console.log('Socket connecté');
  });

  socket.on('disconnect', () => {
    console.log('Socket déconnecté');
  });

  return socket;
};

export const subscribeToCorrections = (callback) => {
  if (!socket) return;
  
  socket.on('submission_corrected', (data) => {
    callback(data);
  });
};

export const unsubscribeFromCorrections = () => {
  if (!socket) return;
  
  socket.off('submission_corrected');
};

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};