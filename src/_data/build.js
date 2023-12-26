const timestamp = new Date();

export default {
  env: process.env.NODE_ENV,
  timestamp: timestamp,
  id: timestamp.valueOf(),
};
