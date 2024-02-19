import WebSocket, { WebSocketServer } from 'ws';

import { ClientRequest, ControllerFunction } from './models/app.model';
import { controllerMap, RequestTypes, socketDatabase } from './config/app.config';
import { getUserId } from './helpers/helpers';

const PORT: number = Number(process.env.WS_PORT) || 3000;

const server: WebSocketServer = new WebSocket.Server({ port: PORT });

console.log(`WebSocket Server is running on PORT: ${PORT}`);

const handleRequest = (type: RequestTypes, userId: number, data?: any) => {
    const controller: ControllerFunction | undefined = controllerMap[type];

    controller
        ? controller(userId, data)
        : console.log(`Unknown request type: ${type}`);
}

const onConnect = (wsClient: WebSocket): void => {
    const userId: number = getUserId();
    console.log(`User with id: ${userId} connected`);

    wsClient.on('message', (message: string): void => {
        const { type, data }: ClientRequest = JSON.parse(message.toString());
        console.log(`Incoming request: ${type}`);
        console.log(data);

        socketDatabase[userId] = wsClient;

        handleRequest(type, userId, data);
    });

    wsClient.on('close', (): void => {
        console.log(`Connection with user id: ${userId} closed`);
        wsClient.close();
    });
};

server.on('connection', onConnect);
