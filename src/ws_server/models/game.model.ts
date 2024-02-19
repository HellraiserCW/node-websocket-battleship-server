import { Ship } from './ship.model';

export interface Game {
    gameId: number;
    players: number[];
    ships: Map<number, Ship[]>;
    turn?: number;
    board: Map<number, Map<string, boolean>>;

    addPlayer(playerId: number): void;
    addShips(playerId: number, ships: Ship[]): void;
    createBoard(playerId: number): void;
}

export class GameClass implements Game {
    gameId: number;
    players: number[];
    ships: Map<number, Ship[]>;
    turn?: number;
    board: Map<number, Map<string, boolean>>;
    private static lastId: number = 0;

    constructor() {
        this.gameId = this.generateNextId();
        this.players = [];
        this.ships = new Map();
        this.board = new Map();
    }

    addPlayer(playerId: number): void {
        this.players.push(playerId);
    }

    addShips(playerId: number, ships: Ship[]): void {
        this.ships.set(playerId, ships);
    }

    createBoard(playerId: number): void {
        const matrixSize = 10;
        const matrixMap = new Map<string, boolean>();

        for (let x = 0; x < matrixSize; x++) {
            for (let y = 0; y < matrixSize; y++) {
                matrixMap.set(`${x}-${y}`, false);
            }
        }

        this.board.set(playerId, matrixMap);

    }
    private generateNextId(): number {
        return GameClass.lastId++;
    }
}
