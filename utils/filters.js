import util from 'util';

export function log(data) {
  return console.log(`\n\n${util.inspect(data)}\n\n`);
}

export function readableDate(date) {
  return date.toLocaleString('en-US', {
    timeZone: 'UTC',
    dateStyle: 'long',
  });
}

export function htmlDate(date) {
  return date.toISOString().substring(0, 10);
}
