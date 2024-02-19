import WebSocket from 'ws';

import { Room } from '../models/room.model';
import { RequestTypes, roomDatabase, socketDatabase } from '../config/app.config';
import { generateResponseDto } from '../helpers/helpers';

export const updateRoom = (): void => {
    const rooms: Room[] = Array.from(roomDatabase.values());
    const response: string = generateResponseDto(RequestTypes.UpdateRoom, JSON.stringify(rooms));

    Object.keys(socketDatabase).forEach((id) => {
        const socket: WebSocket = socketDatabase[id];

        socket.send(response);
    });
};
