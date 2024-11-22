---
title: Jenkins自动化部署前端shell脚本
date: 2024-11-22
tags:
  - 小问题
---

```shell
#!/bin/bash

# 定义变量
REPO_URL="https://gitee.com/yulin-chen/test_demo.git"    # 你的代码仓库URL
PROJECT_NAME="test_demo"    # 项目名称
BUILD_DIR="/var/lib/jenkins/workspace/${PROJECT_NAME}" # Jenkins工作空间目录
DEPLOY_DIR="/www/wwwroot/test" # 部署目录，确保这个目录存在且有权限
CACHE_DIR="/var/lib/jenkins/cache/${PROJECT_NAME}" # 项目特定的缓存目录

# 确保缓存目录存在
mkdir -p ${CACHE_DIR}

# 步骤1: 清理工作空间
echo "清理工作空间..."
rm -rf ${BUILD_DIR}/*
if [ $? -ne 0 ]; then
    echo "清理工作空间失败"
    exit 1
fi

# 步骤2: 拉取代码
echo "正在从 $REPO_URL 拉取代码..."
cd ${BUILD_DIR}
if [ $? -ne 0 ]; then
    echo "切换到工作空间目录失败"
    exit 1
fi
git init
if [ $? -ne 0 ]; then
    echo "Git初始化失败"
    exit 1
fi
if ! git remote | grep -q "origin"; then
    git remote add origin $REPO_URL
    if [ $? -ne 0 ]; then
        echo "添加远程仓库失败"
        exit 1
    fi
fi
git fetch origin
if [ $? -ne 0 ]; then
    echo "从远程仓库获取数据失败"
    exit 1
fi
git reset --hard origin/master
if [ $? -ne 0 ]; then
    echo "重置本地仓库到远程仓库失败"
    exit 1
fi

# 步骤3: 检查依赖是否需要更新
echo "正在检查依赖是否需要更新..."
if [ -f "${CACHE_DIR}/package-lock.json" ] && [ -f "${BUILD_DIR}/package-lock.json" ]; then
    diff_output=$(diff ${CACHE_DIR}/package-lock.json ${BUILD_DIR}/package-lock.json)
    if [ -n "${diff_output}" ]; then
        echo "package-lock.json 有差异，需要更新依赖:"
        # echo "${diff_output}"
        # 更新缓存
        cp ${BUILD_DIR}/package-lock.json ${CACHE_DIR}/package-lock.json
        cp -R ${BUILD_DIR}/node_modules ${CACHE_DIR}/
        npm install
        if [ $? -ne 0 ]; then
            echo "安装依赖失败"
            exit 1
        fi
    else
        echo "package-lock.json 无差异，跳过依赖安装"
        # 从缓存中恢复 node_modules
        cp -R ${CACHE_DIR}/node_modules ${BUILD_DIR}/
    fi
else
    echo "缓存中不存在 package-lock.json 或本地 package-lock.json，需要更新依赖"
    npm install
    if [ $? -ne 0 ]; then
        echo "安装依赖失败"
        exit 1
    fi
    cp ${BUILD_DIR}/package-lock.json ${CACHE_DIR}/package-lock.json
    cp -R ${BUILD_DIR}/node_modules ${CACHE_DIR}/
fi

# 步骤4: 构建项目
echo "正在构建项目..."
npm run build
if [ $? -ne 0 ]; then
    echo "构建项目失败"
    exit 1
fi

# 步骤5: 检查部署目录
echo "检查部署目录..."
if [ ! -d "$DEPLOY_DIR" ]; then
    echo "部署目录不存在，正在创建..."
    mkdir -p $DEPLOY_DIR
    if [ $? -ne 0 ]; then
        echo "创建部署目录失败"
        exit 1
    fi
fi

# 步骤6: 部署项目
echo "正在部署项目..."
if [ -d "dist" ]; then
    cp -R dist/* $DEPLOY_DIR
    if [ $? -ne 0 ]; then
        echo "部署项目失败"
        exit 1
    fi
else
    echo "构建输出目录不存在"
    exit 1
fi

# 完成
echo "部署完成！"
exit 0
```