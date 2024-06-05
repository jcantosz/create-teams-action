let groups;
async function addGroupToTeam(octokit, org, teamSlug, group) {
  await octokit.request("PATCH /orgs/{org}/teams/{team_slug}/external-groups", {
    org: org,
    team_slug: teamSlug,
    group_id: group.group_id,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
}

async function getIDPGroups(octokit, org) {
  if (!groups) {
    groups = await octokit.paginate(
      "GET /orgs/{org}/external-groups",
      {
        org: org,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      },
      (response) => {
        response.data.map((resp) => {
          resp.groups;
        });
      }
    );
  }
  return groups;
}

async function getIDPGroupById(octokit, org, id) {
  const idpGroups = await getIDPGroups(octokit, org);
  for (const group of idpGroups) {
    if (group.group_id == id) {
      return group;
    }
  }
  return;
}

async function getIDPGroupByName(octokit, org, name) {
  const idpGroups = await getIDPGroups(octokit, org);
  for (const group of idpGroups) {
    if (group.group_name == name) {
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
