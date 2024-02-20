import { RegServerData, RegUserData } from '../models/app.model';
import { RequestTypes, socketDatabase, userDatabase } from '../config/app.config';
import { User, UserClass } from '../models/user.model';
import { createResponseJson } from '../helpers/helpers';
import { updateRoom } from './update-room.controller';
import { updateWinners } from './update-winners.controller';

export const reg = (userId: number, data: string): void => {
    const { name, password }: RegUserData = JSON.parse(data);
    const users: User[] = Array.from(userDatabase.values());
    const isUsernameExists: boolean = users.some((user) => user.name === name);
    const newUser: UserClass = new UserClass(userId, name, password);

    userDatabase.set(userId, newUser);

    const userData: RegServerData = {
        name: newUser.name,
        index: newUser.index,
        error: isUsernameExists,
        errorText: isUsernameExists ? 'User already logged in!' : '',
    };
    const response: string = createResponseJson(RequestTypes.Reg, JSON.stringify(userData));

    socketDatabase[userId].send(response);

    !isUsernameExists && updateRoom();
    !isUsernameExists && updateWinners();
};
