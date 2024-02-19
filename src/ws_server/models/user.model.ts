export interface User {
    index: number;
    name: string;
    password: string;
    wins: number;
}

export class UserImpl implements User {
    wins: number;

    constructor(
        public index: number,
        public name: string,
        public password: string,
    ) {
        this.wins = 0;
    }
}
