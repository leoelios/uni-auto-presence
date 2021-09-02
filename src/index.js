require("dotenv").config();
const schedule = require("node-schedule");

const UniaraService = require("./client/UniaraClient");
const getUsername = require("./service/getUsername");
const { monitorPresence } = require("./service");
const { draw } = require("./constants");

const { UNI_RA, UNI_PASSWORD } = process.env;

function printWelcome({ username, ra }) {
  const header = `########################## Welcome ${
    username || "elementoX"
  } ##########################`;
  const footer = Array(header.length).fill("#").join("") + "\n";

  console.log(header);

  console.log(`\n   RA ${ra}`);
  console.log(
    `   Logged in successfully ${new Date().toLocaleString("pt-BR")}\n`
  );

  console.log(footer);
}

function printPulse({ after, before }) {
  console.log(
    `[${new Date().toISOString()}] Checking if exists avaliable for presence mark | STATUS: ${before} -> ${after}`
  );
}

const userParameters = {
  ra: UNI_RA,
  password: UNI_PASSWORD,
};

console.log(draw);

function createRule() {
  const rule = new schedule.RecurrenceRule();
  rule.dayOfWeek = [new schedule.Range(1, 5)];
  rule.hour = new schedule.Range(19, 23);
  rule.second = [10, 40];

  return rule;
}

UniaraService.authenticate(userParameters)
  .then(async (_) => {
    printWelcome({
      username: await getUsername(),
      ...userParameters,
    });

    schedule.scheduleJob(createRule(), async (_) => {
      console.log("executando");
      printPulse(await monitorPresence());
    });
  })
  .catch((err) => {
    console.error(err);
  });
