import WebSocket from 'ws';

import { gameDatabase, RequestTypes, roomDatabase, socketDatabase, userDatabase } from '../config/app.config';
import { GameClass } from '../models/game.model';
import { generateResponseDto } from '../helpers/helpers';
import { AddUserToRoomClientData } from '../models/app.model';
import { Room } from '../models/room.model';
import { User } from '../models/user.model';
import { updateRoom } from './update-room.controller';

const isUserInRoom = (userId: number, room: Room) => room.roomUsers.find((user) => user.index === userId);

export const addUserToRoom = (userId: number, data: string) => {
    const { indexRoom }: AddUserToRoomClientData = JSON.parse(data);
    const room: Room = roomDatabase.get(indexRoom)!;

    if (isUserInRoom(userId, room)) return;

    const { index, name }: User = userDatabase.get(userId)!;

    room.addUser({ index, name });

    const newGame: GameClass = new GameClass();

    room.roomUsers.forEach(({ index }) => newGame.addPlayer(index));
    gameDatabase.set(newGame.gameId, newGame);

    room.roomUsers.forEach(({ index }) => {
        const response: string = generateResponseDto(RequestTypes.CreateGame, JSON.stringify({ idGame: newGame.gameId, idPlayer: index }));
        const socket: WebSocket = socketDatabase[index];

        socket.send(response);
    });

    roomDatabase.delete(indexRoom);

    updateRoom();
};
