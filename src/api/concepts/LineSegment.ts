import Line from "./Line";
import Point from "./Point";

export default class LineSegment extends Line {
    #end: Point;

    constructor(start: Point, end: Point) {
        super(start, end.getDifference(start));
        this.#end = end;
    }
}