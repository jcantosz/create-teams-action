const { Octokit } = require("@octokit/rest");
const { paginateRest } = require("@octokit/plugin-paginate-rest");
const { throttling } = require("@octokit/plugin-throttling");
const { createAppAuth } = require("@octokit/auth-app");
const core = require("@actions/core");

const MyOctokit = Octokit.plugin(throttling).plugin(paginateRest);

// Enum-like object
const AuthType = Object.freeze({
  APP: Symbol("app"),
  PAT: Symbol("pat"),
});

function getThrottleConfig() {
  return {
    onRateLimit: (retryAfter, options, octokit, retryCount) => {
      octokit.log.warn(`Request quota exhausted for request ${options.method} ${options.url}`);

      if (retryCount < 1) {
        // only retries once
        octokit.log.info(`Retrying after ${retryAfter} seconds!`);
        return true;
      }
    },
    onSecondaryRateLimit: (retryAfter, options, octokit) => {
      // does not retry, only logs a warning
      octokit.log.warn(`SecondaryRateLimit detected for request ${options.method} ${options.url}`);
    },
  };
}

function createAppOctokitInstance(auth) {
  core.info("Creating Octokit with GitHub App");
  return new MyOctokit({
    throttle: getThrottleConfig(),
    authStrategy: createAppAuth,
    auth: {
      appId: auth.appId,
      privateKey: auth.appPrivateKey,
      installationId: auth.appInstallationId,
    },
    baseUrl: auth.apiUrl,
    log: core.isDebug() ? console : null,
  });
}
function createPATOctokitInstance(auth) {
  core.info("Creating Octokit with PAT");
  return new MyOctokit({
    throttle: getThrottleConfig(),
    auth: auth.PAT,
    baseUrl: auth.apiUrl,
    log: core.isDebug() ? console : null,
  });
}

function createOctokitInstance(auth) {
  if (auth.appId && auth.appPrivateKey && auth.appInstallationId) {
    return { octokit: createAppOctokitInstance(auth), type: AuthType.APP };
  } else {
    return { octokit: createPATOctokitInstance(auth), type: AuthType.PAT };
  }
}

module.exports = {
  AuthType,
  createOctokitInstance,
};
