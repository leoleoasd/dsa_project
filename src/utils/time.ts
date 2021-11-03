import * as moment from 'moment';

export function parseTime(time: string): moment.Moment {
  const rule = /^(\d\d):(\d\d)$/;
  const result = rule.exec(time);
  if (!result) {
    throw new Error('Wrong time format!');
  }
  if (result.length != 3) {
    throw new Error('Wrong time format!');
  }
  const hour = parseInt(result[1]);
  const minute = parseInt(result[2]);
  return moment(new Date(1970, 0, 1, hour, minute, 0));
}

// console.log(parseTime('28:34').toLocaleString());
