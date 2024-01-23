"use client"

import { useEffect, useRef, useState } from "react"
import Point from "../concepts/Point";
import LineSegment from "../concepts/LineSegment";
import Edge from "../concepts/Edge";
import Vector from "../concepts/Vector";
import Line from "../concepts/Line";
import Crease from "../concepts/Crease";

const topLeft: Point = new Point(0, 1);
const bottomLeft: Point = new Point(0, 0);
const topRight: Point = new Point(1, 1);
const bottomRight: Point = new Point(1, 0);

const CANVAS_SIZE_PIXELS = 1000;
const PAPER_SIZE_PERCENT = 0.9;

function render(
    canvas: HTMLCanvasElement | null, 
    points: Point[], 
    lines: LineSegment[],
    mousePos: [number, number] | undefined,
    selectedStart: Point | undefined
) {
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);

    for (const line of lines) {
        drawLine(context, line);
    }

    for (const point of points) {
        drawPoint(context, point, mousePos, selectedStart);
    }
}

function euclideanDistance(a: [number, number], b: [number, number]) {
    return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
}

function drawPoint(
    context: CanvasRenderingContext2D, 
    point: Point,
    mousePos: [number, number] | undefined,
    selectedStart: Point | undefined,
    color: string = "#000", 
    hoverColor: string = "#FF0000",
    radius: number = 10,
    hoverRadius: number = 15,
) {
    const coord = point2Coordinate(point);
    const hovered = (selectedStart && Point.compare(selectedStart, point) === 0) || 
        (mousePos && euclideanDistance(mousePos, coord) <= hoverRadius);

    context.beginPath();
    context.fillStyle = hovered ? hoverColor : color;
    context.arc(...coord, hovered ? hoverRadius : radius, 0, 2 * Math.PI);
    context.fill();
}

function drawLine(
    context: CanvasRenderingContext2D,
    line: LineSegment,
    color: string = "#000",
    size: number = 5
) {
    context.beginPath();
    context.lineWidth = size;
    context.strokeStyle = line instanceof Crease ? "#808080" : color;
    context.moveTo(...point2Coordinate(line.getStart()));
    context.lineTo(...point2Coordinate(line.getEnd()));
    context.stroke();
}

function point2Coordinate(point: Point): [number, number] {
    const scaler = CANVAS_SIZE_PIXELS * PAPER_SIZE_PERCENT;
    const offset = CANVAS_SIZE_PIXELS * (1 - PAPER_SIZE_PERCENT) / 2;

    return [
        point.getX() * scaler + offset,
        (1 - point.getY()) * scaler + offset 
    ]
}

function crease(p1: Point, p2: Point, points: Point[], lines: LineSegment[]): [Point[], LineSegment[]] {
    const avg = p1.getSum(p2);
    avg.toScaled(0.5);

    const v: Vector = p2.getDifference(p1);
    v.toOrthogonal();

    const infLine = new Line(avg, v);
    const endpoints: Set<Point> = new Set();
    const newPoints: Set<Point> = new Set();

    for (const line of lines) {
        const intersection = line.getIntersection(infLine);

        if (intersection) {
            if (line instanceof Edge) {
                endpoints.add(intersection);
            }

            if (!points.some((point: Point) => Point.compare(point, intersection) === 0)) {
                newPoints.add(intersection);
            }
        }
    }

    if (endpoints.size !== 2) {
        throw new Error();
    }

    let e1: Point | undefined = undefined;
    let e2: Point | undefined = undefined;

    for (const e of endpoints) {
        if (!e1) e1 = e;
        else e2 = e;
    }

    if (!e1 || !e2) {
        throw new Error();
    }

    return [
        [...points, ...newPoints],
        [...lines, new Crease(e1, e2)]
    ]
}

export default function Paper() {
    const [points, setPoints] = useState<Point[]>([topLeft, bottomLeft, topRight, bottomRight]);
    const [lines, setLines] = useState<LineSegment[]>([
        new Edge(topLeft, topRight),
        new Edge(topLeft, bottomLeft),
        new Edge(bottomLeft, bottomRight),
        new Edge(topRight, bottomRight)
    ]);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [mousePos, setMousePos] = useState<[number, number]>();
    const [selectedStart, setSelectedStart] = useState<Point>();

    const handleMouseMove = (e: React.MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        setMousePos([
            (e.clientX - rect.left) * scaleX,
            (e.clientY - rect.top) * scaleY
        ]);
    }

    const handleClick = () => {
        if (!mousePos) return;
        let selected: Point | undefined = undefined;

        for (const point of points) {
            if (euclideanDistance(point2Coordinate(point), mousePos) <= 15) {
                selected = point;
            }
        }

        if (!selected) return;

        if (!selectedStart) setSelectedStart(selected);
        else {
            // make crease
            setSelectedStart(undefined);
            const [newPoints, newLines] = crease(selectedStart, selected, points, lines);

            setPoints(newPoints);
            setLines(newLines);
        }

    }

    useEffect(() => {
        render(canvasRef.current, points, lines, mousePos, selectedStart);
    }, [points, lines, render, JSON.stringify(mousePos), selectedStart]);

    return (
        <canvas
            ref={canvasRef}
            width={CANVAS_SIZE_PIXELS}
            height={CANVAS_SIZE_PIXELS}
            onClick={handleClick}
            onMouseMove={handleMouseMove}
            onMouseOut={() => setMousePos(undefined)}
            className="h-[500px] w-[500px] border-2"
        />
    )
}