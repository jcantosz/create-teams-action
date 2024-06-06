const core = require("@actions/core");
const teamIDPGroup = require("../idpGroups/teamIDPGroup.js");

async function teamExists(octokit, org, teamSlug) {
  return await octokit
    .request("GET /orgs/{org}/teams/{team_slug}", {
      org: org,
      team_slug: teamSlug,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    })
    .then(() => {
      core.debug(`Team exists.`);
      return true;
    })
    .catch((error) => {
      core.debug(error);
      if (error.status == 404) {
        core.debug(`Team does not exist.`);
        return false;
      } else {
        core.info("Some other error occurred when trying to fetch team");
        throw error;
      }
    });
}

async function createGitHubTeam(octokit, org, team, teamVisibility) {
  return (
    await octokit.request("POST /orgs/{org}/teams", {
      org: org,
      name: team,
      privacy: teamVisibility,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    })
  ).data;
}

async function createTeamIfNotExist(octokit, org, team, teamVisibility) {
  // Not from docs: To create the slug, GitHub replaces special characters in the name string, changes all words to lowercase, and replaces spaces with a - separator. For example, "My TEam Näme" would become my-team-name.
  // Replace all disallowed special chars with "-" (allow "_").
  // Then remove any special chars at beginning or end of string. If the slug is empty the team name is "team"
  const teamSlug =
    team
      .replace(/\W+/g, "-")
      .replace(/^\W|\W$/g, "")
      .toLowerCase() || "team";

  core.info(`Checking if team "${team}" (slug "${teamSlug}") already exists in org "${org}".`);
  if (!(await teamExists(octokit, org, teamSlug))) {
    core.info(`Creating team "${team}".`);
    return (await createGitHubTeam(octokit, org, team, teamVisibility)).slug;
  } else {
    core.info(`Skipping team "${team}". Team already exists.`);
  }
  return;
}

async function addIDPGroupToTeam(octokit, org, type, teamSlug, groupId) {
  await teamIDPGroup.addIDPGroupToTeam(octokit, org, type, teamSlug, groupId);
}

async function removeUserFromTeam(octokit, org, team, user) {
  await octokit.request("DELETE /orgs/{org}/teams/{team_slug}/memberships/{username}", {
    org: org,
    team_slug: team,
    username: user,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
}

module.exports = {
  removeUserFromTeam,
  createTeamIfNotExist,
  addIDPGroupToTeam,
};
