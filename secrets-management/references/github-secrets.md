# GitHub Secrets

Use this reference when secrets stay inside GitHub Actions rather than an external manager.

## Secret Types

- Repository secrets for repo-scoped automation
- Organization secrets for shared values across multiple repos
- Environment secrets for stage-specific deployments and approvals

## Usage

```yaml
- name: Use GitHub secret
  run: |
    echo "API Key: ${{ secrets.API_KEY }}"
    echo "Database URL: ${{ secrets.DATABASE_URL }}"
```

## Environment Secrets

```yaml
deploy:
  runs-on: ubuntu-latest
  environment: production
  steps:
    - name: Deploy
      run: echo "Deploying with ${{ secrets.PROD_API_KEY }}"
```

## Guardrails

- Prefer environment secrets for production deployment values.
- Use environment protection rules for approvals.
- Mask any derived values written to logs.
- Rotate repository secrets when staff or system boundaries change.
- Prefer OIDC-backed federation over storing long-lived cloud credentials in GitHub.
