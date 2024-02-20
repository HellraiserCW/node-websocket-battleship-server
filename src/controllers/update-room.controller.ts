import { Room } from '../models/room.model';
import { RequestTypes, roomDatabase, socketDatabase } from '../config/app.config';
import { createResponseJson } from '../helpers/helpers';

export const updateRoom = (): void => {
    const rooms: Room[] = Array.from(roomDatabase.values());
    const response: string = createResponseJson(RequestTypes.UpdateRoom, JSON.stringify(rooms));

    Object.keys(socketDatabase).forEach((id) => {
        socketDatabase[id].send(response);
    });
};
