export default class Vector {
    #x: number;
    #y: number;

    constructor(x: number, y: number) {
        this.#x = x;
        this.#y = y;
    }

    getX(): number {
        return this.#x;
    }

    getY(): number {
        return this.#y;
    }

    toOrthogonal(): void {
        const temp = this.#y;
        this.#y = this.#x;
        this.#x = temp;
    }

    getMagnitude() {
        return Math.sqrt(Math.pow(this.#x, 2) + Math.pow(this.#y, 2));
    }

    toScaled(c: number) {
        this.#x *= c;
        this.#y *= c;
    }

    getScaled(c: number): Vector {
        const copy: Vector = this.getCopy();
        copy.toScaled(c);

        return copy;
    }

    getCopy(): Vector {
        return new Vector(this.#x, this.#y);
    }

    toSum(other: Vector): void {
        if (other == null) {
            throw new Error("Vector is null");
        }

        this.#x += other.getX();
        this.#y += other.getY();
    }

    getSum(other: Vector): Vector {
        const copy: Vector = this.getCopy();
        copy.toSum(other);

        return copy;
    }
}