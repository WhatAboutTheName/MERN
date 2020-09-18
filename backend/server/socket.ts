import SocketIO from 'socket.io';

let io: any;

export let WSocketIO = {
    init: (httpServer: any) => {
        io = SocketIO(httpServer);
        return io;
    },
    getIO: () => {
        if (!io) {
            throw new Error('Socket.io not initialized!');
        }
        return io;
    }
};