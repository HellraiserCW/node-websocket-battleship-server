import { RequestTypes, socketDatabase } from '../config/app.config';
import { Game } from '../models/game.model';
import { createResponseJson } from '../helpers/helpers';

export const turn = (game: Game): void => {
    const response = createResponseJson(RequestTypes.Turn, JSON.stringify({ currentPlayer: game.turn }));

    game.players.forEach((indexPlayer) => {
        if (indexPlayer in socketDatabase) {
            socketDatabase[indexPlayer].send(response);
        }
    });
};
