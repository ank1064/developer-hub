---
title: Secure Connect for Harness Cloud
description: Private networking with Harness-managed runners.
sidebar_position: 20
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::note
Limited GA Notice for Secure Connect on Harness Cloud

Secure Connect for Harness Cloud is currently in Limited GA. Its functionality and performance are subject to change, and some issues may occur during use.

To enable Secure Connect for Harness Cloud, ensure the feature flag `CI_SECURE_TUNNEL` is active. Please contact Harness Support for assistance with enabling this feature.

For macOS users, the additional feature flag `CI_HOSTED_CONTAINERLESS_OOTB_STEP_ENABLED` is required for compatibility.
:::

[Harness CI Cloud (Harness-managed build infrastructure)](/docs/continuous-integration/use-ci/set-up-build-infrastructure/use-harness-cloud-build-infrastructure) addresses common challenges you might face when implementing a continuous integration tool in your infrastructure:

* **Can I trust Harness CI Cloud with my intellectual property (source code, artifacts, and so on)?** Yes. Harness CI Cloud doesn't retain your data after running a build.
* **Can Harness CI Cloud securely connect to my complex and private firewalled infrastructure?** Yes. You can use Secure Connect for Harness CI Cloud to connect to your private assets through a secure tunnel.
* **Can I prove that Harness CI Cloud is secure so I can get it approved quickly by the required stakeholders (security team, ARB, DevOps platform team, infrastructure teams, and so on)?** Yes. Harness CI Cloud has been penetration tested by external experts, and it is [ISO and SOC2](https://trust.harness.io/) certified. If you're already using Harness CI Cloud, additional approval isn't needed to enable Secure Connect to connect to your firewalled assets.

## What is Secure Connect for Harness Cloud

With Secure Connect for Harness CI Cloud, you can connect to your sensitive assets through a secure tunnel. This allows you to use Harness Cloud build infrastructure with privately-hosted assets, such as internal artifacts repositories and on-premises code repositories. Secure Connect is a faster alternative to allowlisting IPs.

<DocImage path={require('/docs/continuous-integration/secure-ci/static/secure-connect-arch.png')} alt="Architecture of Secure Connect: establishes a secure tunnel from Harness Cloud to your private network, enabling access to internal code and artifact repositories."/>

You can [configure Secure Connect](#configure-secure-connect) in minutes. If you're already using Harness Cloud build infrastructure, you don't need additional approval to enable Secure Connect.

| Secure | Effective |
| ------ | --------- |
| <ul><li>Extension of your existing private infrastructure</li><li>Dedicated infrastructure</li><li>Encryption at rest and in transit</li><li>No passwords stored using OIDC</li><li>No customer assets stored in CI Cloud</li></ul> | <ul><li>Enable Secure Connect in one click</li><li>Doesn't require admin approval</li><li>Multi-cloud/on-prem support</li></ul> |

## Network Requirements for Secure Connect

To use Secure Connect, ensure the following network ports are open for outbound connections from your environment:

- **TCP port 7000**: Required for the control connection between the Secure Connect client and the Secure Connect server. This port must be open for the client to establish and maintain the secure tunnel.

**Sequence of events:**
The Secure Connect client contacts the server on port 7000 to request a dedicated port. Once established, any traffic sent to the Secure Connect server on that port will be forwarded to the appropriate client.

## Configure Secure Connect

:::note

- The client must support connection by proxy.
- Secure Connect Client is supported on macOS and Linux. 

:::

1. Create a [Harness API key](/docs/platform/automation/api/add-and-manage-api-keys) with at least `RBAC:core_pipeline_view` and `ABAC:All` permissions.

<Tabs>
<TabItem value="Kubernetes" label="Kubernetes" default>

2\. Deploy the following Kubernetes manifest by saving it as `secure-connect.yaml` in your firewalled environment, then run `kubectl apply -f secure-connect.yaml`. The placement of the client depends on which assets need to securely connect to Harness and your environment's network configuration. The client uses Basic authentication for security. If basic auth credentials are not specified in the manifest, Harness generates them using SHA256.

:::info
The API key must be base64-encoded before being added to the Secret.
:::

```yaml
---
apiVersion: v1
kind: Secret
metadata:
  name: secure-connect-api-key
type: Opaque
data:
  API_KEY: XXXXXXXXXX
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: secure-connect
  labels:
    app: secure-connect
spec:
  selector:
    matchLabels:
      app: secure-connect
  template:
    metadata:
      labels:
        app: secure-connect
    spec:
      automountServiceAccountToken: false
      restartPolicy: Always
      containers:
        - name: secure-connect
          image: harness/frpc-signed
          resources:
            requests:
              cpu: "2"
              memory: "4G"
            limits:
              cpu: "2"
              memory: "4G"
          env:
            - name: REMOTE_PORT
              value: "30001"
            - name: REMOTE_SERVER
              value: sc.harness.io
            - name: API_KEY
              valueFrom:
                secretKeyRef:
                  name: secure-connect-api-key
                  key: API_KEY
```

* `REMOTE_PORT` is any port from `30000` to `30099`.
* `REMOTE_SERVER` is typically `sc.harness.io`.
* `API_KEY` is a valid Harness API key.
* `USER_NAME` is user name used for basic authentication (optional)
* `USER_PASSWORD` is password used for basic authentication (optional)

</TabItem>
<TabItem value="Docker" label="Docker">

 2\. Use the following command to run the Docker client in your firewalled environment. Where you run the client depends on what assets need to securely connect to Harness and your environment's network configuration. The client uses Basic authentication for security. If basic auth details are not provided via the following command,harness generates them using SHA256.

```bash
docker run -it \
  -e REMOTE_PORT=ANY_PORT_FROM_30000_TO_30099 \
  -e REMOTE_SERVER=sc.harness.io \
  -e API_KEY=YOUR_HARNESS_API_KEY \
  -e USER_NAME=YOUR_AUTH_USERNAME \
  -e USER_PASSWORD=YOUR_AUTH_PASSWORD \
  harness/frpc-signed
```

* `REMOTE_PORT` is any port from `30000` to `30099`.
* `REMOTE_SERVER` is typically `sc.harness.io`.
* `API_KEY` is a valid Harness API key.
* `USER_NAME` is user name used for basic authentication (optional)
* `USER_PASSWORD` is password used for basic authentication (optional)

</TabItem>
</Tabs>

3\. Enable **Secure Connect** for each connector you use with Harness Cloud that needs to route through a secure tunnel. This setting is available in each connector's **Connect to Provider** settings.

   For example, if you need to connect to an on-premises code repository, you need to enable **Secure Connect** in your code repository connector's settings.

   Compatible connectors include:
   * [GitHub connectors](/docs/platform/connectors/code-repositories/ref-source-repo-provider/git-hub-connector-settings-reference)
   * [GitLab connectors](/docs/platform/connectors/code-repositories/ref-source-repo-provider/git-lab-connector-settings-reference)
   * [Bitbucket connectors](/docs/platform/connectors/code-repositories/ref-source-repo-provider/bitbucket-connector-settings-reference)
   * [Git connectors](/docs/platform/connectors/code-repositories/ref-source-repo-provider/git-connector-settings-reference)
   * [Docker connectors](/docs/platform/connectors/cloud-providers/ref-cloud-providers/docker-registry-connector-settings-reference)
   * [GCP connectors (GAR and GCS)](/docs/platform/connectors/cloud-providers/connect-to-google-cloud-platform-gcp)
   * [AWS connectors](/docs/platform/connectors/cloud-providers/add-aws-connector)
   * [JFrog connectors (Artifactory)](/docs/platform/connectors/cloud-providers/ref-cloud-providers/artifactory-connector-settings-reference)

### Use Secure Connect environment variables to route other clients

When you enable Secure Connect and your pipeline uses a connector that is configured with Secure Connect (for example, a git clone step), Harness sets two environment variables: `HARNESS_HTTP_PROXY` and `HARNESS_HTTPS_PROXY`.

> **Note:** The Secure Connect proxy environment variables are only available after the pipeline uses Secure Connect at least once (such as by accessing a connector that has Secure Connect enabled). After this, all subsequent steps in the pipeline will have access to these variables.

You can use these environment variables in cURL commands or other tools to tunnel requests through the established secure tunnel. For example, to access an internal or staging URL:

```bash
curl -x "$HARNESS_HTTPS_PROXY" https://example.com
```

Replace the example URL with the endpoint you want to route through the secure tunnel, such as a private Bitbucket domain (`https://bitbucket.myorg.com/`) or any internal/dev/QA resource accessible via the tunnel.
