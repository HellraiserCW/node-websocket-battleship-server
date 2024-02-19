import WebSocket from 'ws';

import { generateResponseDto } from '../helpers/helpers';
import { RequestTypes, socketDatabase, userDatabase } from '../config/app.config';
import { User } from '../models/user.model';
import { UpdateWinnersServerData } from '../models/app.model';

export const updateWinners = (): void => {
    const users: User[] = Array.from(userDatabase.values());
    const winners: UpdateWinnersServerData[] = users
        .filter((user: User): boolean => user.wins > 0)
        .map(({ name, wins }: User): UpdateWinnersServerData => ({ name, wins }));
    const response: string = generateResponseDto(RequestTypes.UpdateWinners, JSON.stringify(winners));

    Object.keys(socketDatabase).forEach((id) => {
        const socket: WebSocket = socketDatabase[id];

        socket.send(response);
    });
};
