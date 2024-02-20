import WebSocket from 'ws';

import { RequestTypes } from '../config/app.config';
import { User } from './user.model';
import { Room } from './room.model';
import { Game } from './game.model';
import { ShipInfo } from './ship.model';

export interface ClientRequest {
    type: RequestTypes;
    data: string;
    id: 0;
}

interface SocketDatabase {
    [x: string]: WebSocket;
}

export interface DatabaseStorage {
    userDatabase: Map<number, User>;
    roomDatabase: Map<number, Room>;
    gameDatabase: Map<number, Game>;
    socketDatabase: SocketDatabase;
}

export type ControllerFunction = (id: number, data?: any) => void;

export interface Reg {
    name: string;
    password: string;
}

export interface UpdateWinners {
    name: string;
    wins: number;
}

export interface AddUserToRoom {
    indexRoom: number;
}

export interface AddShips {
    gameId: number;
    ships: ShipInfo[];
    indexPlayer: number;
}

export interface Attack {
    gameId: number;
    x: number;
    y: number;
    indexPlayer: number;
}
