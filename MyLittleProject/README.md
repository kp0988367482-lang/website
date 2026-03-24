# MyLittle Project
A TODO list full-stack web application designed for development teams.

## Structure
- `.kiro/steering/` - AI context, standards
- `.kiro/hooks/` - Automated workflows
- `.kiro/specs/` - Feature specs (requirements, design, tasks)
- `.vscode/mcp.json`, `.cursor/mcp.json` - MCP configs

## Prerequisites
1. **uv**: `curl -LsSf https://astral.sh/uv/install.sh | sh`
2. **Python 3.12**: `uv python install 3.12`
3. **AWS CLI**: Configured
4. **Node.js**: 20+

### AWS Setup
```bash
aws configure --profile default
export AWS_PROFILE=default
export AWS_REGION=us-east-1
```

## Getting Started
```bash
# Install
npm install
# Configure
cp .env.example .env
# Verify MCPs
timeout 15s uvx awslabs.aws-api-mcp-server@latest 2>&1 || echo "OK"
```

## Workflow
### Spec-Driven Development
1. Create spec in AI assistant
2. Requirements → Design → Tasks
3. Execute tasks
4. Iterate
