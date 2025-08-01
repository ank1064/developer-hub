---
title: Migrate from Split to Harness FME
id: index
slug: /feature-management-experimentation/split-to-harness
description: Learn how to migrate from Split to Harness FME.
sidebar_label: Overview
sidebar_position: 1
---

## Overview

In September 2024, the Split leadership team, now leading Harness's Feature Management & Experimentation business unit, shared a plan to integrate Split with the Harness Platform.

The integration will fulfill key promises:

* **Minimal Effort**: Little to no work required from your team.
* **No Downtime**: Your production applications remain uninterrupted.
* **Immediate Benefits**: New features available from day one.

## Three-Point Summary

1. **Front-End URL Changes, User Flows Remain**

   - On your migration day, Split’s front-end interface will move from `app.split.io` to `app.harness.io`.
   - No Retraining for Users: User tasks stay the same.
   - Changes for Admins: Guides will assist with the transition.

1. **Back-End Stays the Same: No Developer Updates Needed**

   - Split’s back-end infrastructure remains unchanged.
   - No Code Changes Related to SDKs Required: Your developers won’t need to modify any application code interacting with Split SDKs, feature flags, or events.
   - Optional Infrastructure Unchanged: No updates for Split Proxy, Split Synchronizer, or Split Evaluator.
   - Back-end integrations (i.e. S3, Segment, mParticle, etc.) will be served from the same back-end after the new Harness front-end is activated for your account. They will not need reconfiguring.

1. **Harness Handles Migration Steps, with Two Exceptions**

   - SSO Configuration: You need to set up a new SSO connection to Harness (if you use SSO).
   - Admin API Script Updates: Update automation scripts for any of the 5 affected endpoints.

## Next Steps for Users

   - Know Your Migration Date: Log in to `app.harness.io` on migration day.
   - (Optional) Watch Video Preview (coming soon): Preview the similar user experience, with new read-only admin settings screens.

## Next Steps for Administrators

   - Watch 30 Seconds to Confidence: How Your Migration Will Work (to see why there will be no downtime for your applications).
   - Identify which of the three scenarios below apply to you (and plan to take action if needed).
   - Keep an eye out for migration date updates by email.

### Scenario One: Do You Use Management Screens?

   - Task: Learn to use new screens for managing users, groups, projects, permissions, or API keys.
   - Resource: Access the Before and After Guide: Administering a Migrated Split Account on Harness.

     - Compare Split and Harness admin screens side-by-side.
     - Watch short interactive and written step-by-step guides designed to quickly get you up to speed with tasks such as adding users, creating and editing groups, etc.
   
   - Future Update: Environment-level and Object-level Permissions will move to Harness RBAC management during Phase Two, Part Two, which will take place several months after all accounts have been migrated. We will update the Before and After Guides at that time.

### Scenario Two: Do You Access Split via SSO?

   - Task: create a new SSO Connection at least one week before migration.
   - Resource: Access the Before and After Guide: SSO for Split Admins.
   - By April 4th, 2025: Harness account invites will be sent to Split Administrators

     - Task Detail: Accept your invite by resetting your password.
     - Task Detail: Coordinate with your IT team to configure SSO.

### Scenario Three: Has Your Organization Automated Tasks With the Split Admin API?

   - Task: Update scripts if using one of the 5 impacted Split Admin API endpoints.
   - Resource: Access the Before and After Guide: API for Split Admins. This guide includes ready-to-run API examples in Postman.  Updates are being made daily and videos will follow.
   - Usage Data: To learn if your organization has recently used any of the 5 impacted endpoints, look for the emails below and read Migration: API-Updates. 

     - February 21st, 2025: "Follow-Up: Changes to Split Admin API Endpoints & Migration to Harness."
     - February 27th, 2025: "Updated 2/27/25: Follow-Up: Changes to Split Admin API Endpoints & Migration to Harness." 

## Our Promise To You

This integration enhances Split with Harness's core platform features. With over 1,000 fellow team members, we are accelerating the roadmap and excited to deliver new role-based access control on your migration day. 

For questions about what we are planning next, refer to the [public roadmap](https://developer.harness.io/roadmap/#fme) for Feature Management & Experimentation or ask your Harness representative.

## We Value Your Feedback

We welcome your questions and concerns about changes. Reach out to your Harness contact or email support@split.io.