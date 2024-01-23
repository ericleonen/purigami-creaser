"use client"

import { useEffect, useRef, useState } from "react"
import Point from "../concepts/Point";
import LineSegment from "../concepts/LineSegment";
import Edge from "../concepts/Edge";

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
    mousePos: [number, number] | undefined 
) {
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);

    for (const line of lines) {
        drawLine(context, line);
    }

    for (const point of points) {
        drawPoint(context, point, mousePos);
    }
}

function euclideanDistance(a: [number, number], b: [number, number]) {
    return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
}

function drawPoint(
    context: CanvasRenderingContext2D, 
    point: Point,
    mousePos: [number, number] | undefined,
    color: string = "#000", 
    hoverColor: string = "#FF0000",
    radius: number = 10,
    hoverRadius: number = 15,
) {
    const coord = point2Coordinate(point);
    const hovered = mousePos && euclideanDistance(mousePos, coord) <= hoverRadius;

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
    context.strokeStyle = color;
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

    useEffect(() => {
        render(canvasRef.current, points, lines, mousePos);
    }, [points, lines, render, JSON.stringify(mousePos)]);

    return (
        <canvas
            ref={canvasRef}
            width={CANVAS_SIZE_PIXELS}
            height={CANVAS_SIZE_PIXELS}
            onMouseMove={handleMouseMove}
            onMouseOut={() => setMousePos(undefined)}
            className="h-[500px] w-[500px] border-2"
        />
    )
}