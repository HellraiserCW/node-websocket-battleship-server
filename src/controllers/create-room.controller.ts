import { updateRoom } from './update-room.controller';
import { createNewRoom, isRoom } from '../services/create-room.service';

export const createRoom = (userId: string): void => {
    if (isRoom(userId)) return;

    createNewRoom(userId);

    updateRoom();
};
