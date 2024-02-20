import { ControllerFunction, Database, SocketDatabase } from '../models/app.model';
import { User } from '../models/user.model';
import { reg } from '../controllers/reg.controller';
import { createRoom } from '../controllers/create-room.controller';
import { addUserToRoom } from '../controllers/add-user-to-room.controller';
import { addShips } from '../controllers/add-ships.controller';
import { attack } from '../controllers/attack.controller';
import { Room } from '../models/room.model';
import { Game } from '../models/game.model';
import { singlePlay } from '../controllers/single-play.controller';
import { ShipInfo } from '../models/ship.model';

export enum RequestTypes {
    Reg = 'reg',
    SinglePlay = 'single_play',
    UpdateWinners = 'update_winners',
    CreateRoom = 'create_room',
    AddUserToRoom = 'add_user_to_room',
    CreateGame = 'create_game',
    UpdateRoom = 'update_room',
    AddShips = 'add_ships',
    StartGame = 'start_game',
    Attack = 'attack',
    RandomAttack = 'randomAttack',
    Turn = 'turn',
    Finish = 'finish'
}

export const userDatabase: Database<User> = new Map<string, User>();

export const roomDatabase: Database<Room> = new Map<string, Room>();

export const gameDatabase: Database<Game> = new Map<string, Game>();

export const socketDatabase: SocketDatabase = {};

export const controllerMap: Partial<Record<RequestTypes, ControllerFunction>> = {
    [RequestTypes.Reg]: reg,
    [RequestTypes.SinglePlay]: singlePlay,
    [RequestTypes.CreateRoom]: createRoom,
    [RequestTypes.AddUserToRoom]: addUserToRoom,
    [RequestTypes.AddShips]: addShips,
    [RequestTypes.Attack]: attack,
    [RequestTypes.RandomAttack]: attack,
};

export enum StatusTypes {
    miss = 'miss',
    killed = 'killed',
    shot = 'shot'
}

export const computerShipsArrangements: ShipInfo[][] = [
    [
        { position: { x: 5, y: 4 }, direction: false, type: 'huge', length: 4 },
        { position: { x: 2, y: 5 }, direction: true, type: 'large', length: 3 },
        { position: { x: 6, y: 0 }, direction: true, type: 'large', length: 3 },
        { position: { x: 4, y: 8 }, direction: false, type: 'medium', length: 2 },
        { position: { x: 8, y: 0 }, direction: true, type: 'medium', length: 2 },
        { position: { x: 7, y: 6 }, direction: false, type: 'medium', length: 2 },
        { position: { x: 0, y: 4 }, direction: false, type: 'small', length: 1 },
        { position: { x: 0, y: 8 }, direction: false, type: 'small', length: 1 },
        { position: { x: 8, y: 8 }, direction: false, type: 'small', length: 1 },
        { position: { x: 2, y: 2 }, direction: false, type: 'small', length: 1 }
    ],
    [
        { position: { x: 4, y: 3 }, direction: false, type: 'huge', length: 4 },
        { position: { x: 5, y: 1 }, direction: false, type: 'large', length: 3 },
        { position: { x: 2, y: 6 }, direction: true, type: 'large', length: 3 },
        { position: { x: 1, y: 0 }, direction: true, type: 'medium', length: 2 },
        { position: { x: 5, y: 7 }, direction: false, type: 'medium', length: 2 },
        { position: { x: 0, y: 6 }, direction: true, type: 'medium', length: 2 },
        { position: { x: 8, y: 8 }, direction: true, type: 'small', length: 1 },
        { position: { x: 1, y: 4 }, direction: false, type: 'small', length: 1 },
        { position: { x: 4, y: 5 }, direction: true, type: 'small', length: 1 },
        { position: { x: 9, y: 2 }, direction: false, type: 'small', length: 1 }
    ],
    [
        { position: { x: 5, y: 1 }, direction: false, type: 'huge', length: 4 },
        { position: { x: 1, y: 8 }, direction: false, type: 'large', length: 3 },
        { position: { x: 8, y: 4 }, direction: true, type: 'large', length: 3 },
        { position: { x: 1, y: 1 }, direction: true, type: 'medium', length: 2 },
        { position: { x: 3, y: 4 }, direction: false, type: 'medium', length: 2 },
        { position: { x: 6, y: 4 }, direction: true, type: 'medium', length: 2 },
        { position: { x: 6, y: 8 }, direction: false, type: 'small', length: 1 },
        { position: { x: 3, y: 1 }, direction: false, type: 'small', length: 1 },
        { position: { x: 1, y: 6 }, direction: false, type: 'small', length: 1 },
        { position: { x: 3, y: 6 }, direction: true, type: 'small', length: 1 }
    ]
];
