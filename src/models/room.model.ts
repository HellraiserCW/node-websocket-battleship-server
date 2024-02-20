import { v4 as uuidv4 } from 'uuid';

export interface RoomUser {
    name: string;
    index: string;
}

export interface Room {
    roomId: string;
    roomUsers: RoomUser[];
    addUser(user: RoomUser): void;
}

export class RoomClass implements Room {
    constructor(
        public roomId: string = uuidv4(),
        public roomUsers: RoomUser[] = []
    ) {}

    addUser(user: RoomUser): void {
        this.roomUsers.push(user);
    }
}
