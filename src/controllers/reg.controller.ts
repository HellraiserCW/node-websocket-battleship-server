import { Reg } from '../models/app.model';
import { RequestTypes, socketDatabase, userDatabase } from '../config/app.config';
import { UserClass } from '../models/user.model';
import { createResponseJson, isWrongPassword } from '../helpers/helpers';
import { updateRoom } from './update-room.controller';
import { updateWinners } from './update-winners.controller';

export const reg = (userId: string, data: string): void => {
    const { name, password }: Reg = JSON.parse(data);
    const wrongPassword: boolean = isWrongPassword(name, password);
    const newUser: UserClass = new UserClass(userId, name, password);

    userDatabase.set(userId, newUser);

    const response: string = createResponseJson(RequestTypes.Reg, JSON.stringify({
        name: newUser.name,
        index: newUser.index,
        error: wrongPassword,
        errorText: wrongPassword ? 'Password incorrect!' : ''
    }));

    socketDatabase[userId].send(response);
    updateRoom();
    updateWinners();
};
