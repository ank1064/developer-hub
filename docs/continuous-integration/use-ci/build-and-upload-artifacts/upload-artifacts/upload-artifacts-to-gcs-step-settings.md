---
title: Upload Artifacts to GCS
description: Add a step to upload artifacts to Google Cloud Storage.
sidebar_position: 11
helpdocs_topic_id: 3qeqd8pls7
helpdocs_category_id: 4xo13zdnfx
helpdocs_is_private: false
helpdocs_is_published: true
redirect_from:
  - /docs/continuous-integration/use-ci/build-and-upload-artifacts/upload-artifacts-to-gcs-step-settings
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

You can use the **Upload Artifacts to GCS** step in your CI pipelines to upload artifacts to Google Cloud Storage (GCS). For more information on GCS, go to the Google Cloud documentation on [Uploads and downloads](https://cloud.google.com/storage/docs/uploads-downloads).

You need:

* Access to a GCS instance.
* A [CI pipeline](../../prep-ci-pipeline-components.md) with a [Build stage](../../set-up-build-infrastructure/ci-stage-settings.md).
* Steps in your pipeline that generate artifacts to upload, such as by running tests or building code. The steps you use depend on what artifacts you ultimately want to upload.
* A [GCP connector](#gcp-connector).

You can also [upload artifacts to S3](./upload-artifacts-to-s3.md), [upload artifacts to JFrog](./upload-artifacts-to-jfrog.md), and [upload artifacts to Sonatype Nexus](./upload-artifacts-to-sonatype-nexus.md).

## Add an Upload Artifacts to GCS step

In your pipeline's **Build** stage, add an **Upload Artifacts to GCS** step and configure the [settings](#upload-artifacts-to-gcs-step-settings) accordingly.

Here is a YAML example of a minimum **Upload Artifacts to GCS** step.

```yaml
- step:
    type: GCSUpload
    name: upload report
    identifier: upload_report
    spec:
      connectorRef: YOUR_GCP_CONNECTOR_ID
      bucket: YOUR_GCS_BUCKET
      sourcePath: path/to/source
      target: path/to/upload/location
```

### Upload Artifacts to GCS step settings

The **Upload Artifacts to GCS** step has the following settings. Depending on the stage's build infrastructure, some settings might be unavailable or optional. Settings specific to containers, such as **Set Container Resources**, are not applicable when using a VM or Harness Cloud build infrastructure.

#### Name

Enter a name summarizing the step's purpose. Harness automatically assigns an **Id** ([Entity Identifier](/docs/platform/references/entity-identifier-reference.md)) based on the **Name**. You can change the **Id**.

#### GCP Connector

The Harness connector for the GCP account where you want to upload the artifact. For more information, go to [Google Cloud Platform (GCP) connector settings reference](/docs/platform/connectors/cloud-providers/ref-cloud-providers/gcs-connector-settings-reference). This step supports GCP connectors that use access key authentication. It does not support GCP connectors that inherit delegate credentials.

#### Bucket

The GCS destination bucket name.

#### Source Path

Path to the file or directory that you want to upload.

You can also use glob patterns in the **Source Path** to match multiple files or file types. For example:

```yaml
sourcePath: dist/*.zip       # Upload all ZIP files in the dist directory
ignore: "*.tmp"              # Exclude temporary files
```

If you want to upload a compressed file, you must use a [Run step](../../run-step-settings.md) to compress the artifact before uploading it.

#### Target

Provide a path, relative to the **Bucket**, where you want to store the artifact. Do not include the bucket name; you specified this in **Bucket**.

If you don't specify a **Target**, Harness uploads the artifact to the bucket's main directory.

#### Run as User

Specify the user ID to use to run all processes in the pod, if running in containers. For more information, go to [Set the security context for a pod](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/#set-the-security-context-for-a-pod).

#### Set container resources

Set maximum resource limits for the resources used by the container at runtime:

* **Limit Memory:** The maximum memory that the container can use. You can express memory as a plain integer or as a fixed-point number using the suffixes `G` or `M`. You can also use the power-of-two equivalents `Gi` and `Mi`. The default is `500Mi`.
* **Limit CPU:** The maximum number of cores that the container can use. CPU limits are measured in CPU units. Fractional requests are allowed; for example, you can specify one hundred millicpu as `0.1` or `100m`. The default is `400m`. For more information, go to [Resource units in Kubernetes](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#resource-units-in-kubernetes).

#### Timeout

Set the timeout limit for the step. Once the timeout limit is reached, the step fails and pipeline execution continues. To set skip conditions or failure handling for steps, go to:

* [Step Skip Condition settings](/docs/platform/pipelines/step-skip-condition-settings.md)
* [Step Failure Strategy settings](/docs/platform/pipelines/failure-handling/define-a-failure-strategy-on-stages-and-steps)

## View artifacts on the Artifacts tab

You can use the [Artifact Metadata Publisher plugin](https://github.com/drone-plugins/artifact-metadata-publisher) to publish artifacts to the [Artifacts tab](../../viewing-builds.md). To do this, add a [Plugin step](../../use-drone-plugins/plugin-step-settings-reference.md) after the **Upload Artifacts to GCS** step.

<Tabs>
  <TabItem value="Visual" label="Visual">

Configure the **Plugin** step settings as follows:

* **Name:** Enter a name.
* **Container Registry:** Select a Docker connector.
* **Image:** Enter `plugins/artifact-metadata-publisher`.
* **Settings:** Add the following two settings as key-value pairs.
  * `file_urls`: Provide a GCS URL that uses the **Bucket**, **Target**, and artifact name specified in the **Upload Artifacts to GCS** step, such as `https://storage.googleapis.com/GCS_BUCKET_NAME/TARGET_PATH/ARTIFACT_NAME_WITH_EXTENSION`. If you uploaded multiple artifacts, you can provide a list of URLs.
  * `artifact_file`: Provide any `.txt` file name, such as `artifact.txt` or `url.txt`. This is a required setting that Harness uses to store the artifact URL and display it on the **Artifacts** tab. This value is not the name of your uploaded artifact, and it has no relationship to the artifact object itself.

</TabItem>
  <TabItem value="YAML" label="YAML" default>

Add a `Plugin` step that uses the `artifact-metadata-publisher` plugin.

```yaml
- step:
   type: Plugin
   name: publish artifact metadata
   identifier: publish_artifact_metadata
   spec:
     connectorRef: YOUR_IMAGE_REGISTRY_CONNECTOR
     image: plugins/artifact-metadata-publisher
     settings:
       file_urls: https://storage.googleapis.com/GCS_BUCKET_NAME/TARGET_PATH/ARTIFACT_NAME_WITH_EXTENSION
       artifact_file: artifact.txt
```

* `connectorRef`: Use the built-in Docker connector (`account.harness.Image`) or specify your own Docker connector.
* `image`: Must be `plugins/artifact-metadata-publisher`.
* `file_urls`: Provide a GCS URL that uses the `bucket`, `target`, and artifact name specified in the **Upload Artifacts to GCS** step, such as `https://storage.googleapis.com/GCS_BUCKET_NAME/TARGET_PATH/ARTIFACT_NAME_WITH_EXTENSION`. If you uploaded multiple artifacts, you can provide a list of URLs.
* `artifact_file`: Provide any `.txt` file name, such as `artifact.txt` or `url.txt`. This is a required setting that Harness uses to store the artifact URL and display it on the **Artifacts** tab. This value is not the name of your uploaded artifact, and it has no relationship to the artifact object itself.

</TabItem>
</Tabs>

## Build logs and artifact files

When you run the pipeline, you can observe the step logs on the [build details page](../../viewing-builds.md). If the Upload Artifacts step succeeds, you can find the artifact on GCS. If you used the Artifact Metadata Publisher plugin, you can find the artifact URL on the [Artifacts tab](../../viewing-builds.md).

:::tip

On the **Artifacts** tab, select the step name to expand the list of artifact links associated with that step.

If your pipeline has multiple steps that upload artifacts, use the dropdown menu on the **Artifacts** tab to switch between lists of artifacts uploaded by different steps.

<!-- ![](../static/artifacts-tab-with-link.png) -->

<DocImage path={require('../static/artifacts-tab-with-link.png')} />

:::

## Pipeline YAML examples

<Tabs>
  <TabItem value="hosted" label="Harness Cloud" default>

This example pipeline uses [Harness Cloud build infrastructure](/docs/continuous-integration/use-ci/set-up-build-infrastructure/use-harness-cloud-build-infrastructure). It produces test reports, uploads the reports to GCS, and uses the Artifact Metadata Publisher to publish the artifact URL on the **Artifacts** tab.

```yaml
pipeline:
  name: default
  identifier: default
  projectIdentifier: default
  orgIdentifier: default
  tags: {}
  properties:
    ci:
      codebase:
        connectorRef: YOUR_CODEBASE_CONNECTOR_ID
        repoName: YOUR_CODE_REPO_NAME
        build: <+input>
  stages:
    - stage:
        name: test and upload artifact
        identifier: test_and_upload_artifact
        description: ""
        type: CI
        spec:
          cloneCodebase: true
          platform:
            os: Linux
            arch: Amd64
          runtime:
            type: Cloud
            spec: {}
          execution:
            steps:
              - step: ## Generate test reports.
                  type: Test
                  name: runTestsWithIntelligence
                  identifier: runTestsWithIntelligence
                  spec:
                    connectorRef: account.GCR
                    image: maven:3-openjdk-8
                    command: mvn test -Dmaven.test.failure.ignore=true -DfailIfNoTests=false
                    shell: Sh
                    intelligenceMode: true
                    reports:
                      - "target/surefire-reports/*.xml"
              - step: ## Upload reports to GCS.
                  type: GCSUpload
                  name: upload report
                  identifier: upload_report
                  spec:
                    connectorRef: YOUR_GCP_CONNECTOR_ID
                    bucket: YOUR_GCS_BUCKET
                    sourcePath: dist/*.zip  # Supports glob patterns
                    target: <+pipeline.sequenceId>
              - step: ## Show artifact URL on the Artifacts tab.
                  type: Plugin
                  name: publish artifact metadata
                  identifier: publish_artifact_metadata
                  spec:
                    connectorRef: YOUR_IMAGE_REGISTRY_CONNECTOR
                    image: plugins/artifact-metadata-publisher
                    settings:
                      file_urls: https://storage.googleapis.com/YOUR_GCS_BUCKET/<+pipeline.sequenceId>/surefure-reports/
                      artifact_file: artifact.txt
```

</TabItem>
  <TabItem value="k8s" label="Self-managed">

This example pipeline uses a [Kubernetes cluster build infrastructure](/docs/category/set-up-kubernetes-cluster-build-infrastructures). It produces test reports, uploads the reports to GCS, and uses the Artifact Metadata Publisher to publish the artifact URL on the **Artifacts** tab.

```yaml
pipeline:
  name: allure-report-upload
  identifier: allurereportupload
  projectIdentifier: YOUR_HARNESS_PROJECT_ID
  orgIdentifier: default
  tags: {}
  properties:
    ci:
      codebase:
        connectorRef: YOUR_CODEBASE_CONNECTOR_ID
        repoName: YOUR_CODE_REPO_NAME
        build: <+input>
  stages:
    - stage:
        name: build
        identifier: build
        description: ""
        type: CI
        spec:
          cloneCodebase: true
          infrastructure:
            type: KubernetesDirect
            spec:
              connectorRef: YOUR_KUBERNETES_CLUSTER_CONNECTOR_ID
              namespace: YOUR_KUBERNETES_NAMESPACE
              automountServiceAccountToken: true
              nodeSelector: {}
              os: Linux
          execution:
            steps:
              - step: ## Generate test reports.
                  type: Test
                  name: runTestsWithIntelligence
                  identifier: runTestsWithIntelligence
                  spec:
                    connectorRef: account.GCR
                    image: maven:3-openjdk-8
                    command: mvn test -Dmaven.test.failure.ignore=true -DfailIfNoTests=false
                    shell: Sh
                    intelligenceMode: true
                    reports:
                      - "target/surefire-reports/*.xml"
              - step: ## Upload reports to GCS.
                  type: GCSUpload
                  name: upload report
                  identifier: upload_report
                  spec:
                    connectorRef: YOUR_GCP_CONNECTOR_ID
                    bucket: YOUR_GCS_BUCKET
                    sourcePath: dist/*.zip  # Supports glob patterns
                    target: <+pipeline.sequenceId>
              - step: ## Show artifact URL on the Artifacts tab.
                  type: Plugin
                  name: publish artifact metadata
                  identifier: publish_artifact_metadata
                  spec:
                    connectorRef: YOUR_IMAGE_REGISTRY_CONNECTOR
                    image: plugins/artifact-metadata-publisher
                    settings:
                      file_urls: https://storage.googleapis.com/YOUR_GCS_BUCKET/<+pipeline.sequenceId>/surefire-reports/
                      artifact_file: artifact.txt
```

</TabItem>
</Tabs>

## Download Artifacts from GCS

The **Upload Artifacts to GCS** step uses the [GCS Drone plugin](https://github.com/drone-plugins/drone-gcs). While the plugin’s default behavior is to upload files from the local harness build node to a specified GCS bucket, we can reverse this behavior for download purposes when needed.

### Modes of the GCS Drone Plugin

#### Default Operation (Upload Mode)
By default (i.e. when `download` is `false`), the Drone-gcs plugin uploads files. In this mode, it treats:

- `Source`: The local file system on the harness build node.
- `Target`: The destination GCS bucket (extracted from the `Target` configuration).

#### Download Mode
When the `Download` flag is set to `true`, the plugin reverses its behavior:

- `Source`: Now points to the GCS bucket (extracted from the `Source` configuration).
- `Target`: The local file system where files will be downloaded, as defined by the `Target` configuration.

### Download Options

You can download artifacts from GCS by:

- [Using the OOTB **Upload Artifacts to GCS** step](#use-the-ootb-step)
- [Using `plugins/gcs` in a **Plugin Step** to download](#use-a-plugin-step)

### Use the OOTB Step

The OOTB **Upload Artifacts to GCS** step in CI is designed to perform upload operations by default. However, since the Drone plugins/gcs plugin supports downloads when the `PLUGIN_DOWNLOAD` variable is set to true, you can simply pass this stage variable to switch the operation mode.

#### Configuration Steps

1. Create a [GCP Connector](/docs/platform/connectors/cloud-providers/connect-to-google-cloud-platform-gcp/).

  :::tip

  This works with an OIDC enabled connector as well. To learn more, go to [Configure GCP with OIDC](/docs/continuous-integration/secure-ci/configure-oidc-gcp-wif-ci-hosted)

  :::

2. Add a pipeline stage variable named `PLUGIN_DOWNLOAD` and set it `true`.
3. Configure the pipeline. Add the **Upload Artifacts to GCS** step and select the GCP connector you created. 

Example yaml:

```yaml
- stage:
    spec:
      execution:
        steps:
          - step:
              type: GCSUpload
              name: GCSUpload_1
              identifier: GCSUpload_1
              spec:
                connectorRef: gcp-oidc-connector
                bucket: bucketName
                sourcePath: YOUR_BUCKET_NAME/DIRECTORY
                target: path/to/download/destination
      variables:
        - name: PLUGIN_DOWNLOAD
          type: String
          description: ""
          required: false
          value: "true"
```

### Use a plugin step

The complete [Plugin step settings](../../use-drone-plugins/plugin-step-settings-reference.md) can be configured as follows:

| Keys | Type | Description | Value example |
| - | - | - | - |
| `connectorRef` | String | Select a [Docker connector](/docs/platform/connectors/cloud-providers/ref-cloud-providers/docker-registry-connector-settings-reference). | `YOUR_IMAGE_REGISTRY_CONNECTOR` |
| `image` | String | Enter `plugins/gcs`. | `plugins/gcs` |
| `token` | String | Reference to a [Harness text secret](/docs/platform/secrets/add-use-text-secrets) containing a GCP service account token to connect and authenticate to GCS. | `<+secrets.getValue("gcpserviceaccounttoken")>` |
| `source` | String | The directory or glob pattern to upload/download from your GCS bucket, specified as `BUCKET_NAME/DIRECTORY` or a glob. | `my_cool_bucket/artifacts` |
| `target` | String | Path to the location where you want to store the downloaded artifacts, relative to the build workspace. | `artifacts` (downloads to `/harness/artifacts`) |
| `ignore` | String | Glob pattern of files to exclude from the upload/download. | `"*.tmp"` |
| `download` | Boolean | Must be `true` to enable downloading. If omitted or `false`, the plugin attempts to upload artifacts instead. | `"true"` |

The `source` and `ignore` fields support glob patterns. For example:

```yaml
source: dist/*.zip       # Upload all ZIP files in dist directory
target: my-bucket/builds
ignore: "*.tmp"          # Exclude temporary files
```

For example:

```yaml
- step:
    type: Plugin
    name: download
    identifier: download
    spec:
      connectorRef: YOUR_DOCKER_CONNECTOR
      image: plugins/gcs
      settings:
        token: <+secrets.getValue("gcpserviceaccounttoken")>
        source: YOUR_BUCKET_NAME/DIRECTORY
        target: path/to/download/destination
        download: "true"
```

#### Use a plugin step with OIDC

To enable OIDC authentication and perform download operations, you need to enable the following feature flags:
- `CI_SKIP_NON_EXPRESSION_EVALUATION`
- `CI_ENABLE_OUTPUT_SECRETS`

Contact [Harness Support](mailto:support@harness.io) to enable these feature flags.

Then, create two plugin steps in your pipeline:

1. Token Generation Step: This step uses the `plugins/gcp-oidc` image to generate an OIDC token and export it as output variable.
2. Download Operation Step: This step uses the `plugins/gcs` image to perform the download, consuming the token generated in the previous step.

Below is an example configuration:

##### Plugin Step 1: Generate the OIDC token

```yaml
- step:
    type: Plugin
    name: generate-token
    identifier: generate-token
    spec:
      connectorRef: YOUR_IMAGE_REGISTRY_CONNECTOR
      image: plugins/gcp-oidc
      settings:
        project_id: 12345678
        pool_id: 12345678
        service_account_email_id: some-email@email.com
        provider_id: service-account1
        duration: 7200
```

##### Plugin Step 2: Execute the Download Operation

```yaml
- step:
    type: Plugin
    name: download
    identifier: download
    spec:
      connectorRef: YOUR_DOCKER_CONNECTOR
      image: plugins/gcs
      settings:
        token: <+steps.generate-token.output.outputVariables.GCLOUD_ACCESS_TOKEN>
        source: YOUR_BUCKET_NAME/DIRECTORY
        target: path/to/download/destination
        download: "true"
```

## Troubleshoot uploading artifacts

Go to the [CI Knowledge Base](/kb/continuous-integration/continuous-integration-faqs) for questions and issues related uploading artifacts, such as:

* [Can I send artifacts by email?](/kb/continuous-integration/continuous-integration-faqs/#can-i-send-emails-from-ci-pipelines)
* [How do I show content on the Artifacts tab?](/kb/continuous-integration/continuous-integration-faqs/#how-do-i-show-content-on-the-artifacts-tab)
