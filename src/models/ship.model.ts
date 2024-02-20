type ShipType = 'small' | 'medium' | 'large' | 'huge';

export type ShipStatus = 'killed' | 'shot';

export interface Position {
    x: number;
    y: number;
}

export interface ShipInfo {
    position: Position;
    direction: boolean;
    length: number;
    type: ShipType;
}

export interface Ship extends ShipInfo {
    shipPosition: Map<string, boolean>;
    getShipStatus(): ShipStatus;
}

export class ShipClass implements Ship {
    constructor(
        public position: Position,
        public direction: boolean,
        public length: number,
        public type: ShipType,
        public shipPosition: Map<string, boolean> = new Map<string, boolean>()
    ) {
        this.shipPosition = this.generateShip();
    }

    getShipStatus(): ShipStatus {
        const positionValues: boolean[] = Array.from(this.shipPosition.values());

        return positionValues.every((value) => value)
            ? 'killed'
            : 'shot';
    }

    private generateShip(): Map<string, boolean> {
        const map: Map<string, boolean> = new Map<string, boolean>();

        for (let i = 0; i < this.length; i += 1) {
            map.set(
                this.direction
                    ? `${this.position.x}-${this.position.y + i}`
                    : `${this.position.x + i}-${this.position.y}`,
                false
            );
        }

        return map;
    }
}
