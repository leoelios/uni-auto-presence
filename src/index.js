require("dotenv").config();
const schedule = require("node-schedule");

const UniaraService = require("./client/UniaraClient");
const getUsername = require("./service/getUsername");
const { monitorPresence } = require("./service");
const { draw } = require("./constants");

const { UNI_RA, UNI_PASSWORD } = process.env;

const defaultLocale = "pt-BR";

function printWelcome({ username, ra }) {
  const header = `########################## Welcome ${
    username || "elementoX"
  } ##########################`;
  const footer = Array(header.length).fill("#").join("") + "\n";

  console.log(header);

  console.log(`\n   RA ${ra}`);
  console.log(
    `   Logged in successfully ${new Date().toLocaleString(defaultLocale)}\n`
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
  rule.second = [15, 40];

  return rule;
}

function createRuleAuthentication() {
  const rule = new schedule.RecurrenceRule();
  rule.dayOfWeek = [new schedule.Range(1, 5)];
  rule.hour = 19;
  rule.minute = 0;
  rule.second = 0;

  return rule;
}

schedule.scheduleJob(createRuleAuthentication(), async (_) => {
  UniaraService.authenticate(userParameters)
    .then(({ createdSession }) => {
      console.log(
        "Authentication performed successfully " +
          JSON.stringify(createdSession) +
          new Date().toLocaleString(defaultLocale)
      );
    })
    .catch((err) => {
      console.error("Ocurred a error during authentication " + err.message);
    });
});

UniaraService.authenticate(userParameters)
  .then(async (_) => {
    printWelcome({
      username: await getUsername(),
      ...userParameters,
    });

    schedule.scheduleJob(createRule(), async (_) => {
      printPulse(await monitorPresence());
    });
  })
  .catch((err) => {
    console.error(err);
  });
