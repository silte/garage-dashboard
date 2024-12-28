# Garage Dashboard Helm Chart

<!-- NOTE: To update doctoc please run `npx doctoc ./helm/README.md --notitle` -->

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Pre-Installation Steps](#pre-installation-steps)
  - [Create Namespace](#create-namespace)
  - [Create Secrets](#create-secrets)
    - [`hassio-api-token`](#hassio-api-token)
- [Prepare Helm](#prepare-helm)
- [Install or Upgrade the Helm Chart](#install-or-upgrade-the-helm-chart)
  - [With Image Tag](#with-image-tag)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Pre-Installation Steps

### Create Namespace

Create the namespace `garage-dashboard`:

```bash
kubectl create namespace garage-dashboard
```

### Create Secrets

#### `hassio-api-token`

Create a secret with the Home Assistant API token.

Use the command:

```bash
kubectl create secret generic hassio-api-token  \
    --from-literal=HASSIO_AUTH_TOKEN=<token>    \
    --namespace=garage-dashboard
```

## Prepare Helm

Update Helm dependencies:

```bash
helm repo add silte https://charts.silte.fi
helm repo update
```

## Install or Upgrade the Helm Chart

To install or upgrade the Helm chart:

```bash
helm upgrade --install              \
    garage-dashboard                \
    silte/nodejs                    \
    --values helm/values.yaml       \
    --values helm/values-local.yaml \
    --namespace garage-dashboard
```

### With Image Tag

To specify an image tag:

```bash
helm upgrade --install              \
    garage-dashboard                \
    silte/nodejs                    \
    --values helm/values.yaml       \
    --values helm/values-local.yaml \
    --namespace garage-dashboard    \
    --set image.tag=latest
```
