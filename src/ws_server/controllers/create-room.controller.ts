import { updateRoom } from './update-room.controller';
import { RoomClass } from '../models/room.model';
import { roomDatabase, userDatabase } from '../config/app.config';
import { User } from '../models/user.model';

const isRoom = (userId: number): boolean => [...roomDatabase.values()].some(room => room.roomUsers.some(roomUser => roomUser.index === userId));

export const createRoom = (userId: number): void => {
    if (isRoom(userId)) return;

    const newRoom: RoomClass = new RoomClass();
    const { index, name }: User = userDatabase.get(userId)!;

    newRoom.addUser({ index, name });
    roomDatabase.set(newRoom.roomId, newRoom);

    updateRoom();
};

