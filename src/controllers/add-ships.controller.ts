import { AddShips } from '../models/app.model';
import { Ship, ShipClass, ShipInfo } from '../models/ship.model';
import { gameDatabase, RequestTypes, socketDatabase } from '../config/app.config';
import { Game } from '../models/game.model';
import { createResponseJson } from '../helpers/helpers';
import { turn } from './turn.controller';

const startGame = (game: Game): void => {
    const { players }: Game = game;

    players.forEach((indexPlayer) => {
        const playerShips: Ship[] = game.ships.get(indexPlayer)!;
        const ships: ShipInfo[] = playerShips.map(({ position, direction, length, type }) => ({
            position,
            direction,
            length,
            type
        }));
        const response: string = createResponseJson(RequestTypes.StartGame, JSON.stringify({ ships, currentPlayerIndex: indexPlayer }));

        if (indexPlayer in socketDatabase) {
            socketDatabase[indexPlayer].send(response);
        }
    });

    game.turn = players[0];
    turn(game);
};

export const addShips = (_userId: string, data: string): void => {
    const { gameId, ships, indexPlayer }: AddShips = JSON.parse(data);
    const setupShips: Ship[] = [];

    ships.forEach(({ position, direction, length, type }: ShipInfo) => setupShips.push(new ShipClass(position, direction, length, type)));

    const game: Game = gameDatabase.get(gameId)!;

    game.addShips(indexPlayer, setupShips);
    game.createBoard(indexPlayer);

    if (game.ships.size === 2) {
        startGame(game);
    }
};
