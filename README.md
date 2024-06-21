# Create team action

Action creates a team and optionally adds and IDP group to the team.
Requires either a Fine-Grained Token or an GitHub App per the API docs.

## Build

`ncc build index.js`

## Example workflow

Workflow to add a team and optionally link an IDP group to it

```yaml create-repo.yaml
name: Create repo from issue submission
on:
  issues:
    types:
      - opened
jobs:
  AddGroups:
    runs-on: ubuntu-latest
    steps:
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
          admin_teams: ${{ steps.issue-parser.outputs.issueparser_admin_teams }} # "GITHUB_TEAM_NAME_1:IDP_GROUP_NAME_1,GITHUB_TEAM_NAME_2:IDP_GROUP_NAME_2"
```

## Parameters

| Parameter           | Description                                                                                                                                           | Default  | Required | Note                                                                                                                                                            |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| pat                 | The PAT used to authenticate.                                                                                                                         | `none`   | `false`  | If using a PAT and adding groups to a teams, that PAT must be a fine grained PAT with the `Members` organization permission.                                    |
| app_id              | The GitHub App ID used to authenticate.                                                                                                               | `none`   | `false`  |                                                                                                                                                                 |
| app_private_key     | The GitHub App private key used to authenticate.                                                                                                      | `none`   | `false`  |                                                                                                                                                                 |
| app_installation_id | The GitHub app installation ID used to authenticate.                                                                                                  | `none`   | `false`  |                                                                                                                                                                 |
| api_url             | GitHub API URL.                                                                                                                                       | `none`   | `false`  | Change this if using GitHub Enterprise Server.                                                                                                                  |
| org                 | The organization to create the teams in.                                                                                                              | `none`   | `true`   |                                                                                                                                                                 |
| enterprise_type     | Type of enterprise we are adding teams/groups to. Required for IDP group logic. Can be `cloud`, `emu`, `server`.                                      | `cloud`  | `false`  | `emu` and `server` use same logic/endpoints.                                                                                                                    |
| team_visibility     | The visibility of the teams being created. Can be `closed`, `secret`.                                                                                 | `closed` | `false`  | `secret` - only visible to organization owners and members of this team. `closed` - visible to all members of this organization.                                |
| admin_teams         | Input groups. Expected form is a string formatted like this: `<GitHub_Team_1_Name>:<Entra_Group_1_Name>,<GitHub_Team_2_Name>:<Entra_Group_2_Name>...` | `none`   | `false`  | Exists for compatibility with larger workflow that provisions multiple GitHub groups with varying permission levels. Could be combined into single group input. |
| maintain_teams      | Input groups. Functionality is identical to `admin_teams`, either or both can be set                                                                  | `none`   | `false`  | Exists for compatibility with larger workflow that provisions multiple GitHub groups with varying permission levels. Could be combined into single group input. |
| write_teams         | Input groups. Functionality is identical to `admin_teams`, either or both can be set                                                                  | `none`   | `false`  | Exists for compatibility with larger workflow that provisions multiple GitHub groups with varying permission levels. Could be combined into single group input. |
| triage_teams        | Input groups. Functionality is identical to `admin_teams`, either or both can be set                                                                  | `none`   | `false`  | Exists for compatibility with larger workflow that provisions multiple GitHub groups with varying permission levels. Could be combined into single group input. |
| read_teams          | Input groups. Functionality is identical to `admin_teams`, either or both can be set                                                                  | `none`   | `false`  | Exists for compatibility with larger workflow that provisions multiple GitHub groups with varying permission levels. Could be combined into single group input. |

## Sample issue template

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
  - type: input
    id: admin_teams
    attributes:
      label: Admin Teams
      description: "The teams and groups ("TEAM_NAME:IDP_GROUP_NAME,TEAM_NAME:IDP_GROUP_NAME") to create/link
      placeholder: TEAM_NAME1:IDP_GROUP_NAME1,TEAM_NAME2:IDP_GROUP_NAME2
  ...

```
