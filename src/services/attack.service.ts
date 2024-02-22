import { Game } from '../models/game.model';
import { createResponseJson } from '../helpers/helpers';
import {
    gameDatabase,
    RequestTypes,
    socketDatabase,
    StatusTypes,
    userDatabase,
} from '../config/app.config';
import { User } from '../models/user.model';
import { updateWinners } from '../controllers/update-winners.controller';
import { turn } from '../controllers/turn.controller';
import { Position, Ship } from '../models/ship.model';

const getCoordinatesAroundShip = (shipCoordinates: number[][]): number[][] => {
    const coordinatesAroundShip: Set<string> = new Set();

    shipCoordinates.forEach((coords) => {
        const { 0: x, 1: y }: number[] = coords;

        for (let xEnd = -1; xEnd <= 1; xEnd++) {
            for (let yEnd = -1; yEnd <= 1; yEnd++) {
                const newX = x + xEnd;
                const newY = y + yEnd;

                if (xEnd === 0 && yEnd === 0) continue;

                coordinatesAroundShip.add(`${newX},${newY}`);
            }
        }
    });

    shipCoordinates.forEach((coords) => {
        const coordinates = coords.join(',');

        coordinatesAroundShip.delete(coordinates);
    });

    return Array.from(coordinatesAroundShip).map((coords) => coords.split(',').map((value) => +value));
};

const generateNewCoordinates = (board: Map<string, boolean>): Position => {
    const fieldSize = 10;
    let x: number;
    let y: number;

    do {
        x = Math.floor(Math.random() * fieldSize);
        y = Math.floor(Math.random() * fieldSize);
    } while (board.get(`${x}-${y}`));

    return { x, y };
};

export const setOpponentShip = (opponentShips: Ship[], ship: Ship, x: number, y: number): void => {
    ship.shipPosition.set(`${x}-${y}`, true);

    const shipIndex: number = opponentShips.findIndex((ship) => ship.shipPosition.has(`${x}-${y}`));

    opponentShips[shipIndex] = ship;
}

export const getShip = (opponentShips: Ship[], x: number, y: number): Ship | undefined => opponentShips.find((ship) => ship.shipPosition.has(`${x}-${y}`));

export const getOpponentShips = (game: Game, opponentId: string): Ship[] => game.ships.get(opponentId)!;

export const getShotCoordinates = (opponentBoard: Map<string, boolean>, selectedX: number | undefined, selectedY: number | undefined): {x: number, y: number} => {
    let x: number | undefined = selectedX;
    let y: number | undefined = selectedY;

    if (x === undefined || y === undefined) {
        const coordinates: Position = generateNewCoordinates(opponentBoard);

        x = coordinates.x;
        y = coordinates.y;
    }

    return { x, y };
};

export const getOpponentId = (game: Game, indexPlayer: string): string => game.players.find((index) => index !== indexPlayer)!;

export const getOpponentBoard = (game: Game, opponentId: string): Map<string, boolean> => game.board.get(opponentId)!;

export const getGameFromDatabase = (gameId: string): Game => gameDatabase.get(gameId)!;

export const handleGameWinner = (game: Game, indexPlayer: string): void => {
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

export const handleMissedShot = (opponentBoard: Map<string, boolean>, x: number, y: number, indexPlayer: string, game: Game, opponentId: string): void => {
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

export const handleHitShot = (opponentBoard: Map<string, boolean>, x: number, y: number, indexPlayer: string, game: Game): void => {
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

export const handleKillShot = (opponentBoard: Map<string, boolean>, x: number, y: number, indexPlayer: string, game: Game, ship: Ship, opponentShips: Ship[]): void => {
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

    const coordinatesAroundShip: number[][] = getCoordinatesAroundShip(shipCoordinates);

    coordinatesAroundShip.forEach(({0: x, 1: y}) => {
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
