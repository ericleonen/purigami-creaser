"use client"

import { useRef } from "react"

export default function Paper() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    return (
        <canvas
            ref={canvasRef}
            width={1000}
            height={1000}
            className="h-[500px] w-[500px]"
        />
    )
}