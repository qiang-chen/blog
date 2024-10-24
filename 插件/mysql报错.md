---
title: node连接 mysql8 报错
date: 2024-10-24
tags:
  - 插件
---

node链接mysql报错(connect ECONNREFUSED 127.0.0.1:3306 &...

报错：==Error: ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server; consider upgrading MySQL client==
这个错误的意思就是客户端不支持服务器请求的身份验证协议

解决办法就是修改加密规则

1.打开命令行，输入下面的命令

```sql
$ mysql -u root -p
```
输入密码。

2.再输入，密码替换为自己的密码

```sql
mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY '密码' PASSWORD EXPIRE NEVER; 
```

3.再输入，密码替换为自己的密码

```sql
mysql> ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '密码';
```

4.刷新权限

```sql
mysql> FLUSH PRIVILEGES;
```

5.更新密码重新链接即可。

这时有可能还会有报错，
==Error: connect ECONNREFUSED 127.0.0.1:3306==

解决方式：

```js
const mysql = require('mysql');
let db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    socketPath: '/tmp/mysql.sock',
    database: 'testDb'
});
```