import { updateRoom } from './update-room.controller';
import { RoomClass } from '../models/room.model';
import { roomDatabase, userDatabase } from '../config/app.config';
import { User } from '../models/user.model';

const isRoom = (userId: string): boolean => [...roomDatabase.values()].some(room => room.roomUsers.some(roomUser => roomUser.index === userId));

export const createRoom = (userId: string): void => {
    if (isRoom(userId)) return;

    const room: RoomClass = new RoomClass();
    const { index, name }: User = userDatabase.get(userId)!;

    room.addUser({ index, name });
    roomDatabase.set(room.roomId, room);

    updateRoom();
};

