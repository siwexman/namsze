import TimeBox from './TimeBox';

export default function DayHours({ data, dayOfWeek }) {
    const filteredData = data.filter(el => {
        if (el.day) {
            return el.day === dayOfWeek;
        } else if (el.dayOfWeek >= 0) {
            el.time = `${el.startTime} - ${el.endTime}`;
            if (el.dayOfWeek === 0 && dayOfWeek === 'sunday') {
                return true;
            } else if (el.dayOfWeek > 0 && dayOfWeek === 'weekday') {
                return true;
            }
        }
    });

    return filteredData.map(el => <TimeBox key={el._id} text={el.time} />);
}
