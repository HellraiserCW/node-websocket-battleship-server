import { Attack } from '../models/app.model';
import { Game } from '../models/game.model';
import { StatusTypes } from '../config/app.config';
import { Position, Ship, ShipStatus } from '../models/ship.model';
import {
    getGameFromDatabase,
    getOpponentBoard,
    getOpponentId,
    getOpponentShips,
    getShip,
    getShotCoordinates,
    handleHitShot,
    handleKillShot,
    handleMissedShot,
    setOpponentShip
} from '../services/attack.service';

export const attack = (_userId: string, data: string): void => {
    const { gameId, x: selectedX, y: selectedY, indexPlayer }: Attack = JSON.parse(data);
    const game: Game = getGameFromDatabase(gameId);

    if (game.turn !== indexPlayer) return;

    const opponentId: string = getOpponentId(game, indexPlayer);
    const opponentBoard: Map<string, boolean> = getOpponentBoard(game, opponentId);
    const {x, y}: Position = getShotCoordinates(opponentBoard, selectedX, selectedY);

    if (opponentBoard.get(`${x}-${y}`)) return;

    const opponentShips: Ship[] = getOpponentShips(game, opponentId);
    const ship: Ship | undefined = getShip(opponentShips, x, y);

    if (!ship) {
        return handleMissedShot(opponentBoard, x, y, indexPlayer, game, opponentId);
    }

    setOpponentShip(opponentShips, ship, x, y);

    const shipStatus: ShipStatus = ship.getShipStatus();

    if (shipStatus === StatusTypes.shot) {
        return handleHitShot(opponentBoard, x, y, indexPlayer, game);
    }

    if (shipStatus === StatusTypes.killed) {
        return handleKillShot(opponentBoard, x, y, indexPlayer, game, ship, opponentShips);
    }
};
