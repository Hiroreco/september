import { useEffect } from "react";
import useCountdown from "./useCountdown";

const CountdownItem = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col bg-white rounded-lg border md:w-24 w-20">
        <span className="text-center font-bold p-2 text-4xl">{value}</span>
        <span className="bg-orange-300 md:text-xl text-center rounded-b-lg px-2 py-1">
            {label}
        </span>
    </div>
);
interface CountdownTimerProps {
    targetDate: Date;
    onZero?: () => void;
}

const CountdownTimer = ({ targetDate, onZero }: CountdownTimerProps) => {
    const { days, hours, minutes, seconds } = useCountdown(targetDate);

    useEffect(() => {
        if (
            days === 0 &&
            hours === 0 &&
            minutes === 0 &&
            seconds === 0 &&
            onZero
        ) {
            onZero();
        }
    }, [days, hours, minutes, seconds, onZero]);

    return (
        <div className="flex gap-2 items-center z-10">
            <CountdownItem value={days} label="Days" />
            <CountdownItem value={hours} label="Hours" />
            <CountdownItem value={minutes} label="Minutes" />
            <CountdownItem value={seconds} label="Seconds" />
        </div>
    );
};

export default CountdownTimer;
