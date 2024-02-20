import { v4 as uuidv4 } from 'uuid';

import { Ship } from './ship.model';

export interface Game {
    gameId: string;
    players: string[];
    ships: Map<string, Ship[]>;
    board: Map<string, Map<string, boolean>>;
    turn?: string;
    addPlayer(playerId: string): void;
    addShips(playerId: string, ships: Ship[]): void;
    createBoard(playerId: string): void;
}

export class GameClass implements Game {
    constructor(
        public gameId: string = uuidv4(),
        public players: string[] = [],
        public ships: Map<string, Ship[]> = new Map(),
        public board: Map<string, Map<string, boolean>> = new Map(),
        public turn?: string
    ) {}

    addPlayer(playerId: string): void {
        this.players.push(playerId);
    }

    addShips(playerId: string, ships: Ship[]): void {
        this.ships.set(playerId, ships);
    }

    createBoard(playerId: string): void {
        const boardSize = 10;
        const boardMap: Map<string, boolean> = new Map<string, boolean>();

        for (let x = 0; x < boardSize; x++) {
            for (let y = 0; y < boardSize; y++) {
                boardMap.set(`${x}-${y}`, false);
            }
        }

        this.board.set(playerId, boardMap);
    }
}
