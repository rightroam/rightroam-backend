import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';
let socket = null;

export const socketService = {
  connect: (token) => {
    socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
    });
    socket.on('connect', () => console.log('Socket connecté'));
    socket.on('disconnect', () => console.log('Socket déconnecté'));
    return socket;
  },

  joinRoom: (roomId, userId) => {
    socket?.emit('join_room', { roomId, userId });
  },

  sendMessage: (roomId, message, senderId, senderName) => {
    socket?.emit('send_message', { roomId, message, senderId, senderName });
  },

  onMessage: (callback) => {
    socket?.on('receive_message', callback);
  },

  offMessage: () => {
    socket?.off('receive_message');
  },

  disconnect: () => {
    socket?.disconnect();
    socket = null;
  },
};
