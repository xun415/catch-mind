import {Box, Circle, HStack, VStack} from "@chakra-ui/react";
import {useEffect, useRef, useState} from "react";
import {color} from "../../../constant/color";
import {setCanvasStream} from "../../../utils/webRTCHandler";

const DrawingArea = () => {
    // @ts-ignore
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [drawColor, setDrawColor] = useState(color.검정)


    const onChangeColor = (newColor: string) => {
        const ctx = canvasRef.current.getContext('2d')
        ctx.strokeStyle = newColor
        setCtx(ctx)
        setDrawColor(newColor)
    }

    const onChangeLineWidth = (lineWidth: number) => {
        const ctx = canvasRef.current.getContext('2d')
        ctx.lineWidth = lineWidth
        setCtx(ctx)
    }

    const startDrawing = () => {
        setIsDrawing(true)
    }

    const endDrawing = () => {
        setIsDrawing(false)
    }

    const drawing = ({nativeEvent}) => {
        const {offsetX, offsetY} = nativeEvent

        if (!ctx) {
            return
        }
        if (isDrawing) {
            ctx.lineTo(offsetX, offsetY)
            ctx.stroke()
        } else {
            ctx.beginPath()
            ctx.moveTo(offsetX, offsetY)
        }
    }

    const onClickErase = () => {
        const ctx = canvasRef.current.getContext('2d')
        ctx.strokeStyle = color.흰색
        setCtx(ctx)
    }

    const onClickReset = () => {
        const ctx = canvasRef.current.getContext('2d')
        ctx.fillStyle = color.흰색
        ctx.fillRect(0,0,800, 800)
    }

    useEffect(() => {
        const canvas = canvasRef.current
        canvas.width = 800
        canvas.height = 800

        const ctx = canvas.getContext('2d')
        ctx.lineWidth = 5
        ctx.strokeStyle = '#000000'
        ctx.fillStyle = color.흰색
        ctx.fillRect(0,0,800, 800)
        setCtx(ctx)
        setCanvasStream(canvas.captureStream(25))
    }, [])

    return (
        <VStack>
            <canvas
                style={{
                    border: '1px solid black'
                }}
                ref={canvasRef}
                width={800} height={800} onMouseDown={startDrawing} onMouseLeave={endDrawing} onMouseUp={endDrawing}
                onMouseMove={drawing}
            ></canvas>
            {/* 색 선택, 선 굵기, 지우개, 전체 지우기 */}
            <HStack>
                {/* 색 선택 */}
                <input type="color" onChange={event => onChangeColor(event.target.value)} value={drawColor}/>
                <Circle onClick={() => onChangeColor(color.검정)}>검정</Circle>
                <Circle onClick={() => onChangeColor(color.빨강)}>빨강</Circle>
                <Circle onClick={() => onChangeColor(color.파랑)}>파랑</Circle>
                {/* 선 굵기 */}
                <input type="range" step={1} onChange={event => onChangeLineWidth(Number(event.target.value))}/>
                <Box onClick={onClickErase}>지우개</Box>
                <Box onClick={onClickReset}>전체 지우기</Box>
            </HStack>
        </VStack>
    )
}

export default DrawingArea