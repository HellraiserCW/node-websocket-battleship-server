import { RequestTypes, socketDatabase } from '../config/app.config';
import { Game } from '../models/game.model';
import { createResponseJson } from '../helpers/helpers';
import { attack } from './attack.controller';

export const turn = (game: Game): void => {
    const response: string = createResponseJson(RequestTypes.Turn, JSON.stringify({ currentPlayer: game.turn }));

    game.players.forEach((indexPlayer) => {
        if (indexPlayer in socketDatabase) {
            socketDatabase[indexPlayer].send(response);
        }
    });

    if (game.turn === 'computer') {
        attack(game.turn, JSON.stringify({
            gameId: game.gameId,
            indexPlayer: game.turn
        }));
    }
};
