import { gameDatabase } from '../config/app.config';
import { Game, GameClass } from '../models/game.model';

export const createSinglePlayGame = (userId: string): Game => {
    const game: GameClass = new GameClass();

    game.addPlayer(userId);
    game.addPlayer('computer')

    gameDatabase.set(game.gameId, game);

    return game;
};
