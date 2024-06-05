const cloudIDP = require("./cloudIDPGroup.js");
const emuIDP = require("./emuIDPGroup.js");
const { EnterpriseType } = require("../inputHandler.js");

async function addIDPGroupToTeam(octokit, org, type, teamSlug, groupId) {
  const idpFunctions = type == EnterpriseType.EMU ? emuIDP : cloudIDP;

  const idpGroup = await idpFunctions.getIDPGroupByName(octokit, org, groupId);
  if (idpGroup) {
    await idpFunctions.addGroupToTeam(octokit, org, teamSlug, idpGroup);
  }
}

module.exports = {
  addIDPGroupToTeam,
};
