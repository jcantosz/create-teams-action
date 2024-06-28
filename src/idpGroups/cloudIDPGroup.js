const core = require("@actions/core");
async function addGroupToTeam(octokit, org, teamSlug, group) {
  await octokit.request("PATCH /orgs/{org}/teams/{team_slug}/team-sync/group-mappings", {
    org: org,
    team_slug: teamSlug,
    groups: [group],
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
}

async function getIDPGroups(octokit, org) {
  return await octokit.paginate("GET /orgs/{org}/team-sync/groups", {
    org: org,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
}

async function getIDPGroupById(octokit, org, id) {
  const idpGroups = await getIDPGroups(octokit, org);
  core.debug(`Got groups ${JSON.stringify(idpGroups)}`);
  if (!idpGroups) {
    core.info("No idp groups returned");
    return;
  }
  for (const group of idpGroups.groups) {
    if (group.group_id == id) {
      core.info(`Group found! id: "${group.group_id}" name: "${group.group_name}"`);
      return group;
    }
  }
  return;
}

async function getIDPGroupByName(octokit, org, name) {
  const idpGroups = await getIDPGroups(octokit, org);
  core.debug(`Got groups ${JSON.stringify(idpGroups)}`);
  if (!idpGroups) {
    core.info("No idp groups returned");
    return;
  }
  for (const group of idpGroups.groups) {
    if (group.group_name == name) {
      core.info(`Group found! id: "${group.group_id}" name: "${group.group_name}"`);
      return group;
    }
  }
  return;
}

module.exports = {
  getIDPGroupById,
  getIDPGroupByName,
  addGroupToTeam,
};
