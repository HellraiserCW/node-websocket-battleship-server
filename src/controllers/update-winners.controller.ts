import { createResponseJson } from '../helpers/helpers';
import { RequestTypes, socketDatabase } from '../config/app.config';
import { Winners } from '../models/app.model';
import { getExistingWinners } from '../services/update-winners.service';

export const updateWinners = (): void => {
    const winners: Winners[] = getExistingWinners();
    const response: string = createResponseJson(RequestTypes.UpdateWinners, JSON.stringify(winners));

    Object.keys(socketDatabase).forEach((id) => {
        socketDatabase[id].send(response);
    });
};
