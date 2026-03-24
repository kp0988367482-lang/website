# AWS Secrets Manager

Use this reference when the workload already runs in AWS or Terraform.

## Store a Secret

```bash
aws secretsmanager create-secret \
  --name production/database/password \
  --secret-string "super-secret-password"
```

## Retrieve in GitHub Actions

```yaml
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    aws-region: us-west-2

- name: Get secret from AWS
  run: |
    SECRET=$(aws secretsmanager get-secret-value \
      --secret-id production/database/password \
      --query SecretString \
      --output text)
    echo "::add-mask::$SECRET"
    echo "DB_PASSWORD=$SECRET" >> $GITHUB_ENV
```

Prefer OIDC or role assumption instead of static AWS keys when GitHub Actions is the caller.

## Terraform Pattern

```hcl
data "aws_secretsmanager_secret_version" "db_password" {
  secret_id = "production/database/password"
}

resource "aws_db_instance" "main" {
  allocated_storage = 100
  engine            = "postgres"
  instance_class    = "db.t3.large"
  username          = "admin"
  password          = jsondecode(data.aws_secretsmanager_secret_version.db_password.secret_string)["password"]
}
```

## Rotation Pattern

Automated rotation usually follows this sequence:

1. Read the current secret version.
2. Generate a new secret value.
3. Update the downstream system.
4. Write the new secret version.
5. Verify consumers can authenticate.
6. Revoke the old credential.
