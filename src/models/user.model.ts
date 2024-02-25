export interface User {
    index: string;
    name: string;
    password: string;
    wins: number;
}

export class UserClass implements User {
    constructor(
        public index: string,
        public name: string,
        public password: string,
        public wins: number = 0
    ) {}
}
