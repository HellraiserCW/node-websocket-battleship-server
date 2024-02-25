import { roomDatabase } from '../config/app.config';
import { Room } from '../models/room.model';

export const getExistingRooms = (): Room[] => Array.from(roomDatabase.values());
