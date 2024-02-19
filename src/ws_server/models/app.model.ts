import WebSocket from 'ws';

import { RequestTypes } from '../config/app.config';
import { User } from './user.model';
import { Room } from './room.model';
import { Game } from './game.model';

export interface ClientRequest {
    type: RequestTypes;
    data: string;
    id: 0;
}

interface SocketDatabase {
    [x: string]: WebSocket;
}

export interface DatabaseStore {
    userDatabase: Map<number, User>;
    roomDatabase: Map<number, Room>;
    gameDatabase: Map<number, Game>;
    socketDatabase: SocketDatabase;
}

export type ControllerFunction = (id: number, data?: any) => void;

export interface RegUserData {
    name: string;
    password: string;
}

export interface RegServerData {
    name: string;
    index: number;
    error: boolean;
    errorText: string;
}
