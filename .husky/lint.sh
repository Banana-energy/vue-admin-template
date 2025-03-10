#!/bin/sh

echo "🔍 Running ESLint on all files..."

# 运行 ESLint 校验整个项目
npm run lint:eslint

# 如果 ESLint 失败，则阻止提交
if [ $? -ne 0 ]; then
  echo "❌ ESLint errors found. Commit aborted."
  exit 1
fi

echo "✅ ESLint passed. Proceeding with commit."
exit 0
