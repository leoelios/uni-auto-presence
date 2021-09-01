const UniaraService = require("./client/UniaraClient");
const getUsername = require("./service/getUsername");
const { monitorPresence } = require("./service");
const { draw } = require("./constants");

const { UNI_RA, UNI_PASSWORD } = process.env;

function printWelcome({ username, ra, password }) {
  const header = `########################## Welcome ${
    username || "elementoX"
  } ##########################`;
  const footer = Array(header.length).fill("#").join("") + "\n";

  console.log(draw);
  console.log(header);

  console.log(`\n   RA ${ra}`);
  console.log(`   Logged in successfully ${new Date().toISOString()}\n`);

  console.log(footer);
}

function printPulse({ after, before }) {
  console.log(
    `[${new Date().toISOString()}] Checking if exists avaliable for presence mark | STATUS: ${before} -> ${after}`
  );
}

(async () => {
  const user_parameters = {
    ra: UNI_RA,
    password: UNI_PASSWORD,
  };

  await UniaraService.authenticate(user_parameters);

  printWelcome({
    username: await getUsername(),
    ...user_parameters,
  });

  printPulse(await monitorPresence());

  setInterval(async () => {
    printPulse(await monitorPresence());
  }, 30000);
})();
