---
title: Before and After Guide on Administering a Migrated Split Account on Harness
description: Learn how administrative tasks work after your migration into Harness FME.
sidebar_label: Administering a Migrated Split Account on Harness
sidebar_position: 3
---

## Overview

This guide is intended to be used as a reference shortly after your migration into Harness to guide you through administrative tasks. It will also help you understand permissions in Harness after your Split-to-Harness migration. It explains how legacy **Split access restrictions** map to **Harness RBAC (role-based access control) settings** in two ways:

* Some RBAC principals, resource groups, and roles are created for you during migration of your `app.split.io` (legacy Split) account to `app.harness.io`. This mapping is explained in detail, and we show you where to find the new RBAC settings.
* Harness RBAC settings can mimic and provide control beyond what was possible with legacy Split access restrictions. This guide explains how to use RBAC to grant similar permissions to the legacy settings when creating users, user groups, API keys, and projects.

Harness recommends:

1. Using this guide to become familiar with the initial RBAC settings applied to your new Harness account.
1. Following this guide to work with the Harness RBAC principals and role bindings that were created for you during your migration.
1. Learning about the full potential of RBAC on the Harness platform, starting with [Platform access control](/docs/category/platform-access-control/) in the Harness documentation.

:::tip Read about Environment Scope (Admin API keys)
Creation of new environment-scoped Admin API keys in Harness post-migration will be available when the "Granular permissions in RBAC" [roadmap item](https://developer.harness.io/roadmap/#fme) is delivered. Existing environment-scoped Admin API keys continue to function as before, but cannot be cloned or rotated. To learn more, go to the [Environment Scope](#environment-scope) section.
:::

The following terminology is referenced in this guide:

* **Legacy Split**: Legacy Split refers to the application accessed through `app.split.io`.
* **Harness FME**: This refers to the legacy Split application once it has been migrated to `app.harness.io`. The migration preserves the application intact and converts it to a module within Harness called Feature Management and Experimentation (FME).
* **The Harness FME team**: The Split team is here referred to as the Harness FME team (renamed after Split was acquired by Harness), but it is the same people.
* **API keys**:

  * **Admin API keys**: Authentication tokens used to authorize [Split Admin API requests](https://docs.split.io/reference/introduction). These authentication tokens can be created on the Harness platform after migrating.
  * **SDK API keys**: Authentication tokens used to authorize FME SDK requests. SDK API keys are managed by the Harness FME module.
  * **API keys**: The Harness platform manages API keys and tokens within service accounts.* When “API keys” is not preceded by “Admin” or “SDK”, then this guide is referring to these Harness platform API key entities.

  :::info
  In Harness, API keys can also be created at the [personal user scope](/docs/platform/automation/api/add-and-manage-api-keys/#create-personal-api-keys-and-tokens), but the migration script does not create personal access API keys and tokens, so these are outside the scope of this guide.
  :::

## Users

This section explains:

* How RBAC applies to Harness users
* How to add new users with the same privileges as your legacy Split users

### Users for Harness FME

When your Split account was migrated to Harness, a Harness user was created for each legacy Split user.

Here’s how Harness users work with RBAC:

![](./static/rbac-user-diagram.png)

Users can have role bindings that each assign a role (a set of permissions) over a resource group. Users can be created at the Harness account, organization, or project level.

When a user is created at the project level (in Project settings), this user is automatically added to the Harness built-in **All Organization Users** and **All Account Users** user groups in the parent organization and account.

Likewise, a user created at the organization level (in **Organization settings**), is automatically added to the **All Account Users** user group in the parent account.

### View your users

You can view your new Harness users (that correspond to your legacy Split users) in your Harness account settings (in the left navigation panel, click **Account settings**, click **Access Control** at the top of the page, and click the **Users** tile).

![](./static/account-settings.png)

The same users were also added at the organization level, and can be seen in your Harness organization settings (in the left navigation panel, click **Organization settings**, click **Access Control** at the top of the page, and click the **Users** tile).

![](./static/org-settings.png)

The users do not appear in the project-level Users lists (except for pre-migration restricted projects where users were individually granted access). Instead, users were added to user groups and it is these user groups that can be viewed in project settings.

No role bindings were added to your individual Harness users at the account or organization levels. Instead, role bindings were added to user groups. For more details, go to the [User Groups](#user-groups) section.

### Add a user

This section shows you how to add new Harness users and set up RBAC permissions that mimic your legacy Split permissions.

When you add a user, you will see the FME user groups that were created at the account or organization level. You’ll be guided to add the new Harness user at the same scope. Once a user is added to the Harness platform, it is easy to add the same user at all other scopes.

#### Interactive guide

This interactive guide shows how to add a user to Harness that will have access to your (unrestricted) migrated FME projects:

<DocVideo src="https://app.tango.us/app/embed/e9c155c2-1d2d-4fbf-b5d6-7b59591668b6" title="Add a User in Harness" />

#### Step by step guide

To add a user that will have access to your (unrestricted) migrated FME projects:

1. Begin adding the user at the same scope (account or organization) as your [FME user groups](#fme-user-groups):

   - In the left navigation panel, click **Account settings** or **Organization settings**, click **Access Control** at the top of the page, and click the **Users** tile.
   - Click **+ New User** to begin adding a new user.
   - Type the user email in the **Users (name or email)** textbox, and select **+ email you just typed** that appears below the textbox. (You can add multiple users at once by entering multiple email addresses.)
1. Apply permissions to the user by adding the user to a user group:
   - Click **Select User Group(s)**.
   - In the modal, check the FME user group that represents the legacy Split permissions you would like to mimic:
     
     - **All FME Admins** (equivalent to the legacy **Split Administrators** group)
     - **All FME Editors** (equivalent to the legacy **Split Editor** role)
     - **All FME Viewers** (equivalent to the legacy **Split Viewer** role)

1. Click **Apply** to finish adding the new user. The user will receive an invitation email to join the Harness account.

The RBAC permissions (that mimic legacy Split permissions) are set on the FME user group to which the new Harness user was added. You can learn more about these user group role bindings in the [User Groups](#user-groups) section.

If you want to grant the user access to a restricted project, you’ll need to add the user directly to the project (in the Project Settings) and assign the role binding for **All Project Level Resources**: **Split FME Administrator Role**, **Split FME Manager**, or **Project Viewer**. Go to [Unrestricted and Restricted Projects](#unrestricted-and-restricted-projects) to learn more.

### Delete a user

To delete a user in Harness, see [Delete users](/docs/platform/role-based-access-control/add-users/#delete-users) in the Harness platform documentation.

## User groups

This section explains:

* What Harness user groups were created when your legacy Split account was migrated to Harness, and what RBAC role bindings were assigned
* How to use Harness user groups to grant new users the same privileges as your legacy Split users

### User Groups for Harness FME

When your Split account was migrated to Harness, a Harness user group was created for each legacy Split group.

Here’s how Harness user groups work with RBAC:

![](./static/rbac-user-group-diagram.png)

User groups hold users. User groups have role bindings that apply to all the users within the user group.

### Roles

Harness roles are sets of permissions to perform specific operations on a resource group. 

### Resource Groups

Harness resource groups define the resources (e.g. projects, pipelines, connectors, secrets, folders, users, etc.) that a user group (or user, or service account) can access.

### Role Bindings

Role bindings are roles assigned to a user, user group, or service account over a resource group.

Resources live at the account, organization, or project levels, so resource groups are scope-specific. For example, a resource group can be **All resources** or **All resources and child scopes** (for the account, organization, or project).

:::tip RBAC is additive
The total expanse of a user's permissions and access is the **sum** of all the roles and resource groups from all user groups they belong to, as well as any roles and resource groups assigned directly to them as an individual user.
:::

### View your user groups

You can view legacy Split groups that were migrated to Harness in your Harness organization settings. In the left navigation panel, click **Organization settings**, click **Access Control** at the top of the page, and click the **User Groups** tile.

The screenshot below shows a Harness user group that was created for a legacy Split group. This group is created and managed (meaning users can be added) at the account level (when Split is migrated into a new Harness account) or organization level (when Split is migrated into an existing Harness account). Role bindings are created for this group (for specific projects) at the project level.

![](./static/org-settings-user-group.png)

### FME user groups

When your account was migrated to Harness, the migration script created new Harness user groups and role bindings to replicate your legacy Split settings:

| **Legacy Split setting** | **Harness user group** | **Harness scope** (where the user group is created and managed) | **Harness role** | **Harness resource group** |
|--------------------------|-------------------------|------------------------------------------------------------------|-------------------|-----------------------------|
| Administrators (Legacy Split group) | All FME Admins | Harness account (for a new Harness account) <br /><br /> Harness organization (for a pre-existing Harness account) | Account Admin (new account) <br /><br /> Organization Admin (pre-existing account) | All Resources Including Child Scopes |
| Editors (Legacy Split role) | All FME Editors | Harness account <br /> Harness organization |  | All Resources Including Child Scopes |
| Viewers (Legacy Split role) | All FME Viewers | Harness account <br /> Harness organization |  | All Resources Including Child Scopes |

The user groups were created at the Harness account scope (if no Harness account existed before the migration) or Harness organization scope (if you already had an existing Harness account that your legacy Split objects were merged into).

![](./static/account-settings-user-group.png)

#### Role bindings at the project level

To grant similar permissions to your legacy Split settings, the new Harness user groups were inherited by Harness projects and role bindings were applied:

| **Legacy Split setting** | **Harness user group** | **Role binding (role + resource group)** (and the scope where the role binding was assigned) | **Harness scope** | **Harness role** | **Harness resource group** |
|--------------------------|------------------------|----------------------------------------------------------------------------------------------|--------------------|-------------------|-----------------------------|
| Project (any permission settings) - All FME Admins | Harness project | Split FME Administrator Role <br /> *(Project scope)* | Project | Split FME Administrator Role | All Project Level Resources |
| Project (any permission settings) - All FME Editors | Harness project | Split FME Manager Role <br /> *(Project scope)* | Project | Split FME Manager Role <br /> Project Viewer | All Project Level Resources |
| Project (any permission settings) - All FME Viewers | Harness project | Project Viewer <br /> *(Project scope)* | Project | Project Viewer | All Project Level Resources |
| Legacy Split group <br /> *(group you created in Split)* + **Editor** (Legacy Split role of all users in the group) | Harness group <br /> *(created at the Harness organization level)* | Split FME Manager Role <br /> Project Viewer <br /> *(Project scope)* | Harness project <br /> *(if project is not restricted OR restricted but grants group access)* | Split FME Manager Role <br /> Project Viewer | All Project Level Resources |
| Legacy Split group <br /> *(group you created in Split)* + **Viewer** (Legacy Split role of at least one user in the group)* | Harness group <br /> *(created at the Harness organization level)* | Project Viewer <br /> *(Project scope)* | Harness project <br /> *(if project is not restricted OR restricted but grants group access)* | Project Viewer | All Project Level Resources |

\* Users may lose edit permissions for a restricted project.  

:::warning In legacy Split groups with both editors and viewers – Editors will lose permissions.
If a group in legacy Split had both editors and viewers (legacy roles) and the group was given access to a restricted project, then post-migration the Harness group will be assigned only the Project Viewer role. (This prevents viewers from gaining broader permissions upon migration.) The users that were legacy Split editors will no longer have edit permissions for the project.

Since RBAC is additive, you can assign edit permissions by adding the Harness user (with the legacy Editor role) at the project level and assigning the role binding: Split FME Manager Role role and All Project Level Resources resource group.
:::

#### Examples showing user group inheritance and role bindings

For an unrestricted project:

![](./static/unrestricted-project.png)

The Website project was an unrestricted project in legacy Split. After migration, the FME user groups (**All FME Admins**, **All FME Editors**, and **All FME Viewers**) are inherited and role bindings are assigned at the project level as shown below. (All role bindings are for the **All Project Level Resources** resource group.)

The **All Project Users** is a Harness managed group that is created on project creation, and users are automatically added to this group when added to the project

For a restricted project:

![](./static/restricted-project.png)

The API project was a restricted project in legacy Split. After migration, only the **All FME Admins** user group and another user group are inherited at the project level, because these were explicitly added to the legacy Split project.

### Add a user group

Harness recommends creating user groups at the organization (or account) level. You can then inherit the group at any project level (and assign role bindings at the project level).

:::tip Create groups for broader privileges at higher scopes
Create groups intended for broader privileges (like admins) at higher scopes, and those intended for a narrow range of visibility at lower scopes.

User groups can be inherited from higher scopes (e.g. a project can inherit a user group from an organization or account), but user groups cannot be inherited from lower scopes (e.g. an account cannot inherit a user group from an organization or project).
:::

To create a user group in Harness, see [Create user groups manually](/docs/platform/role-based-access-control/add-user-groups/#create-user-groups-manually) in the Harness platform documentation.

Refer to [Role bindings at the project level](#role-bindings-at-the-project-level) if you’d like to replicate legacy Split permissions using Harness RBAC settings.

### Delete a user group

To delete a user group in Harness, see [Delete user groups](/docs/platform/role-based-access-control/add-user-groups/#delete-user-groups) in the Harness platform documentation. The users within the user group will not be deleted.

:::danger Do not delete All FME Admins, All FME Editors, or All FME Viewers
Harness recommends that you do not delete the All FME Admins, All FME Editors, and All FME Viewers user groups, unless you fully understand the effect of the deletion: The role bindings associated with these user groups replicate your legacy Split user permissions and would be deleted and unassigned from your users.
:::

## Admin API Keys

### Legacy Split Admin API keys

The Admin API Keys that you created before migration will continue to work after your account is migrated to Harness.

Post-migration, your legacy Split Admin API keys are listed in **FME Settings**.

![](./static/fme-settings-api-keys.png)

### Revoke a legacy Split Admin API key

:::tip Avoid revoking environment-scoped Admin API keys
Until granular permissions at the object and environment level are implemented in Harness FME, you will not be able to create environment-scoped Admin API keys on the Harness platform. For that reason, you should avoid revoking environment-scoped Admin API keys at this time. See the [FME roadmap](https://developer.harness.io/roadmap/#fme) for “Granular permissions in RBAC” for timing.
:::

To revoke an Admin API key that was migrated from legacy Split:

1. In the left navigation panel, click the **Grid** icon, and click **Feature Management & Experimentation**.
1. Click **FME Settings**.
1. Click **API Keys**.
1. Select the **Admin API Keys** tab.
1. Find the row listing the Admin API key that you’d like to delete and click **Revoke** in the **Actions** column.
1. Type `REVOKE` in the Revoke API key modal and click **Revoke**. The key is deleted from the list on the **Admin API Keys** tab.

Post-migration, you can create new Admin API keys in Harness, as described in the following section.

### Harness FME Admin API keys

This section explains:

* What RBAC principals were created when your legacy Split account was migrated to Harness
* How to use the new Harness RBAC principals to create new Admin API keys with the same privileges as your legacy Split Admin API keys

When your Split account is migrated to Harness, a service account is created for each legacy Split Admin API key. 

:::danger Do not delete service accounts linked with legacy Admin API keys
Each service account created by the migration script and its role bindings are linked with one of your legacy Split Admin API keys. The service account role bindings define the access granted to the Admin API key over Harness resources, and are necessary for the Admin API key to authorize your API requests after your migration to Harness.

This association between your legacy Split Admin API keys and service accounts is not visually shown in Harness. The service accounts do not appear to contain tokens (on the pages where they are managed in Harness); however, the tokens are the legacy Split Admin API keys (shown in FME Settings). It is best to delete the legacy Split Admin API key in FME Settings before deleting the associated service account; otherwise, if the service account is deleted before the Admin API key, then the Admin API key will not work.
:::

:::info How to find which Harness service account is linked with a legacy Split Admin API key
You can look for the service account name that matches the name of your legacy Split Admin API key. This service account is internally linked to your Admin API key, and the role bindings of this service account are applied to your Admin API key.

In the left navigation panel, click **Account settings** or **Organization settings**, and click the **Service accounts** tile. The name of the linked service account is the same as the name of your legacy Split Admin API key, with spaces removed.
:::

Here’s how Harness service accounts work:

![](./static/rbac-service-diagram.png)

Service accounts hold API keys. API keys hold tokens. Service accounts have role bindings that each assign a role (a set of permissions) to a resource group. The role bindings apply to all the tokens within the service account.

### View your service accounts

The service accounts were created at the Harness account scope (if no Harness account existed before the migration) or Harness organization scope (if you already had an existing Harness account that your legacy Split objects were merged into).

To view service accounts in your Harness account settings, in the left navigation panel, click **Account settings**, click **Access Control** at the top of the page, and click the **Service accounts** tile. You will see all the service accounts and account-level role bindings.

![](./static/account-settings-service.png)

You can also view service accounts in your Harness organization settings (in the left navigation panel, click **Organization settings**, click **Access Control** at the top of the page, and click the **Service accounts** tile). You will see the service accounts with organization-level role bindings.

![](./static/org-settings-service.png)

To view service accounts in your Harness project settings, click **Project settings**, click **Access Control** at the top of the page, and click the **Service accounts** tile. You will see the service accounts with project-level role bindings.

![](./static/project-settings-service.png)

You can use a service account to create a new Harness FME Admin API key and access token. The access token can be used in the same way as a legacy Split Admin API key except that service accounts with environment-scoped Admin API keys will not be available until the “Granular permissions in RBAC” [roadmap item](https://developer.harness.io/roadmap/#fme) is delivered).

### Create an Admin API key

#### Interactive guide

This interactive guide shows how to create an Admin API key with the same permissions as your legacy Split Admin API key in your Harness account:

<DocVideo src="https://app.tango.us/app/embed/e76ab685-723c-4e39-964e-cff2c56df2d1" title="Generate an API Key and Token" />

#### Step by step guide

To create an Admin API key with the same permissions as your legacy Split Admin API key in your Harness account:

1. In the left navigation panel, click **Account settings** (or **Organization settings**, if you had a pre-existing Harness account before migration).
1. Click the **Access control** button at the top of the page.
1. Click the **Service accounts** tile.
1. Click on the service account that corresponds to your pre-migration Admin API key.
1. Click **+ API Key**.
1. Enter a name for the new API key and click **Save**.
1. Click **+ Token**.
1. Enter a name for the new API key token, set an expiration, and click **Generate Token**.
1. Copy the token somewhere safe.

If you don’t have a service account with role bindings set up, you can create a service account and role binding for Admin API keys scoped to all projects [(account or organization scope)](#account-or-organization-scope) or scoped to a specific project [(project scope)](#project-scope).

#### Account or organization scope

This section provides steps to create a service account and role bindings for an Admin API key scoped to all existing projects in your Harness account or organization. You can follow these steps if you don’t have a service account created during migration or if you prefer not to use it.

:::danger All Resources Including Child Scopes (resource group) is not recommended
The steps in this section guide you to add an **Account Admin** role for **All Account Level Resources**, and then grant equivalent permissions at the organization and project levels.

It is not recommended to use the **Account Admin** role for **All Resources Including Child Scopes**. This resource group includes all child resources at the organization and project levels.

The **All Resources Including Child Scopes** is not recommended because it would grant permissions to access:

- Any projects with restricted permissions (set up before migration)
- All projects added to the account in the future
:::

To create an Admin API key scoped to all projects in your Harness account:

1. At the account level, create the service account and assign roles:
   
   - In the left navigation panel, click **Account settings**.
   - Click the **Access control** button at the top of the page.
   - Click the **Service accounts** tile.
   - Click the **+ New Service Account** button at the top of the page.
   - Enter a name for the new service account and click **Save**. The service account is listed.
   - Click **Manage Role Bindings** to **manage role bindings** for the service account.
   - Click **+ Add**.
   - Select the **Account Admin** role and the **All Account Level Resources** resource group.
   - Click **Apply**. The role binding is added to the service account.
1. At the organization level, inherit the service account and assign roles:
   - In the left navigation panel, select the default organization.
   - Click **Organization settings**.
   - Click the **Access control** button at the top of the page.
   - Click the **Service accounts** tile.
   - Click the **Inherit Service Accounts and Assign Roles** button at the top of the page.
   - Click **Select Service Accounts**.
   - Select the **Account** tab and select the service account created in Step 1.
   - Click **Apply Selected**.
   - In the **Manage Role Bindings** modal, select the **Organization Admin** role and leave the **All Organization Level Resources** resource group unchanged.
   - Click **Apply**. The service account and role binding is listed.
1. For each project: At the project level, inherit the service account and assign roles:
   - In the left navigation panel, select the project.
   - Click Project settings.
   - Click the **Access control** button at the top of the page.
   - Click the **Service accounts** tile.
   - Click the **Inherit Service Accounts and Assign Roles** button at the top of the page.
   - Click **Select Service Accounts**.
   - Select the **Account** tab and select the service account created in Step 1.
   - Click **Apply Selected**.
   - In the **Manage Role Bindings** modal, select the **Project Admin** role and leave the **All Project Level Resources** resource group unchanged.
   - Click **Apply**. The service account and role binding is listed.
1. Create the API key and token at the account level:
   - In the left navigation panel, click **Account settings**.
   - Click the **Access control** button at the top of the page.
   - Click the **Service accounts** tile.
   - Click on the service account created in Step 1.
   - Click **+ API Key**.
   - Enter a name for the new API key and click **Save**.
   - Click **+ Token**.
   - Enter a name for the new API key token, set an expiration, and click **Generate Token**.
   - Copy the token somewhere safe.

:::tip Service accounts for <code>Admin API keys scoped to all projects</code> can also be created at the organization level
If you prefer, you can instead create the service account at the Harness organization level. Steps 1 and 4 would be done at the organization level, and Step 2 would be omitted. The **Organization Admin** role for **All Organization Level Resources** is required for the Admin API key to be granted permission to list Harness projects and Harness elements attached to projects.
:::

#### Project scope

This section provides steps to create a service account and role bindings for an Admin API key scoped to specific projects in your Harness account. You can follow these steps if you don’t have a service account created during migration or if you prefer not to use it.

To create an Admin API key scoped to a specific project in your Harness account:

1. At the account level, create the service account and assign roles:
   
   - In the left navigation panel, click **Account settings**.
   - Click the **Access control** button at the top of the page.
   - Click the **Service accounts** tile.
   - Click the **+ New Service Account** button at the top of the page.
   - Enter a name for the new service account and click **Save**. The service account is listed.
   - Click **Manage Role Bindings** to manage role bindings for the service account.
   - Click **+ Add**.
   - Select the **Account Admin** role and the **All Account Level Resources** resource group.
   - Click **Apply**. The role binding is added to the service account.
1. At the project level, inherit the service account and assign roles:
   - In the left navigation panel, select the project.
   - Click **Project settings**.
   - Click the **Access control** button at the top of the page.
   - Click the **Service accounts** tile.
   - Click the **Inherit Service Accounts and Assign Roles** button at the top of the page.
   - Click **Select Service Accounts**.
   - Select the **Account** tab and select the service account created in Step 1.
   - Click **Apply Selected**.
   - In the **Manage Role Bindings** modal, select the **Project Admin** role and leave the **All Project Level Resources** resource group unchanged.
   - Click **Apply**. The service account and role binding is listed.
1. Create the API key and token at the account level:
   - In the left navigation panel, click **Account settings**.
   - Click the **Access control** button at the top of the page.
   - Click the **Service accounts** tile.
   - Click on the service account created in Step 1.
   - Click **+ API Key**.
   - Enter a name for the new API key and click **Save**.
   - Click **+ Token**.
   - Enter a name for the new API key token, set an expiration, and click **Generate Token**.
   - Copy the token somewhere safe.

:::tip Service accounts for <code>Admin API keys scoped to specific projects</code> can also be created at the organization/project level

If you prefer, you can instead create the service account at the Harness organization or project level:

- **Organization level**: Steps 1 and 3 would be done at the organization level. In step 1, you would apply the role binding: Organization Admin role for All Organization Level Resources.
- **Project level**: Steps 1 and 3 would be done at the project level, and step 2 would be omitted. In step 1, you would apply the role binding: Project Admin role for All Project Level Resources.

If created at the project level, the API key would not be sharable (by inheriting) across multiple projects. You would only be able to use it in the project where it was created.
:::

### Environment Scope

:::warning
Creating a new Admin API key scoped to specific FME environments in the Harness FME module is not yet possible using Harness RBAC.
:::

While it is currently not possible post-migration to create Admin API keys scoped to environments, we are working on extending the FME implementation of Harness RBAC to allow this functionality. The Harness FME team will release fine-grained access control for FME resources with the “Granular permissions in RBAC” [roadmap item](https://developer.harness.io/roadmap/#fme). At that time, you will be able to create custom resource groups in Harness that will grant access to specific FME environments within a project.

Currently, for FME resources, resource groups in Harness define RBAC access to *all* entities of a given type. This means that access to specific environments within a project cannot be configured; only access to *all* environments within a project can be granted or revoked.

:::info
New API keys created in Harness cannot be scoped to specific FME environments of a project, even if you add the API key to a Harness service account linked to an environment-scoped legacy Split Admin API key.
:::

Your legacy Split Admin API key (created pre-migration) scoped to specific environments will continue to work that way. The legacy API key will be authorized by the back-end servers, as before migration.

### Delete an Admin API key

To delete an Admin API token that was created post-migration, see [Delete service account tokens](/docs/platform/automation/api/add-and-manage-api-keys/?token=sat#delete-tokens) in the Harness platform documentation. This will revoke the token used to authorize requests with the Harness back end.

To delete an Admin API key created post-migration, see [Edit service account API keys](/docs/platform/automation/api/add-and-manage-api-keys/?token=sat#delete-api-keys) in the Harness platform documentation. This will delete the API key and revoke all its tokens.

If you would like to revoke a legacy Split Admin API key (that was created pre-migration), see [Revoke a legacy Split API key](#revoke-a-legacy-split-admin-api-key).

### Rotate an API key token

To rotate an Admin API token that was created post-migration, see [Rotate service account tokens](/docs/platform/automation/api/add-and-manage-api-keys/?token=sat#rotate-tokens) in the Harness platform documentation.

If you would like to clone a legacy Split Admin API key (that was created pre-migration), see [Create an Admin API key](#create-an-admin-api-key) to create a new API key token in a Harness service account with privileges corresponding to the legacy Admin API key.

## SDK API keys

### Create an SDK API key

To create an SDK API key in your Harness account:

1. In the left navigation panel, click the Grid icon and click **Feature Management & Experimentation**.
1. Click **FME Settings**.
1. Click **Projects** under **Project settings**.
1. Find the row listing the project to which you’d like to scope the SDK API key and click **View** in the **Actions** column.
1. Click the **Actions** button at the top right, and select **Create SDK API key**.
1. Enter a name, select the type, and select the environment for the SDK API key.
1. Click **Create API Key**.
1. Copy the access token and click **Close**. The new key appears in the first row on the **SDK API Keys** tab.

### Revoke an SDK API key

To revoke an SDK API key in your Harness account:

1. In the left navigation panel, click the Grid icon and click **Feature Management & Experimentation**.
1. Click **FME Settings**.
1. Click **Projects** under **Project settings**.
1. Find the row listing the project for which you’d like to delete the SDK API key and click **View** in the **Actions** column.
1. Select the **SDK API Keys** tab.
1. Find the row listing the SDK API key that you’d like to delete and click **Revoke** in the **Actions** column.
1. Type `REVOKE` in the **Revoke API key** modal and click **Revoke**. The key is deleted from the list on the **SDK API Keys** tab.

### Clone an SDK API key

To clone an SDK API key in your Harness account:

1. In the left navigation panel, click the Grid icon and click **Feature Management & Experimentation**.
1. Click **FME Settings**.
1. Click **Projects** under **Project settings**.
1. Find the row listing the project for which you’d like to clone the SDK API key and click **View** in the **Actions** column.
1. Select the **SDK API Keys** tab.
1. Find the row listing the SDK API key that you’d like to clone and click **Clone** in the **Actions** column.
1. Enter a name for the SDK API key and click **Clone API Key**.
1. Copy the access token and click **Close**. The new key appears in the first row on the **SDK API Keys** tab.

## Projects

In Harness, an account contains a set of [organizations](#what-is-a-harness-organization), and an organization contains a set of projects.

When your Split account is migrated to Harness, an organization named `default` is created. Your projects are created within this organization. These Harness projects each internally link to your Harness FME projects.

### Create a project

To create a new project in Harness:

1. In the left navigation panel, click the Grid icon and click **Feature Management & Experimentation**.
1. Click **FME Settings**.
1. Click **Projects** under **Projects Settings** to bring up the **Projects** page in Harness FME.
1. Click the **Create project** button at the top right. This brings you to the Harness organization's **Projects** page.
1. Click **+ New Project**.
1. Enter a name for the project and click **Save and Continue**.
1. Click **Save and Continue** again to close the modal. You can grant access to the project using **Access Control** in **Project Settings**.

#### Interactive guide

<DocVideo src="https://app.tango.us/app/embed/4c5d12d9-a82c-4a54-a54e-c0684ddc3475" title="Create a New Project" />

#### Unrestricted and restricted projects

A new project in Harness will be restricted.

Until you grant access to your project using **Access Control** in your **Project settings**, your project will be restricted to you (the project creator). Only you will be able to view or edit the project in Harness (and in Harness FME).

![](./static/project-setings-access.png)

To grant access to your project, you can choose to follow the permission pattern of a legacy Split restricted project or unrestricted project. Initially, we recommend following one of these patterns. After some time, you may prefer to implement RBAC strategies aligned to your company policies and practices.

To implement permissions similar to the legacy Split restricted project:

1. From your **Project Settings**, add or inherit one or more of the following RBAC principals:
   
   - Add **users** individually to the project, then assign role bindings directly to the individual user at the project level.
   - Inherit a **user group** (from the account or organization) and assign role bindings at the project level.
   - Inherit a **service account** with an API key and token (grants access to an Admin API key) and assign role bindings at the project level.

1. Apply a role binding for **All Project Level Resources** that assigns one of the following roles:

   - **Split FME Administrator Role** corresponds to the legacy Split Administrator permissions
   - **Split FME Manager Role** corresponds to the legacy Editor role
   - **Project Viewer** corresponds to the legacy Viewer role

To implement permissions similar to the legacy Split unrestricted project:

1. Inherit each of the [FME user groups](#fme-user-groups) at your project level and add the following project-level role bindings:
   
   - All FME Admins: **Split FME Administrator Role** - **All Project Level Resources**
   - All FME Editors: **Split FME Manager Role** - **All Project Level Resources**
   - All FME Viewers: **Project Viewer** - **All Project Level Resources**

Role bindings added at the project level grant access to the specific project.

### Add an Admin API key (service account) to the project

To grant an Admin API key access to your project, we recommend you follow the steps in [Create an API key - Project scope](#project-scope):

- Steps 1-3 guide you to create a service account and grant **Project Admin** permissions to **All Project Level Resources** of your project.
- You only need to do Step 2 if the service account is already created, and the API key and token are already added to it.

### Delete a project

In the Harness FME module, you need to delete a project from the bottom-up. When all FME resources are deleted from the project, you can do a clean delete of the project from Harness.

If you do not delete the resources from within your project before deleting the project itself, the resources will continue to exist and continue to function (i.e. SDK Keys remain active and flag evaluations will succeed) even after you delete the project itself. You'll see a warning about this in the second paragraph of the Delete Project dialog:

![](./static/delete-project.png)

If you accidentally delete a project before deleting its resources, see the [Troubleshooting section](#troubleshooting).

#### Interactive guide

<DocVideo src="https://app.tango.us/app/embed/f046a6bd-4c56-414d-9398-f83ebbeb57d5" title="Delete a Project" />

#### Step by step guide

To cleanly delete a project in your Harness account:

1. First delete the following FME resources from your project:

   * Integrations
   * Feature flags
   * Segments
   * Metrics
   * Experiments
   * Traffic types
   * Admin API keys
   * SDK API keys
   * Environments

1. When all FME resources are deleted from your project, you can cleanly delete a project from the Harness **Projects** page:
   * Click the PROJECT (scope button) on the left navigation panel and click **Select Another Scope**.
   * Click **Select Another Scope**.
   * On the **Projects** tab, click **Manage Projects**.
   * Find the tile listing the project that you’d like to delete, click the **More options (⋮)** menu, and select **Delete**.

     :::info
     The warning in the dialog does not reflect the state of your project's FME resources. You will still see the warning "However, resources in the Feature Management & Experimentation (FME) module…" even after you have deleted all FME resources from the project.
     :::

   * Click **Yes, I want to delete this project**.
   * Type the project’s name in the text field and click **Delete**.

## FAQs

### API keys

#### Can I restrict an Admin API key to an FME environment?

The environment scope of Admin API keys created in Harness post-migration will be available when the “Granular permissions in RBAC” [roadmap item](https://developer.harness.io/roadmap/#fme) is delivered. To learn more, go to [Admin API Keys - Environment Scope](#environment-scope).

### Harness entities

#### What is a Harness organization?

An organization is a Harness entity that fits into the Harness structure as shown below.

![](./static/org-diagram.png)

The migration script created a Harness organization named `default`. Harness projects that correspond to legacy Split projects were created in this organization.

#### What are Harness environments (resources) shown in Harness Project, Organization, or Account settings?

There is a Harness platform resource type called [environments](/docs/continuous-delivery/x-platform-cd-features/environments/environment-overview/) found in Harness **Project settings**, **Organization settings**, and **Account settings** as well as on the project **Overview** page (shown below in Harness unified view).

![](./static/harness-envs.png)

This Harness platform resource type is currently distinct and separate from environments defined for your project in Harness FME Settings (shown below).

![](./static/fme-project-envs.png)

The Harness platform resource and Harness FME object (both called environment) are currently not related and do not affect each other.

### Harness roles

#### What are the Harness FME View SDK API and Edit SDK API permissions?

![](./static/harness-role-perms.png)

The **View SDK API** and **Edit SDK API** checkboxes grant permission to view or edit SDK API keys in **FME Settings**.

The screenshot below shows the **Project** page shown to a user with permission to edit SDK API keys.

![](./static/create-sdk-api-key.png)

### Legacy Split pages

#### Where is the All environments page?

![](./static/harness-all-envs.png)

The **All environments** page is not shown in Harness.

Instead, you can view environments per project:

1. In the left navigation panel, click the Grid icon and click **Feature Management & Experimentation**.
1. Click **FME Settings**.
1. Click **Projects**.
1. Find the row listing the project with the environments you’d like to view and click **View** in the **Actions** column.
1. Select the **Environments** tab.

#### Where is the All traffic types page?

![](./static/harness-all-traffic-types.png)

The **All traffic types** page is not shown in Harness.

Instead, you can view traffic types per project:

1. In the left navigation panel, click the Grid icon and click **Feature Management & Experimentation**.
1. Click **FME Settings**.
1. Click **Projects**.
1. Find the row listing the project with the traffic types you’d like to view and click **View** in the **Actions** column.
1. Select the **Traffic types** tab.

#### Where is the SDK API Keys tab?

![](./static/harness-sdk-api-keys.png)

The **SDK API Keys** tab has moved to the project page in **FME Settings**.

To view SDK API keys for a project:

1. In the left navigation panel, click the Grid icon and click **Feature Management & Experimentation**.
1. Click **FME Settings**.
1. Click **Projects**.
1. Find the row listing the project with the SDK API keys you’d like to view and click **View** in the **Actions** column.
1. Select the **SDK API Keys** tab.

## Troubleshooting

### My SDK feature flag evaluations work, but my FME project is not visible in Harness

Check with your Harness admin to be sure that the FME project does not exist in Harness. It could be that an admin somehow removed your view privileges.

If your Harness admin does not see your FME project on the Projects page in FME Settings, then the project may have been deleted in Harness without first deleting all FME project resources. You can take the steps in the next section (below).

### What can I do if I deleted a project without first deleting all FME project resources?

Contact support@split.io and provide us with the workspace ID of your orphaned FME project and the name of the deleted project in Harness. We will advise you on your next steps.

### My legacy Split Admin API key stopped working

Check if the corresponding service account exists in Harness:

1. In the left navigation panel, click **Account settings**.
1. Click the **Access control** button at the top of the page.
1. Click the **Service accounts** tile.
1. Look for a service account that matches the name of your legacy Split Admin API key (with spaces removed).

If you found the corresponding service account, you can investigate that its role bindings are sufficient for the operation you are attempting.

If you did not find the corresponding service account, you can take the steps in the next section (below).

### What can I do if I mistakenly deleted a service account that was linked with my legacy Split Admin API key?

Your legacy Split Admin API key will no longer authenticate your API requests.

Use the Split Admin API to [delete the Admin API key](https://docs.split.io/reference/delete-an-api-key) that no longer works, or contact support@split.io.

You can follow the steps to create an Admin API key with [organization or account scope](#account-or-organization-scope) or create an Admin API key with [project scope](#project-scope) to create a new Admin API key.