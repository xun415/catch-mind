import {
    Box,
    Button,
    Circle,
    HStack,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
    VStack
} from "@chakra-ui/react";
import {useEffect, useRef, useState} from "react";
import {COLOR} from "@assets/styles/color.css";
import {setCanvasStream} from "../../../utils/webRTCHandler";
import {css} from "@emotion/react";

const DEFAULT_LINE_WIDTH = 5

const DrawingArea = () => {
    // @ts-ignore
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [drawColor, setDrawColor] = useState(COLOR.drawColor.black)


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
        ctx.strokeStyle = COLOR.drawColor.white
        setCtx(ctx)
        setDrawColor(COLOR.drawColor.white)
    }

    const resetCanvas = () => {
        const ctx = canvasRef.current.getContext('2d')
        ctx.fillStyle = COLOR.drawColor.white
        ctx.fillRect(0,0,800, 800)
    }

    useEffect(() => {
        const canvas = canvasRef.current
        canvas.width = 800
        canvas.height = 800

        const ctx = canvas.getContext('2d')
        ctx.lineWidth = 5
        ctx.strokeStyle = '#000000'
        ctx.fillStyle = COLOR.drawColor.white
        ctx.fillRect(0,0,800, 800)
        setCtx(ctx)
        setCanvasStream(canvas.captureStream(25))

        return () => {
            resetCanvas()
        }
    }, [])

    return (
        <VStack border={'2px solid black'} p={2} borderRadius={20}>
            <canvas
                css={css`
                    border: 2px solid black;
               `}
                ref={canvasRef} onMouseDown={startDrawing} onMouseLeave={endDrawing} onMouseUp={endDrawing}
                onMouseMove={drawing}
            />
            {/* 색 선택, 선 굵기, 지우개, 전체 지우기 */}
            <HStack >
                {/* 색 선택 */}
                <input type="color" onChange={event => onChangeColor(event.target.value)} value={drawColor}/>
                <Circle bg={COLOR.drawColor.black} size={8} onClick={() => onChangeColor(COLOR.drawColor.black)}></Circle>
                <Circle bg={COLOR.drawColor.red} size={8} onClick={() => onChangeColor(COLOR.drawColor.red)}></Circle>
                <Circle bg={COLOR.drawColor.blue} size={8} onClick={() => onChangeColor(COLOR.drawColor.blue)}></Circle>

                {/* 선 굵기 */}
                <Box border={'1px solid #E9EBEC'} w={'200px'} p={1} borderRadius={6}>
                    <Slider
                        min={0}
                        max={10}
                        aria-label='선 굵기' defaultValue={DEFAULT_LINE_WIDTH} onChange={value => onChangeLineWidth(Number(value))}>
                        <SliderTrack>
                            <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb />
                    </Slider>
                </Box>

                <Button onClick={onClickErase} colorScheme={'blue'}>지우개</Button>
                <Button onClick={resetCanvas} colorScheme={'red'}>전체 지우기</Button>
            </HStack>
        </VStack>
    )
}

export default DrawingArea