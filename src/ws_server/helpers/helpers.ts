import { ClientRequest } from '../models/app.model';
import { RequestTypes } from '../config/app.config';

let userId: number = 1;

export const getUserId = (): number => userId++;

export const createResponseJson = (type: RequestTypes, data: string) => {
    const responseMessage: ClientRequest = {
        type,
        data,
        id: 0
    };

    return JSON.stringify(responseMessage);
};
