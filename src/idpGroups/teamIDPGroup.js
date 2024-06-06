const cloudIDP = require("./cloudIDPGroup.js");
const emuIDP = require("./emuIDPGroup.js");
const { EnterpriseType } = require("../inputHandler.js");

async function addIDPGroupToTeam(octokit, org, type, teamSlug, groupId) {
  // EMUs and GHES use the 'external-groups' endpoints, cloud uses team-sync
  const idpFunctions = type == EnterpriseType.CLOUD ? cloudIDP : emuIDP;

  const idpGroup = await idpFunctions.getIDPGroupByName(octokit, org, groupId);
  if (idpGroup) {
    await idpFunctions.addGroupToTeam(octokit, org, teamSlug, idpGroup);
  }
}

module.exports = {
  addIDPGroupToTeam,
};
