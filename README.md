# Create team action

Action creates a team and optionally adds and IDP group to the team.
Requires either a Fine-Grained Token or an GitHub App per the API docs.

## Build

`ncc build index.js`

## Example workflow

Workflow to add a team with a group

```yaml create-repo.yaml
name: Create repo from issue submission
on:
  issue:
    types:
      - opened
jobs:
  AddGroups:
    runs-on: ubuntu-latest
    jobs:
      - name: Checkout
        uses: actions/checkout@v4

      # Extract info from issue template
      - uses: stefanbuck/github-issue-parser@v3
        id: issue-parser
        with:
          template-path: .github/ISSUE_TEMPLATE/create-teams.yaml

      - name: Create team
        uses: jcantosz/create-teams-action@main
        with:
          pat: ${{ secrets.PAT }}
          # The org to create the repo in
          org: ${{ steps.issue-parser.outputs.issueparser_org }}
          # The type of enterprise to add groups to
          enterprise_type: "cloud"
          admin_teams: "GITHUB_TEAM_NAME_1:IDP_GROUP_NAME_1,GITHUB_TEAM_NAME_2:IDP_GROUP_NAME_2"
```

## Parameters

| Parameter           | Description                                          | Default | Required | Note                                           |
| ------------------- | ---------------------------------------------------- | ------- | -------- | ---------------------------------------------- |
| pat                 | The PAT used to authenticate.                        | `none`  | `false`  |                                                |
| app_id              | The GitHub App ID used to authenticate.              | `none`  | `false`  |                                                |
| app_private_key     | The GitHub App private key used to authenticate.     | `none`  | `false`  |                                                |
| app_installation_id | The GitHub app installation ID used to authenticate. | `none`  | `false`  |                                                |
| api_url             | GitHub API URL.                                      | `none`  | `false`  | Change this if using GitHub Enterprise Server. |
| org                 | The organization to create the teamsin.              | `none`  | `true`   |                                                |

## Sample issue template

TODO

```yaml add_entra_group.yaml
name: Create team
description: Create a team from a template
title: "[TEAMS]: "
labels: ["teams"]
body:
  - type: input
    id: org
    attributes:
      label: Repository Org
      description: "The org of the repository to create"
      placeholder: "my-org"
  ...

```
