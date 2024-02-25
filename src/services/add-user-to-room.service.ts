import { Room } from '../models/room.model';
import { gameDatabase, roomDatabase, userDatabase } from '../config/app.config';
import { User } from '../models/user.model';
import { GameClass } from '../models/game.model';

export const getRoomFromDatabase = (indexRoom: string): Room => roomDatabase.get(indexRoom)!;

export const isUserInRoom = (userId: string, room: Room) => room.roomUsers.find((user) => user.index === userId);

export const getUserFromDatabase = (userId: string) => userDatabase.get(userId)!;

export const addNewUserToRoom = (room: Room, userId: string) => {
    const { index, name }: User = getUserFromDatabase(userId);

    room.addUser({ index, name });
}

export const createNewGame = (room: Room) => {
    const newGame: GameClass = new GameClass();

    room.roomUsers.forEach(({ index }) => newGame.addPlayer(index));
    gameDatabase.set(newGame.gameId, newGame);

    return newGame;
};

export const removeUnavailableRooms = (userId: string): void => {
    Array.from(roomDatabase.entries()).forEach(({ 0: roomId, 1: room} ) => {
        const hasUser = room.roomUsers.some(user => user.index === userId);

        if (hasUser) {
            roomDatabase.delete(roomId);
        }
    });
};
