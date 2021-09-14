const UniaraService = require("../client/UniaraClient");

module.exports = async () => {
  const { data, status } = await UniaraService.index();

  return undefined;
};
