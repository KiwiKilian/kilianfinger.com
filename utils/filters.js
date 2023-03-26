const util = require('util');

module.exports = {
  log: (data) => console.log(`\n\n${util.inspect(data)}\n\n`),

  readableDate: (date) =>
    date.toLocaleString('en-US', {
      timeZone: 'UTC',
      dateStyle: 'long',
    }),
  htmlDate: (date) => date.toISOString().substring(0, 10),
};
