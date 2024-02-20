import { RoomClass } from '../models/room.model';
import {
    computerShipsArrangements,
    gameDatabase,
    RequestTypes,
    roomDatabase,
    socketDatabase,
    userDatabase,
} from '../config/app.config';
import { createResponseJson } from '../helpers/helpers';
import { Ship, ShipClass, ShipInfo } from '../models/ship.model';
import { GameClass } from '../models/game.model';
import { User } from '../models/user.model';
import { updateRoom } from './update-room.controller';

export const singlePlay = (id: string): void => {
    const room: RoomClass = new RoomClass();
    const { index, name }: User = userDatabase.get(id)!;

    room.addUser({ index, name });
    room.addUser({ index: 'computer', name: 'computer' });
    roomDatabase.set(room.roomId, room);

    const newGame: GameClass = new GameClass();

    room.roomUsers.forEach(({ index }) => newGame.addPlayer(index));
    gameDatabase.set(newGame.gameId, newGame);

    const response: string = createResponseJson(RequestTypes.CreateGame, JSON.stringify({ idGame: newGame.gameId, idPlayer: index }));

    socketDatabase[index].send(response);

    const generatedShips: Ship[] = [];
    const randomComputerArrangement: ShipInfo[] = computerShipsArrangements[Math.floor(Math.random() * computerShipsArrangements.length)]

    randomComputerArrangement.forEach(({ position, direction, length, type }: ShipInfo) => generatedShips.push(new ShipClass(position, direction, length, type)));
    newGame.addShips('computer', generatedShips);
    newGame.createBoard('computer');

    roomDatabase.delete(room.roomId);
    updateRoom();
};
