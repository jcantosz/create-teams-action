const core = require("@actions/core");
const { AuthType } = require("./auth.js");
const teamsApi = require("./apis/teamsApi.js");
const usersApi = require("./apis/usersApi.js");

async function removeSelfFromTeam(octokit, org, team) {
  const login = await usersApi.getLogin(octokit);
  core.debug(`User login: "${login}".`);

  await teamsApi.removeUserFromTeam(octokit, org, team, login);
  core.debug(`User "${login}" removed from team "${team}".`);
}

async function createTeam(octokit, authType, enterpriseType, org, team, idpGroup, teamVisibility) {
  // Get info on if group to be added and if so, if it exists
  // const idpGroupInfo = await groupInfo(octokit, org, idpGroupInfo);

  // quit early if we are trying to add a group that does not exist
  // if (idpGroupInfo.addingGroup && !idpGroupInfo.groupId) {
  //   core.setFailed(`Group "${idpGroup}" does not exist, cannot create team (${team}) and link group.`);
  //   process.exit();
  // }

  // let the user know that we are not processing a group for this team if needed
  // if (!idpGroupInfo.addingGroup) core.info(`IDP group was not defined for team "${team}"`);

  core.info(`Attempting to create team "${team}"`);
  const teamSlug = await teamsApi.createTeamIfNotExist(octokit, org, team, teamVisibility);

  // if the team was created, conditionally remove default member and connect IDP group
  if (teamSlug) {
    core.debug(`Team slug: "${teamSlug}"`);

    if (authType == AuthType.PAT) {
      core.info(`Authenticated with a PAT, removing self from team "${team}" so that we can sync with IDP group`);
      await removeSelfFromTeam(octokit, org, teamSlug);
    }

    if (idpGroup != "") {
      core.info(`Adding idpGroup "${idpGroup}" to team "${team}"`);
      teamsApi.addIDPGroupToTeam(octokit, org, enterpriseType, teamSlug, idpGroup);
    } else {
      core.info(`IDP group was not defined for team "${team}"`);
    }
  }
}

// Create all teams in list
async function createTeams(octokit, authType, enterpriseType, org, teamsArray, teamVisibility) {
  core.debug(`Iterating through teams array ${JSON.stringify(teamsArray)}`);
  for (const team of teamsArray) {
    core.info(`Processing team "${team.github_team}"`);
    // We could remove the await and let everything process async but logs will be out of order
    await createTeam(octokit, authType, enterpriseType, org, team.github_team, team.idp_group, teamVisibility);
    core.info("");
  }
}

module.exports = {
  createTeams,
};
