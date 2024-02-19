import { ControllerFunction, DatabaseStore } from '../models/app.model';
import { User } from '../models/user.model';
import { reg } from '../controllers/reg.controller';
import { createRoom } from '../controllers/create-room.controller';
import { addUserToRoom } from '../controllers/add-user-to-room.controller';
import { addShips } from '../controllers/add-ships.controller';
import { attack } from '../controllers/attack.controller';
import { randomAttack } from '../controllers/random-attack.controller';
import { Room } from '../models/room.model';
import { Game } from '../models/game.model';

export enum RequestTypes {
    Reg = 'reg',
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

export const { userDatabase, roomDatabase, gameDatabase, socketDatabase }: DatabaseStore = {
    userDatabase: new Map<number, User>(),
    roomDatabase: new Map<number, Room>(),
    gameDatabase: new Map<number, Game>(),
    socketDatabase: {}
};

export const controllerMap: Partial<Record<RequestTypes, ControllerFunction>> = {
    [RequestTypes.Reg]: reg,
    [RequestTypes.CreateRoom]: createRoom,
    [RequestTypes.AddUserToRoom]: addUserToRoom,
    [RequestTypes.AddShips]: addShips,
    [RequestTypes.Attack]: attack,
    [RequestTypes.RandomAttack]: randomAttack
};
