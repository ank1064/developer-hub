---
title: Generate and Attest SBOM with Harness GitHub Actions
description: Generate and Attest SBOM with Harness Github Actions
sidebar_position: 11
sidebar_label: Generate SBOM with Harness GitHub Actions
redirect_from:

- /docs/software-supply-chain-assurance/sbom/generate-sbom-with-github-actions
---

[Harness GitHub Actions](https://github.com/marketplace/actions/harness-github-actions) provide a seamless way to integrate Harness's Software Supply Chain Security (SCS) capabilities directly into GitHub workflows. You can use this GitHub Action to perform various supply chain security tasks. 
The Harness GitHub Action includes multiple sub-actions, each designed for specific tasks. This document focuses on the `harness/github-actions/sbom-generation` sub-action, which is used to generate an SBOM and attest it if needed.

The `harness/github-actions/sbom-generation` is responsible for generating the Software Bill of Materials (SBOM) and optionally attesting it. The generated SBOM is saved to the SCS module and can be found in the [**Artifact**](/docs/software-supply-chain-assurance/artifact-security/overview) section. If attestation is enabled, the SBOM attestation will be signed, and the `.att` attestation file will be pushed to the configured container registry.

import NotesForKeysAndVault from '/docs/software-supply-chain-assurance/shared/note-key-gen-vault-support.md';

:::info
<NotesForKeysAndVault />
:::

### Requirements

import GHActionReq from '/docs/software-supply-chain-assurance/shared/requirements-gh-actions.md';

<GHActionReq />

### Usage Example

```yaml
- name: SBOM Generation
  uses: harness/github-actions/sbom-generation@1.1.0
  with:
    HARNESS_ACCOUNT_URL: https://myaccount.harness.io
    HARNESS_ACCOUNT_ID: my_account_id_9YpRharzPs
    HARNESS_ORG_ID: my_org_id_default
    HARNESS_PROJECT_ID: example_project_id
    HARNESS_API_KEY: ${{ secrets.API_KEY_SAVED_AS_GH_SECRET }}
    VAULT_ADDR: ${{ secrets.VAULT_URL }}
    TARGET: example_image:image_tag
    TOOL: Syft
    FORMAT: spdx-json
    ATTEST: true
    KMS_KEY: path_to_my_key_in_vault
```

### Configuration

Make sure to include the required configurations from the [Requirements](#requirements) section in your workflow. Below are the specific configurations for the `sbom-generation` sub-action.

| **Key**         | **Value Example**       | **Description**                                            | **Required** |
|-----------------|-------------------------|------------------------------------------------------------|-------------|
| `TOOL`         | `Syft` or `cdxgen`        | The tool used to generate the SBOM.                        | Yes         |
| `FORMAT`       | `spdx-json` or `cyclonedx`| The format of the generated SBOM.                          | Yes         |
| `TARGET`       | `image_name:image_tag`  | The target artifact (Docker image) for SBOM generation.    | Yes         |
| `ATTEST`       | `true` or `false`         | Boolean flag to determine if attestation is required.      | No          |
| `KMS_KEY`      | `path/to/my/key`        | Path to the Private key used for signing the attestation.          | No          |

### Sample workflow

Here's a sample workflow using the `harness/github-actions/sbom-generation`

```yaml

name: Workflow for SBOM Generation Action

on:
  push:
    branches: [main]

jobs:
  combined-workflow:
    runs-on: ubuntu-latest

    steps:
      # Step 1: Checkout the main repository
      - name: Checkout Main Repository
        uses: actions/checkout@v3

      # Step 2: Clone Additional Repository
      - name: Clone Additional Repository
        run: |
          git clone https://github.com/lavakush07/easybuggy-vulnerable-application
          echo "Cloned additional repository: docker-nginx"

      # Step 3: Log in to Docker Hub
      - name: Log in to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Set Vault Environment Variables
        run: |
          echo "DOCKER_USERNAME=${{ secrets.DOCKER_USERNAME }}" >> $GITHUB_ENV
          echo "DOCKER_PASSWORD=${{ secrets.DOCKER_PASSWORD }}" >> $GITHUB_ENV

      # Step 4: Build and Tag Docker Image
      - name: Build and Tag Docker Image
        run: |
          cd <repo-name>
          docker build -t <image-name>:<tag> .
          echo "Docker image built and tagged as <image-name>:<tag>"

      # Step 5: Push the Docker Image to Docker Hub
      - name: Push Docker Image
        run: |
          docker push <image-name>:<tag>
          echo "Docker image pushed to Docker Hub"

      # Step 6: Log in to Vault
      - name: Log in to Vault
        uses: hashicorp/vault-action@v2
        id: vault_login
        with:
          url: ${{ secrets.VAULT_URL }}
          method: token
          token: ${{ secrets.VAULT_TOKEN }}

      # Step 7: Set Vault Environment Variables
      - name: Set Vault Environment Variables
        run: |
          echo "VAULT_ADDR=${{ secrets.VAULT_URL }}" >> $GITHUB_ENV
          echo "VAULT_TOKEN=${{ steps.vault_login.outputs.token }}" >> $GITHUB_ENV

      # Step 8: Retrieve KMS key (Cosign) from Vault
    
      - name: Retrieve Cosign Public Key from Vault
        run: |
          export COSIGN_KEY=$(vault kv get -field=public_key -mount="secret1/cosign-key" "cosign-key")
          echo "COSIGN_KEY=$COSIGN_KEY" >> $GITHUB_ENV

      - name: Verify Vault Login and Print Token
        run: |
          echo "Vault login successful."
          echo "Vault Token: ${{ steps.vault_login.outputs.token }}"
        env:
          VAULT_TOKEN: ${{ steps.vault_login.outputs.token }}  # Ensuring token is accessible

      # Step 9: Set Vault Environment Variables
      - name: Set Vault Environment Variables
        run: |
          echo "VAULT_ADDR=${{ secrets.VAULT_URL }}" >> $GITHUB_ENV
          echo "VAULT_TOKEN=${{ secrets.VAULT_TOKEN }}" >> $GITHUB_ENV

      # # Step 10: Run SBOM Orchestration Action
      - name: SBOM Generation
        uses: harness/github-actions/sbom-generation@1.1.0
        with:
           HARNESS_ACCOUNT_URL: https://app.harness.io
           HARNESS_ACCOUNT_ID: vpCkHKsDSxK9_KYfjCTMKA
           HARNESS_ORG_ID: SCS
           HARNESS_PROJECT_ID: Exploratory
           HARNESS_API_KEY: ${{ secrets.SCS_API_KEY }}
           TARGET: <image-name>:<tag>
           VERIFY: true
           KMS_KEY: 'vault-key'

```

To verify the generated SBOM and enforce policies on it, refer to [Enforce SBOM Policies with GitHub Actions](/docs/software-supply-chain-assurance/open-source-management/sbom-github-actions/enforce-sbom-policies-with-github-actions) documentation.