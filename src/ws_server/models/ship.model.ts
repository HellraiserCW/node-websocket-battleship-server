type ShipType = 'small' | 'medium' | 'large' | 'huge';

type ShipStatus = 'killed' | 'shot';

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
    shipPositionMap: Map<string, boolean>;

    getStatus(): ShipStatus;
}

export class ShipClass implements Ship {
    position: { x: number; y: number };
    direction: boolean;
    length: number;
    type: ShipType;
    shipPositionMap: Map<string, boolean>;

    constructor({ position, direction, length, type }: ShipInfo) {
        this.position = position;
        this.direction = direction;
        this.length = length;
        this.type = type;
        this.shipPositionMap = this.generateShip();
    }

    getStatus(): ShipStatus {
        const values: boolean[] = Array.from(this.shipPositionMap.values());

        return values.every((value) => value)
            ? 'killed'
            : 'shot';
    }

    private generateShip(): Map<string, boolean> {
        const map: Map<string, boolean> = new Map<string, boolean>();

        for (let i = 0; i < this.length; i += 1) {
            // this.direction
            //     ? map.set(`${this.position.x}-${this.position.y + i}`, false)
            //     : map.set(`${this.position.x + i}-${this.position.y}`, false);
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
