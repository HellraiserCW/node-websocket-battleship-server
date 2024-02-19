import WebSocket, { WebSocketServer } from 'ws';

const PORT: number = Number(process.env.WS_PORT) || 3000;

const server: WebSocketServer = new WebSocketServer({ port: PORT });

console.log(`WebSocket Server is running on PORT: ${PORT}`);

const onConnect = (wsClient: WebSocket): void => {
    wsClient.on('message', (message: string) => {
        console.log(JSON.parse(message.toString()));
    });

    wsClient.on('close', () => {
        wsClient.close();
    });
};

server.on('connection', onConnect);
