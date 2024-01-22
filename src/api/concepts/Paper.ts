import Crease from "./Crease";
import Edge from "./Edge";
import LineSegment from "./LineSegment";
import Point from "./Point";

export default class Paper {
    #points: Point[];
    #lines: LineSegment[];

    constructor() {
        const topLeft: Point = new Point(0, 1);
        const bottomLeft: Point = new Point(0, 0);
        const topRight: Point = new Point(1, 1);
        const bottomRight: Point = new Point(1, 0);

        this.#points = [topLeft, bottomLeft, topRight, bottomRight];
        this.#lines = [
            new Edge(topLeft, topRight),
            new Edge(topLeft, bottomLeft),
            new Edge(bottomLeft, bottomRight),
            new Edge(topRight, bottomRight)
        ]
    }
}