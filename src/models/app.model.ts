import WebSocket from 'ws';

import { RequestTypes } from '../config/app.config';
import { ShipInfo } from './ship.model';

export interface ClientRequest {
    type: RequestTypes;
    data: string;
    id: 0;
}

export interface SocketDatabase {
    [key: string]: WebSocket;
}

export type Database<T> = Map<string, T>;

export type ControllerFunction = (id: string, data: string) => void;

export interface Reg {
    name: string;
    password: string;
}

export interface UpdateWinners {
    name: string;
    wins: number;
}

export interface AddUserToRoom {
    indexRoom: string;
}

export interface AddShips {
    gameId: string;
    ships: ShipInfo[];
    indexPlayer: string;
}

export interface Attack {
    gameId: string;
    x: number;
    y: number;
    indexPlayer: string;
}
