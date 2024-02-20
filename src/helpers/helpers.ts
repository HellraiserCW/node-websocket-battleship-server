import { v4 as uuidv4 } from 'uuid';

import { ClientRequest } from '../models/app.model';
import { RequestTypes, roomDatabase, userDatabase } from '../config/app.config';
import { User } from '../models/user.model';
import { Position } from '../models/ship.model';

export const getUserId = (): string => uuidv4();

export const validateJsonMessage = (message: string): ClientRequest | false => {
    try {
        const parsedMessage = JSON.parse(message);
        if (parsedMessage && typeof parsedMessage === 'object') {
            return parsedMessage as ClientRequest;
        }
    } catch {
        console.log('Invalid JSON!');

        return false;
    }

    return false;
};

export const isWrongPassword = (name: string, password: string): boolean => {
    const users: User[] = Array.from(userDatabase.values());
    const user: User | undefined = users.find((user) => user.name === name);

    return !!(user && user.password !== password);
};

export const createResponseJson = (type: RequestTypes, data: string) => {
    return JSON.stringify({
        type,
        data,
        id: 0
    });
};

export const removeUnavailableRooms = (userId: string): void => {
    Array.from(roomDatabase.entries()).forEach(({ 0: roomId, 1: room} ) => {
        const hasUser = room.roomUsers.some(user => user.index === userId);

        if (hasUser) {
            roomDatabase.delete(roomId);
        }
    });
};

export const getSurroundingCoordinates = (shipCoordinates: number[][]): number[][] => {
    const surroundingCoordinates: Set<string> = new Set();

    shipCoordinates.forEach((coords) => {
        const { 0: x, 1: y }: number[] = coords;

        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const newX = x + dx;
                const newY = y + dy;

                if (dx === 0 && dy === 0) continue;

                surroundingCoordinates.add(`${newX},${newY}`);
            }
        }
    });

    shipCoordinates.forEach((coords) => {
        const coordinates = coords.join(',');

        surroundingCoordinates.delete(coordinates);
    });

    return Array.from(surroundingCoordinates).map((coords) => coords.split(',').map((value) => +value));
};

export const generateCoordinates = (board: Map<string, boolean>): Position => {
    let x: number;
    let y: number;

    do {
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * 10);
    } while (board.get(`${x}-${y}`));

    return { x, y };
};
