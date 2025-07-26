#!/bin/bash

echo "🔍 Running code quality checks..."

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

show_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
        exit 1
    fi
}

echo "📝 Running ESLint..."
yarn lint
show_result $? "ESLint completed"

echo "🧪 Running tests..."
yarn test:run
show_result $? "Tests completed"

echo "🔍 Checking types..."
yarn astro check
show_result $? "Type checking completed"

read -p "Do you want to run build check as well? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🏗️  Running build check..."
    yarn build
    show_result $? "Build completed"
fi

echo -e "${GREEN}🎉 All checks passed successfully!${NC}" 