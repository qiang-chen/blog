---
title: 自动修改env方式
date: 2024-10-12
tags:
  - 小问题
---

> 前言 ：公司环境特别多的时候，每次启动个项目又要改env文件又要改.gitlab-ci.yml文件的，太费劲了。。。。

因此 我们可以选择在启动的时候自动选择环境后去启动相应的服务

```js
 "dev": "node ./scripts/dev.mjs",
```
 
对应dev.mjs的脚本如下

```js
import inquirer from 'inquirer';
import fs from 'node:fs';
import path from 'node:path';
import childProcess from 'node:child_process';
import yaml from 'js-yaml';
import { set } from 'lodash-es';

const IP_MAP = {
    dev: '公司dev的IP',
    test: '公司test的IP'
};

const GIT_RUNNER_IP_MAP = {
    dev_cn: 'dev的git IP',
    test_cn: 'test的git IP'
};
// 服务器路径
const PREFIX_DIR = '/data/wwwhome/';

const GITLAB_CI_BACKUP = fs.readFileSync(resolvePath('scripts/dev.backup.yml'), 'utf-8');

class DevExecutor {
    area = 'cn';
    env = 'dev';
    sufix = '-v101';
    constructor() {
        this.run();
    }

    async run() {
        await this.promptEnv();
        await this.rewriteEnvFile();
        await this.rewriteYml();
        log('🖥\x1b[93m', `本地需添加host:\n${IP_MAP[this.env]} ${this.webHost}\n127.0.0.1 域名`);

        log('👀\x1b[93m', `\x1b[31m先打开 ${this.webHost} 然后登录\x1b[0m`, true);
        log('🤔\x1b[93m', `\x1b[92m在打开 域名:4000 就可以愉快开发了\x1b[0m`, true);


        log('👻', `正在启动服务...\n\n`);
        await sleep();
        try {
            childProcess.execSync(`npx cross-env BUILD_SPECIFIC_ENV=${this.area} vite --mode ${this.env}`, {
                stdio: 'inherit'
            });
        } catch (err) {
            // 退出进程
        }
    }

    /**
     * 通过prompt交互获取目标环境信息
     */
    async promptEnv() {
        const answer1 = await inquirer.prompt([
            {
                type: 'list',
                message: '启动哪个环境？',
                name: 'env',
                prefix: '1/2 ',
                choices: [
                    { name: '国内dev', value: ['dev', 'cn'] },
                    { name: '国内test', value: ['test', 'cn'] }
                ]
            }
        ]);
        this.env = answer1.env[0];
        this.area = answer1.env[1];
        const answer2 = await inquirer.prompt([
            {
                type: 'list',
                message: `${this.area}${this.env}环境版本是？`,
                name: 'sufix',
                prefix: '2/2 ',
                choices: new Array(11)
                    .fill('')
                    .map((c, i) => {
                        const version = (i && 100 + i) || '';
                        const sufix = version ? '-v' + version : '';
                        return { name: `${this.env}${sufix}`, value: sufix };
                    })
                    .filter((c, i) => (this.env === 'dev' ? i > 0 : true))
            }
        ]);
        this.sufix = answer2.sufix;
    }

    /**
     * 重写.env.[目标环境]文件host相关的变量
     */
    async rewriteEnvFile() {
        const relativePath = `.env.${this.env}`;
        const envFilePath = resolvePath(relativePath);
        this.webHost = `${this.env}${this.sufix}-域名`;

        const data = fs.readFileSync(envFilePath, 'utf-8');
        const newData = data
            .replace(/(?<=env里面需要替换的变量=)\S+/, `https://${this.webHost}`);

        fs.writeFileSync(`${envFilePath}`, newData, 'utf-8');
        await sleep();
        log('👻\x1b[92m', `${relativePath} 文件已更新\n`);
    }

    /**
     * 根据目标环境重写.gitlab-ci.yml
     */
    async rewriteYml() {
        const relativePath = '.gitlab-ci.yml';
        const ymlPath = resolvePath(relativePath);
        const ymlData = yaml.load(GITLAB_CI_BACKUP);

        // const currentBranch = getExecStdout('git branch --show-current')
        const currentBranch = getExecStdout('git rev-parse --abbrev-ref HEAD'); // 兼容老版本git
        const dirName = `ppt-${this.env}${this.sufix}`;

        set(ymlData, 'variables.IP', GIT_RUNNER_IP_MAP[`${this.env}_${this.area}`]);
        set(ymlData, 'variables.WWW_HOME', `${PREFIX_DIR}${this.sufix ? dirName : '项目名'}`);
        if (this.env !== 'test' || this.sufix) {
            set(ymlData, 'job_build.only', [currentBranch]);
            set(ymlData, 'job_deploy.only', [currentBranch]);
        }
        set(ymlData, 'job_deploy.script[2]', `----- && pnpm install && pnpm run build:${this.env}"`);

        const ymlRawNew = yaml.dump(ymlData, { noCompatMode: true, lineWidth: -1 });
        fs.writeFileSync(ymlPath, ymlRawNew, 'utf-8');
        log('\n😁\x1b[92m', `${relativePath} 文件已更新\n`);
    }
}
/* --------------------------- class DevExecutor end --------------------------- */

function resolvePath(p) {
    return path.resolve(process.cwd(), p);
}

function log(prefix, text, isCus) {
    if (arguments.length < 2) {
        return;
    }
    const num = Math.floor(Math.random() * 10);
    const text2 = `${text
        .split('')
        .map((c, i) => `\x1b[${90 + ((i + num) % 8)}m${c}`)
        .join('')}`;
    if (isCus) {
        console.log(`${prefix} ${text}`);
    } else {
        console.log(`${prefix} ${prefix.length > 4 ? text : text2}\x1b[0m`, ...Array.from(arguments).slice(2));
    }
}

function sleep(delay = 800) {
    return new Promise((r) => setTimeout(r, delay));
}

/**
 * 执行cmd并返回输出值
 * @return string
 */
function getExecStdout(cmd) {
    try {
        const val = childProcess.execSync(cmd).toString().trim();
        return val;
    } catch (error) {
        console.log(`命令执行异常: ${cmd}`);
        process.exit(1);
    }
}

// eslint-disable-next-line no-new
new DevExecutor();
```

对应的dev.backup.yml测试文件
```yml
variables:
    SERVER_NAME: "项目名"
    TARHOME: "/data/wwwhome/项目名/"
    WWWHOME: "/data/wwwhome/对应域名/"
    IP: 环境IP

job_build:
    stage: build
    .....
    only:
        - 部署分支

job_deploy:
    stage: deploy
    script:
        - ....
        - .....
        - ....
        - .....
    tags:
        - syff-runner
    only:
        - 部署分支
```