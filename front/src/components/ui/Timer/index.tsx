import {useEffect, useState} from "react";
import {GAME_STATUS} from "../../../constant/game";

type Props = {
    initSeconds: number
    start?: boolean
}
const Timer = ({initSeconds, start = false}: Props) => {
    const [seconds, setSeconds] = useState(initSeconds)

    useEffect(() => {
        let intervalId;
            if (start) {
                intervalId = setInterval(() => {
                    // 1초마다 타이머를 감소
                    setSeconds((prevSeconds) => (prevSeconds > 0 ? prevSeconds - 1 : 0));
                }, 1000);
            }

        // 컴포넌트가 언마운트되면 타이머를 정리
        return () => clearInterval(intervalId);
    }, [start]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const remainingSeconds = time % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    return <div>{formatTime(seconds)}</div>
}

export default Timer