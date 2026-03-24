# Vault Setup

Use this reference when the chosen backend is HashiCorp Vault.

## Local Development

```bash
vault server -dev
export VAULT_ADDR='http://127.0.0.1:8200'
export VAULT_TOKEN='root'
vault secrets enable -path=secret kv-v2
vault kv put secret/database/config username=admin password=secret
```

Do not use the dev server in production. Use proper storage, TLS, auth methods, and policies.

## GitHub Actions

```yaml
name: Deploy with Vault Secrets

on: [push]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Import Secrets from Vault
        uses: hashicorp/vault-action@v2
        with:
          url: https://vault.example.com:8200
          token: ${{ secrets.VAULT_TOKEN }}
          secrets: |
            secret/data/database username | DB_USERNAME ;
            secret/data/database password | DB_PASSWORD ;
            secret/data/api key | API_KEY
```

## GitLab CI

```yaml
deploy:
  image: vault:latest
  before_script:
    - export VAULT_ADDR=https://vault.example.com:8200
    - export VAULT_TOKEN=$VAULT_TOKEN
    - apk add curl jq
  script:
    - DB_PASSWORD=$(vault kv get -field=password secret/database/config)
    - API_KEY=$(vault kv get -field=key secret/api/credentials)
    - echo "Deploying with secrets..."
```

## Best Practices

- Use Vault auth methods instead of long-lived root tokens.
- Scope policies to the smallest path set possible.
- Prefer dynamic secrets for databases and cloud providers.
- Enable audit devices and review access regularly.
