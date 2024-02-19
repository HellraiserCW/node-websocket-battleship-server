import { RequestTypes } from '../config/app.config';
import { User } from './user.model';
import { Room } from './room.model';
import { Game } from './game.model';

export interface ClientRequest {
    type: RequestTypes;
    data: string;
    id: 0;
}

interface SocketDb {
    [x: string]: WebSocket;
}

export interface Store {
    userDb: Map<number, User>;
    roomDb: Map<number, Room>;
    gameDb: Map<number, Game>;
    socketDb: SocketDb;
}

export type ControllerFunction = (id: number, data?: any) => void;
