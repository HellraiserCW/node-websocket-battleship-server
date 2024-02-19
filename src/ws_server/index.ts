import WebSocket, { WebSocketServer } from 'ws';

import { ClientRequest, ControllerFunction } from './models/app.model';
import { controllerMap, RequestTypes, socketDb } from './config/app.config';
import { getUserId } from './helpers/helpers';

const PORT: number = Number(process.env.WS_PORT) || 3000;

const server: WebSocketServer = new WebSocket.Server({ port: PORT });

console.log(`WebSocket Server is running on PORT: ${PORT}`);

const handleRequest = (type: RequestTypes, id: number, data?: any) => {
    const controller: ControllerFunction | undefined = controllerMap[type];

    controller
        ? controller(id, data)
        : console.log(`Unknown request type: ${type}`);
}

const onConnect = (wsClient: any): void => {
    const id: number = getUserId();
    console.log(`User with id: ${id} connected`);

    wsClient.on('message', (message: string): void => {
        const { type, data }: ClientRequest = JSON.parse(message.toString());
        console.log(`Incoming request: ${type}`);
        console.log(data);

        socketDb[id] = wsClient;

        handleRequest(type, id, data);
    });

    wsClient.on('close', (): void => {
        console.log(`Connection with user id: ${id} closed`);
        wsClient.close();
    });
};

server.on('connection', onConnect);
