#!/bin/bash

echo "🔧 Setting up Git hooks..."

mkdir -p .git/hooks

cat > .git/hooks/pre-commit << 'EOF'
#!/bin/sh

echo "🔍 Running pre-commit checks..."

echo "📝 Running ESLint..."
yarn lint
if [ $? -ne 0 ]; then
    echo "❌ ESLint found errors. Please fix them before committing."
    echo "💡 You can run 'yarn lint:fix' to automatically fix some issues."
    exit 1
fi
echo "✅ ESLint passed!"

echo "🧪 Running tests..."
yarn test:run
if [ $? -ne 0 ]; then
    echo "❌ Tests failed. Please fix them before committing."
    exit 1
fi
echo "✅ Tests passed!"

echo "🎉 All checks passed! Proceeding with commit..."
EOF

cat > .git/hooks/pre-push << 'EOF'
#!/bin/sh

echo "🚀 Running pre-push checks..."

echo "🏗️  Running build check..."
yarn build
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the issues before pushing."
    exit 1
fi
echo "✅ Build passed!"

echo "🎉 All pre-push checks passed! Proceeding with push..."
EOF

chmod +x .git/hooks/pre-commit
chmod +x .git/hooks/pre-push

echo "✅ Git hooks configured successfully!"
echo ""
echo "📋 Installed hooks:"
echo "  - pre-commit: Runs lint and tests before each commit"
echo "  - pre-push: Runs build check before each push"
echo ""
echo "💡 To temporarily disable a hook:"
echo "  git commit --no-verify"
echo "  git push --no-verify" 