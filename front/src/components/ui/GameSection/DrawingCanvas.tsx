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
import {MouseEventHandler, useEffect, useRef, useState} from "react";
import {COLOR} from "@assets/styles/color.css";
// @ts-ignore
import {addCanvasStream} from "@utils/webRTCHandler";

const DEFAULT_LINE_WIDTH = 5

const DrawingCanvas = () => {
    const wrapRef = useRef<HTMLDivElement | null>(null)
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [drawColor, setDrawColor] = useState(COLOR.drawColor.black)
    const [width, setWidth] = useState(0)
    const [height, setHeight] = useState(0)


    const onChangeColor = (newColor: string) => {
        const ctx = canvasRef.current!.getContext('2d')
        if (!ctx) return;
        ctx.strokeStyle = newColor
        setCtx(ctx)
        setDrawColor(newColor)
    }

    const onChangeLineWidth = (lineWidth: number) => {
        const ctx = canvasRef.current!.getContext('2d')
        if (!ctx) return;
        ctx.lineWidth = lineWidth
        setCtx(ctx)
    }

    const startDrawing = () => {
        setIsDrawing(true)
    }

    const endDrawing = () => {
        setIsDrawing(false)
    }

    const drawing: MouseEventHandler<HTMLCanvasElement> = ({nativeEvent}) => {
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
        const ctx = canvasRef.current!.getContext('2d')
        if (!ctx) return;
        ctx.strokeStyle = COLOR.drawColor.white
        setCtx(ctx)
        setDrawColor(COLOR.drawColor.white)
    }

    const resetCanvas = () => {
        const ctx = canvasRef.current!.getContext('2d')
        if (!ctx) return;
        ctx.fillStyle = COLOR.drawColor.white
        ctx.fillRect(0,0, width, height)
    }

    useEffect(() => {
        const canvas = canvasRef.current
        const wrap = wrapRef.current

        if (!canvas || !wrap) return;
        resetCanvas()
        const width = wrap.offsetWidth
        const height = wrap.offsetHeight - 60
        setWidth(width)
        setHeight(height)

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) return;
        ctx.lineWidth = 5
        ctx.strokeStyle = '#000000'
        ctx.fillStyle = COLOR.drawColor.white
        ctx.fillRect(0,0, width, height)
        setCtx(ctx)
        addCanvasStream(canvas.captureStream(25))

    }, [])

    return (
        <VStack id={'canvasWrap'} border={`2px solid ${COLOR.lightGray}`} p={2} borderRadius={'xl'} ref={wrapRef} h={'100%'} width={'100%'} >
            <canvas
                id={'drawingCanvas'}
                style={{
                    border: '2px solid black',
                    height: '100%;',
                    width: '100%;'
                }}
            ref={canvasRef}
                onMouseDown={startDrawing} onMouseLeave={endDrawing} onMouseUp={endDrawing}
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

export default DrawingCanvas