import { Attack } from '../models/app.model';
import { Game } from '../models/game.model';
import { gameDatabase, RequestTypes, StatusTypes, socketDatabase, userDatabase } from '../config/app.config';
import { Position, Ship, ShipStatus } from '../models/ship.model';
import { createResponseJson, generateCoordinates, getSurroundingCoordinates } from '../helpers/helpers';
import { turn } from './turn.controller';
import { User } from '../models/user.model';
import { updateWinners } from './update-winners.controller';

const handleGameWinner = (game: Game, indexPlayer: string): void => {
    const response: string = createResponseJson(RequestTypes.Finish, JSON.stringify({ winPlayer: indexPlayer }));

    game.players.forEach((indexPlayer) => {
        if (indexPlayer in socketDatabase) {
            socketDatabase[indexPlayer].send(response);
        }
    });

    if (indexPlayer !== 'computer') {
        const winner: User = userDatabase.get(indexPlayer)!;
        winner.wins++;
    }

    updateWinners();
};

const handleMissedShot = (opponentBoard: Map<string, boolean>, x: number, y: number, indexPlayer: string, game: Game, opponentId: string): void => {
    opponentBoard.set(`${x}-${y}`, true);

    const response: string = createResponseJson(RequestTypes.Attack, JSON.stringify({
        position: { x, y },
        currentPlayer: indexPlayer,
        status: StatusTypes.miss,
    }));

    game.players.forEach((indexPlayer) => {
        if (indexPlayer in socketDatabase) {
            socketDatabase[indexPlayer].send(response);
        }
    });

    game.turn = opponentId;
    turn(game);
};

const handleHitShot = (opponentBoard: Map<string, boolean>, x: number, y: number, indexPlayer: string, game: Game): void => {
    opponentBoard.set(`${x}-${y}`, true);

    const response: string = createResponseJson(RequestTypes.Attack, JSON.stringify({
        position: { x, y },
        currentPlayer: indexPlayer,
        status: StatusTypes.shot,
    }));

    game.players.forEach((indexPlayer) => {
        if (indexPlayer in socketDatabase) {
            socketDatabase[indexPlayer].send(response);
        }
    });

    turn(game);
};

const handleKillShot = (opponentBoard: Map<string, boolean>, x: number, y: number, indexPlayer: string, game: Game, ship: Ship, opponentShips: Ship[]): void => {
    const shipCoordinates: number[][] = [];

    ship.shipPosition.forEach((_, key) => {
        const coordinates: number[] = key.split('-').map((value) => +value);

        shipCoordinates.push(coordinates);

        const { 0: x, 1: y }: number[] = coordinates;

        opponentBoard.set(`${x}-${y}`, true);

        const response: string = createResponseJson(RequestTypes.Attack, JSON.stringify({
            position: { x, y },
            currentPlayer: indexPlayer,
            status: StatusTypes.killed,
        }));

        game.players.forEach((indexPlayer) => {
            if (indexPlayer in socketDatabase) {
                socketDatabase[indexPlayer].send(response);
            }
        });
    });

    const surroundingCoordinates: number[][] = getSurroundingCoordinates(shipCoordinates);

    surroundingCoordinates.forEach(({0: x, 1: y}) => {
        if (x > -1 && y > -1 && x < 10 && y < 10) {
            opponentBoard.set(`${x}-${y}`, true);
        }

        const response: string = createResponseJson(RequestTypes.Attack, JSON.stringify({
            position: { x, y },
            currentPlayer: indexPlayer,
            status: StatusTypes.miss,
        }));

        game.players.forEach((indexPlayer) => {
            if (indexPlayer in socketDatabase) {
                socketDatabase[indexPlayer].send(response);
            }
        });
    });

    turn(game);

    const isWinner: boolean = opponentShips.every((ship) => ship.getShipStatus() === StatusTypes.killed);

    if (isWinner) {
        handleGameWinner(game, indexPlayer);
    }
};

export const attack = (_userId: string, data: string): void => {
    const { gameId, x: selectedX, y: selectedY, indexPlayer }: Attack = JSON.parse(data);
    const game: Game = gameDatabase.get(gameId)!;
    let x: number | undefined = selectedX;
    let y: number | undefined = selectedY;

    if (game.turn !== indexPlayer) return;

    const opponentId: string = game.players.find((index) => index !== indexPlayer)!;
    const opponentBoard: Map<string, boolean> = game.board.get(opponentId)!;

    if (x === undefined || y === undefined) {
        const coordinates: Position = generateCoordinates(opponentBoard);

        x = coordinates.x;
        y = coordinates.y;
    }

    if (opponentBoard.get(`${x}-${y}`)) return;

    const opponentShips: Ship[] = game.ships.get(opponentId)!;
    const ship: Ship | undefined = opponentShips.find((ship) => ship.shipPosition.has(`${x}-${y}`));

    if (!ship) {
        return handleMissedShot(opponentBoard, x, y, indexPlayer, game, opponentId);
    }

    ship.shipPosition.set(`${x}-${y}`, true);

    const shipIndex: number = opponentShips.findIndex((ship) => ship.shipPosition.has(`${x}-${y}`));

    opponentShips[shipIndex] = ship;

    const shipStatus: ShipStatus = ship.getShipStatus();

    if (shipStatus === StatusTypes.shot) {
        return handleHitShot(opponentBoard, x, y, indexPlayer, game);
    }

    if (shipStatus === StatusTypes.killed) {
        return handleKillShot(opponentBoard, x, y, indexPlayer, game, ship, opponentShips);
    }
};
