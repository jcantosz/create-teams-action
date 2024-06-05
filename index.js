const core = require("@actions/core");
const { createOctokitInstance } = require("./src/auth.js");
const { getInputs } = require("./src/inputHandler.js");
const { createTeams } = require("./src/teams.js");

function teamToArray(type, teams) {
  const groupArray = [];
  for (const team of teams.split(",")) {
    core.debug(`processing team map: ${team}`);
    const components = team.split(":");
    const idpGroup = components.length > 1 ? components.pop() : ""; // if there are multiple elements, get the last one, otherwise get nothing
    console.log(components);
    groupArray.push({
      permissions: type,
      github_team: components.join(":") || "", // Join remaining elements with ":" in case that was removed
      idp_group: idpGroup,
    });
  }
  return groupArray;
}

function teamsToArray(teams) {
  let teamsArr = [];
  core.debug(`Teams to array ${teams}`);

  // get all the keys
  for (const team in teams) {
    core.debug(`Parsing team ${team} (${teams[team]})`);
    if (teams[team]) {
      curr = teamToArray(team, teams[team]);
      teamsArr = teamsArr.concat(curr);
    }
  }
  return teamsArr;
}

async function main() {
  const inputs = getInputs();
  core.debug(`inputs: ${JSON.parse(inputs)}`);

  const auth = createOctokitInstance(inputs.auth);
  const teamsArray = teamsToArray(inputs.teams);
  core.debug(`teamsArray: ${JSON.parse(teamsArray)}`);

  await createTeams(auth.octokit, auth.type, inputs.enterpriseType, inputs.org, teamsArray, inputs.visibility);
}

// Only run main if called directly
if (require.main === module) {
  main();
}
