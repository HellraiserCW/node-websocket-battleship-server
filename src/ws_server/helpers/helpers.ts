import { ClientRequest } from '../models/app.model';
import { RequestTypes, userDatabase } from '../config/app.config';
import { User } from '../models/user.model';

let userId: number = 1;

export const getUserId = (): number => userId++;

export const isWrongPassword = (name: string, password: string): boolean => {
    const users: User[] = Array.from(userDatabase.values());
    const user: User | undefined = users.find((user) => user.name === name);

    return !!(user && user.password !== password);
};

export const createResponseJson = (type: RequestTypes, data: string) => {
    const responseMessage: ClientRequest = {
        type,
        data,
        id: 0
    };

    return JSON.stringify(responseMessage);
};

export const getSurroundingCoordinates = (shipCoordinates: number[][]): number[][] => {
    const surroundingCoordinates: Set<string> = new Set();

    shipCoordinates.forEach((coords) => {
        const [x, y]: number[] = coords;

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
