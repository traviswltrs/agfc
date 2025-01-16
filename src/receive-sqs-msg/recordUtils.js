const parseValue = (value) => {
  return value?.S || value?.N || value?.BOOL || value?.L || value?.M || null;
};

module.exports = { parseValue };