import Point from "./Point";
import Vector from "./Vector";

export default class Line {
    #start: Point;
    #vector: Vector;

    constructor(start: Point, vector: Vector) {
        this.#start = start;
        this.#vector = vector;
    }
}