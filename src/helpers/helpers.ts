import { v4 as uuidv4 } from 'uuid';

import { ClientRequest } from '../models/app.model';
import { RequestTypes } from '../config/app.config';

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

export const createResponseJson = (type: RequestTypes, data: string) => {
    const response: string = JSON.stringify({
        type,
        data,
        id: 0
    });

    console.log(`Outgoing response: ${type}`);

    return response;
};
