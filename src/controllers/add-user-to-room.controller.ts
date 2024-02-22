import { RequestTypes, socketDatabase } from '../config/app.config';
import { GameClass } from '../models/game.model';
import { createResponseJson } from '../helpers/helpers';
import { AddUserToRoom } from '../models/app.model';
import { Room } from '../models/room.model';
import { updateRoom } from './update-room.controller';
import {
    addNewUserToRoom,
    createNewGame,
    getRoomFromDatabase,
    isUserInRoom, removeUnavailableRooms,
} from '../services/add-user-to-room.service';


export const addUserToRoom = (userId: string, data: string): void => {
    const { indexRoom }: AddUserToRoom = JSON.parse(data);
    const room: Room = getRoomFromDatabase(indexRoom);

    if (isUserInRoom(userId, room)) return;

    addNewUserToRoom(room, userId);

    const game: GameClass = createNewGame(room);

    room.roomUsers.forEach(({ index }) => {
        const response: string = createResponseJson(RequestTypes.CreateGame, JSON.stringify({
            idGame: game.gameId,
            idPlayer: index
        }));

        socketDatabase[index].send(response);
    });

    removeUnavailableRooms(userId);

    updateRoom();
};
