import { swap } from "@/helpers";
import Line from "./Line";
import Point from "./Point";
import Vector from "./Vector";

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

    getEnd(): Point {
        return this.#end;
    }

    static compare(l1: LineSegment, l2: LineSegment) {
        const diffStart = Point.compare(l1.getStart(), l2.getStart());

        if (diffStart == 0) {
            return Point.compare(l1.getEnd(), l2.getEnd());
        } else {
            return diffStart;
        }
    }

    getIntersection(line: Line): Point | null {
        const a: Point = this.getStart();
        const v: Vector = this.getVector();
        const b: Point = line.getStart();
        const u: Vector = line.getVector();

        const det = v.getX() * u.getY() - v.getY() * u.getX();

        if (det != 0) {
            const s = (u.getX() * (a.getY() - b.getY()) - u.getY() * (a.getX() - b.getX())) / det;
        
            if (s == 0) {
                return a;
            } else if (s == 1) {
                return this.#end;
            } else if (Math.abs(s) < 1) {
                return a.getSum(v.getScaled(s));
            }
        }

        return null;
    } 
}