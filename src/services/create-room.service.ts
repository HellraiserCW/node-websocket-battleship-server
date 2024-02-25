import { roomDatabase, userDatabase } from '../config/app.config';
import { RoomClass } from '../models/room.model';
import { User } from '../models/user.model';

export const isRoom = (userId: string): boolean => [...roomDatabase.values()].some(room => room.roomUsers.some(roomUser => roomUser.index === userId));

export const createNewRoom = (userId: string): void => {
    const room: RoomClass = new RoomClass();
    const { index, name }: User = userDatabase.get(userId)!;

    room.addUser({ index, name });
    roomDatabase.set(room.roomId, room);
};
