import Dayjs from 'dayjs';
import dayjsDuration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';

Dayjs.extend(utc);
Dayjs.extend(dayjsDuration);

export const dayjs = Dayjs;
