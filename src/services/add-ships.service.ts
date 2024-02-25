import { Ship, ShipClass, ShipInfo } from '../models/ship.model';
import { Game } from '../models/game.model';
import { gameDatabase } from '../config/app.config';

export const addShipsToBoard = (gameId: string, ships: ShipInfo[], indexPlayer: string) => {
    const shipsSetup: Ship[] = [];

    ships.forEach(({ position, direction, length, type }: ShipInfo) => shipsSetup.push(new ShipClass(position, direction, length, type)));

    const game: Game = gameDatabase.get(gameId)!;

    game.addShips(indexPlayer, shipsSetup);
    game.createBoard(indexPlayer);

    return game;
};

export const getShipsInfo = (game: Game, indexPlayer: string): ShipInfo[] => {
    const playerShips: Ship[] = game.ships.get(indexPlayer)!;

    return playerShips.map(({ position, direction, length, type }) => ({
        position,
        direction,
        length,
        type
    }));
};

export const setGameTurn = (game: Game, player: string) => {
    game.turn = player;
};
