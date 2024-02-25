import { Reg } from '../models/app.model';
import { RequestTypes, socketDatabase } from '../config/app.config';
import { UserClass } from '../models/user.model';
import { createResponseJson } from '../helpers/helpers';
import { updateRoom } from './update-room.controller';
import { updateWinners } from './update-winners.controller';
import { createNewUser, isWrongPassword } from '../services/reg.service';

export const reg = (userId: string, data: string): void => {
    const { name, password }: Reg = JSON.parse(data);
    const wrongPassword: boolean = isWrongPassword(name, password);
    const user: UserClass = createNewUser(userId, name, password);

    const response: string = createResponseJson(RequestTypes.Reg, JSON.stringify({
        name: user.name,
        index: user.index,
        error: wrongPassword,
        errorText: wrongPassword ? 'Password incorrect!' : ''
    }));

    socketDatabase[userId].send(response);

    updateRoom();
    updateWinners();
};
