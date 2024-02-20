import { gameDatabase, RequestTypes, socketDatabase, StatusTypes, userDatabase } from '../config/app.config';
import { Attack } from '../models/app.model';
import { Game } from '../models/game.model';
import { Ship, ShipStatus } from '../models/ship.model';
import { createResponseJson, getSurroundingCoordinates } from '../helpers/helpers';
import { turn } from './turn.controller';
import { User } from '../models/user.model';
import { updateWinners } from './update-winners.controller';

export const attack = (_userId: number, data: string): void => {
    const { gameId, x, y, indexPlayer }: Attack = JSON.parse(data);
    const game: Game = gameDatabase.get(gameId)!;

    if (game.turn !== indexPlayer) return;

    const opponentId: number = game.players.find((index) => index !== indexPlayer)!;
    const opponentBoard: Map<string, boolean> = game.board.get(opponentId)!;

    if (opponentBoard.get(`${x}-${y}`)) return;

    const opponentShips: Ship[] = game.ships.get(opponentId)!;
    const ship: Ship | undefined = opponentShips.find((shot) => shot.shipPositionMap.has(`${x}-${y}`));

    if (!ship) {
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

        return;
    }

    ship.shipPositionMap.set(`${x}-${y}`, true);

    const shipIndex: number = opponentShips.findIndex((ship) => ship.shipPositionMap.has(`${x}-${y}`));

    opponentShips[shipIndex] = ship;

    const shipStatus: ShipStatus = ship.getStatus();

    if (shipStatus === StatusTypes.shot) {
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

        return;
    }

    if (shipStatus === StatusTypes.killed) {
        const shipCoordinates: number[][] = [];

        ship.shipPositionMap.forEach((_, key) => {
            const coordinates: number[] = key.split('-').map((value) => +value);

            shipCoordinates.push(coordinates);

            const [x, y] = coordinates;

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

        surroundingCoordinates.forEach(([x, y]) => {
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

        const isWinner: boolean = opponentShips.every((ship) => ship.getStatus() === StatusTypes.killed);

        if (isWinner) {
            const response: string = createResponseJson(RequestTypes.Finish, JSON.stringify({ winPlayer: indexPlayer }));

            game.players.forEach((indexPlayer) => {
                if (indexPlayer in socketDatabase) {
                    socketDatabase[indexPlayer].send(response);
                }
            });

            const winner: User = userDatabase.get(indexPlayer)!;
            winner.wins++;

            updateWinners();
        }

        return;
    }
};
