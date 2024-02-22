import { AddShips } from '../models/app.model';
import { addShipsToBoard, getShipsInfo, setGameTurn } from '../services/add-ships.service';
import { Game } from '../models/game.model';
import { ShipInfo } from '../models/ship.model';
import { createResponseJson } from '../helpers/helpers';
import { RequestTypes, socketDatabase } from '../config/app.config';
import { turn } from './turn.controller';

export const addShips = (_userId: string, data: string): void => {
    const { gameId, ships, indexPlayer }: AddShips = JSON.parse(data);

    const game: Game = addShipsToBoard(gameId, ships, indexPlayer);

    if (game.ships.size === 2) {
        const { players }: Game = game;

        players.forEach((indexPlayer) => {
            const ships: ShipInfo[] = getShipsInfo(game, indexPlayer);
            const response: string = createResponseJson(RequestTypes.StartGame, JSON.stringify({
                ships,
                currentPlayerIndex: indexPlayer
            }));

            if (indexPlayer in socketDatabase) {
                socketDatabase[indexPlayer].send(response);
            }

        });

        setGameTurn(game, players[0]);

        turn(game);
    }
};
