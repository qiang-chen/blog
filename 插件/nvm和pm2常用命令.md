---
title: nvm和pm2常用命令
date: 2024-11-01
tags:
  - 插件
---

## nvm

```js
1. nvm install <version>
•  下载并安装指定版本的Node.js。<version>可以是具体的版本号，如14.17.0，或者特殊关键词如latest或latest-npm。
2. nvm use <version>
•  切换到已经安装的某个Node.js版本。
3. nvm ls 或 nvm list
•  列出所有已安装的Node.js版本。
4. nvm ls-remote 或 nvm list-remote
•  列出远程可用的Node.js版本，这些是NVM可以下载和安装的版本。
5. nvm uninstall <version>
•  卸载指定版本的Node.js。
6. nvm current
•  显示当前正在使用的Node.js版本。
7. nvm alias <alias> <version>
•  创建一个Node.js版本的别名，例如nvm alias default 14.17.0。
8. nvm on
•  启用NVM的自动激活功能，当进入项目目录时自动使用该项目的.nvmrc文件指定的Node.js版本。
9. nvm off
•  禁用NVM的自动激活功能。
10. nvm --version 或 nvm -v
•  显示NVM自身的版本。
11. nvm node_mirror <url>
•  设置Node.js的下载镜像，通常用于提高下载速度，特别是对于非美国地区的用户。
12. nvm npm_mirror <url>
•  设置NPM包的下载镜像。
13. nvm exec <version> <command>
•  使用指定版本的Node.js执行命令。
14. nvm run <version> <script>
•  使用指定版本的Node.js运行脚本。
15. nvm prune
•  清理不再存在的Node.js版本的软链接。
16. nvm help 或 nvm --help
•  显示NVM的帮助信息。
17. nvm install-latest-npm
•  安装最新的NPM版本，这通常是在安装特定Node.js版本后使用，以确保NPM是最新的。
这些命令可以帮助你有效地管理和使用多个Node.js版本，适应不同的项目需求。
```

## pm2

```js
1. pm2 start <script>
•  启动一个应用。<script> 是应用的入口文件，如 app.js 或 bin/www。
2. pm2 start <script> -i <instances>
•  以集群模式启动应用，<instances> 表示要启动的应用实例数。
3. pm2 start <script> --name "<name>"
•  启动应用并给它一个特定的名字。
4. pm2 start <script> --watch
•  启动应用并监视文件更改，当文件更改时自动重启应用。
5. pm2 stop <id|name>
•  停止一个应用，<id|name> 可以是应用的 ID 或名称。
6. pm2 restart <id|name>
•  重启一个应用。
7. pm2 delete <id|name>
•  删除一个应用的进程和配置。
8. pm2 list 或 pm2 ls
•  列出所有正在运行的应用。
9. pm2 show <id|name>
•  显示一个应用的详细信息。
10. pm2 logs <id|name> 或 pm2 log <id|name>
•  显示一个应用的日志。
11. pm2 flush
•  清空所有应用的日志文件。
12. pm2 monit
•  监控所有应用的 CPU 和内存使用情况。
13. pm2 update
•  保存当前进程，终止 PM2，然后重新启动，通常用于更新 PM2 的版本。
14. pm2 save
•  保存当前运行的应用列表和环境变量到 PM2 的配置中。
15. pm2 resurrect
•  加载之前保存的应用列表和环境变量，恢复之前的状态。
16. pm2 startup
•  创建开机自启动的脚本，确保应用在系统启动时自动启动。
17. pm2 ecosystem
•  生成一个 ecosystem.config.js 文件，用于配置多个应用的启动。
18. pm2 gracefulReload <id|name>
•  以优雅的方式重新加载应用，适用于集群模式。
19. pm2 scale <name> <num_instances>
•  调整应用的实例数量。
20. pm2 env <id|name>
•  显示应用的环境变量。
21. pm2 set <id|name> <key> <value>
•  设置应用的环境变量。
22. pm2 unset <id|name> <key>
•  移除应用的环境变量。
```