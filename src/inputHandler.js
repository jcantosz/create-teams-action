const core = require("@actions/core");

const EnterpriseType = Object.freeze({
  EMU: Symbol("emu"),
  CLOUD: Symbol("cloud"),
  SERVER: Symbol("server"),
});

function getInputs() {
  const enterpriseTypeInput = core.getInput("enterprise_type").trim().toUpperCase();
  const enterpriseType =
    enterpriseTypeInput in Visibility
      ? Visibility[enterpriseTypeInput]
      : error(`Visibility must be one of: ${Object.values(Visibility)}`);

  return {
    auth: {
      PAT: core.getInput("PAT") || "",
      appId: core.getInput("app_id") || "",
      appPrivateKey: core.getInput("app_private_key") || "",
      appInstallationId: core.getInput("app_installation_id") || "",
      apiUrl: core.getInput("api_url") || "https://api.github.com",
    },
    enterpriseType: enterpriseType, // enterprise type "cloud" for standard, "emu" for emus
    org: core.getInput("org") || "",
    teams: {
      admin: core.getInput("admin_teams") || "",
      maintain: core.getInput("maintain_teams") || "",
      write: core.getInput("write_teams") || "",
      maintain: core.getInput("triage_teams") || "",
      read: core.getInput("read_teams") || "",
    },
    visibility: core.getInput("team_visibility") || "closed", // "closed" visible to all members of this organization. "secret" if you want it only visible to team members and org owners
  };
}

module.exports = {
  getInputs,
  EnterpriseType,
};
