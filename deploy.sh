

#!/bin/bash
# ================================================
# SeoulMate 自动化部署脚本
# 用法：./deploy.sh "commit message"
# ================================================

set -e  # 遇到错误立即退出

COMMIT_MSG="${1:-✨ Auto deploy: $(date +'%Y-%m-%d %H:%M:%S')}"

echo "🚀 SeoulMate 自动化部署开始..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. 检查工作区状态
echo ""
echo "📋 步骤 1/5: 检查 Git 状态..."
if [ -z "$(git status --porcelain)" ]; then 
    echo "   ✅ 工作区干净，无需提交"
    echo "   ℹ️  代码已是最新版本"
else
    echo "   📝 发现未提交的更改："
    git status --short
    
    # 2. 提交更改
    echo ""
    echo "📋 步骤 2/5: 提交更改..."
    git add .
    git commit -m "$COMMIT_MSG"
    echo "   ✅ 已提交: $COMMIT_MSG"
fi

# 3. 推送到 GitHub
echo ""
echo "📋 步骤 3/5: 推送到 GitHub..."
git push origin main
echo "   ✅ 已推送到 origin/main"

# 4. 等待 Vercel 部署
echo ""
echo "📋 步骤 4/5: 等待 Vercel 部署..."
echo "   ⏳ Vercel 正在自动部署（约需 30-60 秒）..."
sleep 5

# 5. 显示部署信息
echo ""
echo "📋 步骤 5/5: 部署完成！"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 访问你的网站："
echo "   主页:     https://website-kp0988367482-lang.vercel.app/"
echo "   Quiz:     https://website-kp0988367482-lang.vercel.app/quiz-korea-ready.html"
echo "   模板商店: https://website-kp0988367482-lang.vercel.app/notion-templates.html"
echo "   转化页面: https://website-kp0988367482-lang.vercel.app/benefits"
echo ""
echo "📊 查看部署状态："
echo "   https://vercel.com/tsai-hsiang-ens-projects/website"
echo ""
echo "✅ 部署流程完成！"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
