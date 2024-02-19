export interface RoomUsersType {
    name: string;
    index: number;
}

export interface Room {
    roomId: number;
    roomUsers: RoomUsersType[];

    addUser(user: RoomUsersType): void;
}

export class RoomClass implements Room {
    roomId: number;
    roomUsers: RoomUsersType[];
    private static lastId: number = 0;

    constructor(roomUsers: RoomUsersType[] = []) {
        this.roomId = this.generateNextId();
        this.roomUsers = roomUsers;
    }

    addUser(user: RoomUsersType): void {
        this.roomUsers.push(user);
    }


    private generateNextId(): number {
        return RoomClass.lastId++;
    }
}
