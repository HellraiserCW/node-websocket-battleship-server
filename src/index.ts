import WebSocket, { WebSocketServer } from 'ws';
import dotenv from 'dotenv';

import { ClientRequest, ControllerFunction } from './models/app.model';
import { controllerMap, RequestTypes, socketDatabase } from './config/app.config';
import { getUserId, removeUnavailableRooms, validateJsonMessage } from './helpers/helpers';
import { httpServer } from './http_server';
import { updateRoom } from './controllers/update-room.controller';

dotenv.config();

const HTTP_PORT: number = Number(process.env.HTTP_PORT) || 8181;
const WS_PORT: number = Number(process.env.WS_PORT) || 3000;

httpServer.listen(HTTP_PORT);

const server: WebSocketServer = new WebSocket.Server({ port: WS_PORT });

console.log(`Http Server is running on PORT: ${HTTP_PORT}`);
console.log(`WebSocket Server is running on PORT: ${WS_PORT}`);

const handleRequest = (type: RequestTypes, userId: string, data: string): void => {
    const controller: ControllerFunction | undefined = controllerMap[type];

    controller
        ? controller(userId, data)
        : console.log(`Unknown request type: ${type}`);
};

const onConnectHandler = (ws: WebSocket): void => {
    const userId: string = getUserId();
    console.log(`User with id: ${userId} connected`);

    ws.on('message', (message: string): void => {
        const validatedJson: ClientRequest | false = validateJsonMessage(message);

        const { type, data } = validatedJson as ClientRequest;

        console.log(`Incoming request: ${type} from user: ${userId}`);

        socketDatabase[userId] = ws;

        handleRequest(type, userId, data);
    });

    ws.on('close', (): void => {
        console.log(`Connection with user id: ${userId} closed`);

        removeUnavailableRooms(userId);
        updateRoom();
        ws.close();
    });
};

server.on('connection', onConnectHandler);
