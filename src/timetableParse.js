import {addMinutes, getDay, getHours, getMinutes} from 'date-fns'

const weekMap = {
    "sun": 0,
    "mon": 1,
    "tue": 2,
    "wed": 3,
    "thu": 4,
    "fri": 5,
    "sat": 6
};

const MAX_WEEK_MIN = 24 * 60 * 7;

export default function (timetable, timetableUtcOffset, localUtcOffset) {
    const utcShift = +localUtcOffset - +timetableUtcOffset;

    const today = addMinutes(new Date(), utcShift);
    const todayWeekday = getDay(today);

    let currentMinutes = todayWeekday * 24 * 60 + getHours(today) * 60 + getMinutes(today);

    Object.keys(timetable).forEach(key => {
        timetable[weekMap[key]] = timetable[key];
        delete timetable[key];
    });


    Object.keys(timetable).forEach(key => {
        const currentTT = timetable[key];

        timetable[key].allDayWork = currentTT.open_time === currentTT.close_time && currentTT.break_open_time === currentTT.break_close_time;
        timetable[key].hasBreak = currentTT.break_open_time !== currentTT.break_close_time;
        timetable[key].allDayWorkWithBreak = currentTT.open_time === currentTT.close_time && currentTT.break_open_time !== currentTT.break_close_time;

        timetable[key].long = currentTT.close_time <= currentTT.open_time;

        timetable[key].breaks = [currentTT.open_time, currentTT.close_time, currentTT.break_open_time, currentTT.break_close_time].sort((a, b) => a - b)
    });

    const sortedKeys = Object.keys(timetable).sort((a, b) => a - b);

    let breakers = [];

    sortedKeys.forEach(key => {
        key = +key;
        const currentTimetable = timetable[key];
        const nextKey = (key + 1);

        breakers.push(key * 24 * 60 + currentTimetable.open_time);

        if (currentTimetable.hasBreak) {
            breakers.push(key * 24 * 60 + currentTimetable.break_open_time);
            breakers.push(key * 24 * 60 + currentTimetable.break_close_time);
        }

        if (currentTimetable.long) {
            breakers.push((nextKey * 24 * 60 + currentTimetable.close_time) % MAX_WEEK_MIN);
        } else {
            breakers.push(key * 24 * 60 + currentTimetable.close_time);
        }
    });

    let chunkedBreakers = [];

    for (let i = 0, j = breakers.length; i < j; i += 2) {
        chunkedBreakers.push(breakers.slice(i, i + 2));
    }

    const workingChunkIndex = chunkedBreakers.findIndex((chunk) => {
        return currentMinutes > chunk[0] && currentMinutes < chunk[1];
    });


    let isOpened;
    let nextChangeDate;

    if (workingChunkIndex > 0) {
        isOpened = true;

        let breakIndex;
        for (let i = workingChunkIndex; i <= workingChunkIndex + 8; i++) {
            const mod = chunkedBreakers.length;

            if (chunkedBreakers[i % mod][1] !== chunkedBreakers[(i + 1) % mod][0]) {
                breakIndex = i % mod;
                break;
            }
        }

        if (breakIndex) {
            nextChangeDate = chunkedBreakers[breakIndex][1];
        }
    } else {
        isOpened = false;

        nextChangeDate = chunkedBreakers.find((chunk) => {
            return chunk[0] > currentMinutes;
        })[0];
    }

    let diff;
    if (nextChangeDate) {
        diff = nextChangeDate - currentMinutes;

        if (diff < 0) {
            diff += MAX_WEEK_MIN;
        }

        nextChangeDate = addMinutes(today, diff + utcShift);
    }

    return {
        isOpened,
        nextChangeDate,
        needShow: nextChangeDate ? (!isOpened || diff < 24 * 60) : false
    }
}
