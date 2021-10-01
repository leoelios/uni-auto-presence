const UniaraService = require("../client/UniaraClient");
const { status: statuses } = require("../constants");

const MONTIOR_ACTION = "verifica-lista";
const REGISTER_ACTION = "gravar-presenca";

const PRESENCE_ALREADY_REGISTERED = "OK";

UniaraService.declareInterceptor();

async function markPresence() {
  const { data } = await UniaraService.managePresence({
    action: REGISTER_ACTION,
    random: Math.random(),
  });

  return {
    success: data === PRESENCE_ALREADY_REGISTERED,
  };
}

const setTimeoutAsync = (cb, delay) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(cb());
    }, delay);
  });

module.exports = async () => {
  const { data } = await UniaraService.managePresence({
    action: MONTIOR_ACTION,
    random: Math.random(),
  });

  if (data == PRESENCE_ALREADY_REGISTERED) {
    return {
      before: statuses.REGISTERED,
      after: statuses.REGISTERED,
    };
  } else if (data) {
    const { success } = await setTimeoutAsync(markPresence, 10000);

    return {
      before: statuses.PENDING,
      after: success ? statuses.REGISTERED : statuses.PENDING,
    };
  } else {
    return {
      after: statuses.WITHOUT,
      before: statuses.WITHOUT,
    };
  }
};
