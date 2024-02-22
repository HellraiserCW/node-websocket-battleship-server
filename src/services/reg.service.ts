import { User, UserClass } from '../models/user.model';
import { userDatabase } from '../config/app.config';

export const isWrongPassword = (name: string, password: string): boolean => {
    const users: User[] = Array.from(userDatabase.values());
    const user: User | undefined = users.find((user) => user.name === name);

    return !!(user && user.password !== password);
};

export const createNewUser = (userId: string, name: string, password: string): UserClass => {
    const newUser: UserClass = new UserClass(userId, name, password);

    userDatabase.set(userId, newUser);

    return newUser;
};
