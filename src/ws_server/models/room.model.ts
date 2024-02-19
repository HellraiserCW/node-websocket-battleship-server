export interface RoomUser {
    name: string;
    index: number;
}

export interface Room {
    roomId: number;
    roomUsers: RoomUser[];
    addUser(user: RoomUser): void;
}

export class RoomClass implements Room {
    roomId: number;
    roomUsers: RoomUser[];
    private static lastId: number = 0;

    constructor(roomUsers: RoomUser[] = []) {
        this.roomId = this.generateNextId();
        this.roomUsers = roomUsers;
    }

    addUser(user: RoomUser): void {
        this.roomUsers.push(user);
    }

    private generateNextId(): number {
        return RoomClass.lastId++
    }
}
