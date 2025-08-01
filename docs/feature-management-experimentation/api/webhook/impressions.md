---
title: Webhook for Impressions
description: Learn how to configure the webhook for impressions in Harness FME.
sidebar_position: 3
sidebar_label: Impressions
---

## Overview

Use this outgoing webhook to integrate Split impressions into the tools that your team already uses. You can use Split webhooks to enhance your tracking, and analytics tools to provide insights around the impact of feature changes.

Whenever Split stores down an [impression](/docs/feature-management-experimentation/feature-management/impressions/) from an SDK, we send an HTTP POST payload to the webhook's configured URL in JSON format (`Content-Type: application/json`) in batches of impressions seen approximately every 10 seconds. The data sent has the following schema. Any response code other than 200 is marked as failure.

To reduce latency, each HTTP POST is be gzipped unless the URL represents a Slack or [Fivetran](https://fivetran.com/) webhook.

```json
[
  {
    "key": "string", // key evaluated
    "split": "string", // feature flag name
    "environmentId": "string", // environment id where we are evaluating the feature flag
    "environmentName": "string", // environment name
    "treatment": "string", // treatment we gave to this key
    "time": "long", // timestamp when the SDK made the evaluation
    "bucketingKey": "string", // key used for hashing and to determine a bucket
    "label": "string", // the rule that was applied to return a treatment
    "machineName": "string", // the hostname of the SDK host (if available)
    "machineIp": "string", // the IP of the SDK host (if available)
    "splitVersionNumber": "long", // equivalent to the generation time
    "sdk": "string", // the SDK language that evaluated the feature flag
    "sdkVersion": "string", // the SDK version that evaluated the feature flag
    "properties": "string" // reserved for future use
  },
  // ... a list of objects with the same type
]
```

## Retry

If Split receives a non-200 response to a webhook POST, Split waits 300 milliseconds and attempts to retry the delivery once.

## Configuring the webhook

To configure this webhook, do the following:

1. Click the **user's initials** at the bottom of the left navigation pane and click **Admin settings**.
1. Click **Integrations** and navigate to the **Marketplace** tab.
1. Find Outgoing webhook (impressions), click **Add** and select the Split project for which you would like to configure the integration.
1. Check the environments where you would like data sent from.
1. Enter the URL where the POST should be sent.
1. Click **Save**.

Contact support@split.io if you have any issues with this webhook.