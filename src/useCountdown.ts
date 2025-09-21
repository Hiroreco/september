import { useEffect, useState } from "react";

const useCountdown = (targetDate: Date) => {
    const calculateTimeLeft = () => {
        const now = new Date();
        const difference = targetDate.getTime() - now.getTime();

        let timeLeft: {
            days: number;
            hours: number;
            minutes: number;
            seconds: number;
        };
        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor(
                    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                ),
                minutes: Math.floor(
                    (difference % (1000 * 60 * 60)) / (1000 * 60)
                ),
                seconds: Math.floor((difference % (1000 * 60)) / 1000),
            };
        } else {
            timeLeft = {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    };

    return timeLeft;
};

export default useCountdown;
