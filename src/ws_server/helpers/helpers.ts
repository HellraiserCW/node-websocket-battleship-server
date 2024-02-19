import { ClientRequest } from '../models/app.model';
import { RequestTypes } from '../config/app.config';

let userId: number = 0;

export const getUserId = (): number => userId++;

export const generateResponseDto = (type: RequestTypes, data: string) => {
    const responseMessage: ClientRequest = { type, data, id: 0 };

    return JSON.stringify(responseMessage);
};
