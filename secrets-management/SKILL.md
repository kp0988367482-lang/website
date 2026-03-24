---
name: secrets-management
description: Implement secure secrets management for CI/CD pipelines using Vault, AWS Secrets Manager, or native platform solutions. Use when handling sensitive credentials, rotating secrets, or securing CI/CD environments.
---

# Secrets Management

Use this skill when a pipeline needs sensitive credentials, certificate handling, secret rotation, or tighter access control.

## When to Use

- Store API keys, tokens, database passwords, or TLS material
- Remove hardcoded secrets from CI/CD configs
- Rotate secrets automatically or on a schedule
- Apply least-privilege access to build and deploy jobs
- Secure Kubernetes or multi-environment deployments

## Workflow

1. Inventory secrets by service, environment, and owner.
2. Choose the secret backend that fits the platform.
3. Retrieve secrets at runtime instead of committing them.
4. Scope access by environment, workload, and identity.
5. Mask logs and enable audit trails.
6. Add rotation and secret scanning before calling the work complete.

## Secret Store Selection

- HashiCorp Vault: best for centralized multi-platform secrets, dynamic credentials, and fine-grained policies.
- AWS Secrets Manager: best for AWS-native systems, rotation, and Terraform-backed infrastructure.
- Azure Key Vault: best for Azure-native secrets, certificates, HSM-backed keys, and RBAC.
- Google Secret Manager: best for GCP-native versioned secrets with IAM integration.
- Native platform secrets: acceptable for simple workflows or bootstrap values, but weaker than a dedicated store for larger systems.

## Guardrails

- Never commit secrets to git.
- Use different secrets per environment.
- Prefer short-lived credentials or OIDC-based access where possible.
- Mask secrets in logs and avoid echoing raw values.
- Enable audit logging on the secret backend.
- Document required secret names, owners, and rotation cadence.
- Run secret scanning in pre-commit or CI.

## References

- [vault-setup.md](./references/vault-setup.md) for Vault setup and GitHub or GitLab CI examples
- [aws-secrets-manager.md](./references/aws-secrets-manager.md) for AWS retrieval, Terraform, and rotation patterns
- [github-secrets.md](./references/github-secrets.md) for GitHub repository, organization, and environment secrets

## Common Patterns

### Runtime Injection

Prefer workload identity or OIDC to fetch secrets at runtime. If that is not possible, use the platform secret store and inject only the values needed for that job.

### Rotation

Follow `generate -> update store -> deploy consumers -> verify -> revoke old secret`. Automate this flow when the backend supports it.

### Kubernetes

Use External Secrets Operator when workloads in Kubernetes should consume secrets from Vault or a cloud-native secret manager.

### Scanning

Add secret scanning to both developer and CI paths. Treat findings as blockers unless proven false positives.
