import { swap } from "@/helpers";
import Line from "./Line";
import Point from "./Point";

export default class LineSegment extends Line {
    #end: Point;

    constructor(start: Point, end: Point) {
        const diff = Point.compare(start, end);

        if (diff > 0) {
            [start, end] = swap(start, end);
        } else if (diff === 0) {
            throw new Error("start and end are the same");
        }

        super(start, end.getDifference(start));
        this.#end = end;
    }
}