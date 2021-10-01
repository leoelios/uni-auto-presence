const UniaraService = require("../client/UniaraClient");

UniaraService.declareInterceptor();

module.exports = async () => {
  const { data, status } = await UniaraService.index();

  return undefined;
};
