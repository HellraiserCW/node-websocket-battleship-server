import WebSocket from 'ws';

import { createResponseJson } from '../helpers/helpers';
import { RequestTypes, socketDatabase, userDatabase } from '../config/app.config';
import { User } from '../models/user.model';
import { UpdateWinners } from '../models/app.model';

export const updateWinners = (): void => {
    const users: User[] = Array.from(userDatabase.values());
    const winners: UpdateWinners[] = users
        .filter((user: User): boolean => user.wins > 0)
        .map(({ name, wins }: User): UpdateWinners => ({ name, wins }));
    const response: string = createResponseJson(RequestTypes.UpdateWinners, JSON.stringify(winners));

    Object.keys(socketDatabase).forEach((id) => {
        const socket: WebSocket = socketDatabase[id];

        socket.send(response);
    });
};
