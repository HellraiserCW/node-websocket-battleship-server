import { User } from '../models/user.model';
import { userDatabase } from '../config/app.config';
import { Winners } from '../models/app.model';

export const getExistingWinners = (): Winners[] => {
    const users: User[] = Array.from(userDatabase.values());

    return users
        .filter((user: User): boolean => user.wins > 0)
        .map(({ name, wins }: User): Winners => ({ name, wins }));
};
