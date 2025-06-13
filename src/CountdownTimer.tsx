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
}

const CountdownTimer = ({ targetDate }: CountdownTimerProps) => {
    const { days, hours, minutes, seconds } = useCountdown(targetDate);
    console.log(
        `Countdown to ${targetDate.toLocaleString()}: ${days} Days, ${hours} Hours, ${minutes} Minutes, ${seconds} Seconds`
    );
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
