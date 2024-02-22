import { Room } from '../models/room.model';
import { RequestTypes, socketDatabase } from '../config/app.config';
import { createResponseJson } from '../helpers/helpers';
import { getExistingRooms } from '../services/update-room.service';

export const updateRoom = (): void => {
    const rooms: Room[] = getExistingRooms();
    const response: string = createResponseJson(RequestTypes.UpdateRoom, JSON.stringify(rooms));

    Object.keys(socketDatabase).forEach((id) => {
        socketDatabase[id].send(response);
    });
};
