const util = require('util');

module.exports = {
  log: (data) => console.log(`\n\n${util.inspect(data)}\n\n`),
};
