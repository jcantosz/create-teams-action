const core = require("@actions/core");
const cloudIDP = require("./cloudIDPGroup.js");
const emuIDP = require("./emuIDPGroup.js");
const { EnterpriseType } = require("../inputHandler.js");

async function addIDPGroupToTeam(octokit, org, type, teamSlug, groupName) {
  // EMUs and GHES use the 'external-groups' endpoints, cloud uses team-sync
  const idpFunctions = type == EnterpriseType.CLOUD ? cloudIDP : emuIDP;

  const idpGroup = await idpFunctions.getIDPGroupByName(octokit, org, groupName);
  if (idpGroup) {
    await idpFunctions.addGroupToTeam(octokit, org, teamSlug, idpGroup);
    core.info(`group "${groupName}" not found, added to team "${teamSlug}" `);
  } else {
    core.warning(`group "${groupName}" not found, could not be added to team "${teamSlug}" `);
  }
}

module.exports = {
  addIDPGroupToTeam,
};
