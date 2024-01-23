import Vector from "./Vector";

export default class Point extends Vector {
    static compare(p1: Point, p2: Point): number {
        const dx = p1.getX() - p2.getX();

        if (dx == 0) {
            return p1.getY() - p2.getY();
        } else {
            return dx;
        }
    }
}