import {
    computerShipsArrangements,
    RequestTypes,
    socketDatabase,
} from '../config/app.config';
import { createResponseJson } from '../helpers/helpers';
import { ShipInfo } from '../models/ship.model';
import { updateRoom } from './update-room.controller';
import { createSinglePlayGame } from '../services/single-play.service';
import { addShipsToBoard } from '../services/add-ships.service';
import { Game } from '../models/game.model';
import { removeUnavailableRooms } from '../services/add-user-to-room.service';

export const singlePlay = (userId: string): void => {
    const game: Game = createSinglePlayGame(userId);
    const response: string = createResponseJson(RequestTypes.CreateGame, JSON.stringify({
        idGame: game.gameId,
        idPlayer: userId
    }));

    socketDatabase[userId].send(response);

    const randomComputerArrangement: ShipInfo[] = computerShipsArrangements[Math.floor(Math.random() * computerShipsArrangements.length)];

    addShipsToBoard(game.gameId, randomComputerArrangement, 'computer');
    removeUnavailableRooms(userId);
    updateRoom();
};
