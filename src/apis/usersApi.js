async function getLogin(octokit) {
  return (
    await octokit.request("GET /user", {
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    })
  ).data.login;
}

module.exports = {
  getLogin,
};
