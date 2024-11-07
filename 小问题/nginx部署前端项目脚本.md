---
title: nginx部署前端项目脚本
date: 2024-11-07
tags:
  - 小问题
---

```bash
server
{
    listen 80;
    server_name 114.55.33.55;
    index index.html index.htm default.htm default.html;
    root /www/wwwroot/default;
    #CERT-APPLY-CHECK--START
    # 用于SSL证书申请时的文件验证相关配置 -- 请勿删除并保持这段设置在优先级高的位置
    include /www/server/panel/vhost/nginx/well-known/114.55.33.55.conf;
    #CERT-APPLY-CHECK--END

    #SSL-START SSL相关配置，请勿删除或修改下一行带注释的404规则
    #error_page 404/404.html;
    limit_conn perserver 300;
    limit_conn perip 25;
    limit_rate 512k;
    #SSL-END
    #引用重定向规则，注释后配置的重定向代理将无效
    include /www/server/panel/vhost/nginx/redirect/114.55.33.55/*.conf;

    #ERROR-PAGE-START  错误页配置，可以注释、删除或修改
    #error_page 404 /404.html;
    #error_page 502 /502.html;
    #ERROR-PAGE-END

    #REWRITE-START URL重写规则引用,修改后将导致面板设置的伪静态规则失效
    include /www/server/panel/vhost/rewrite/html_114.55.33.55.conf;
    #REWRITE-END

    #禁止访问的文件或目录
    location ~ ^/(\.user.ini|\.htaccess|\.git|\.env|\.svn|\.project|LICENSE|README.md)
    {
        return 404;
    }

    #一键申请SSL证书验证目录相关设置
    location ~ \.well-known{
        allow all;
    }

    #禁止在证书验证目录放入敏感文件
    if ( $uri ~ "^/\.well-known/.*\.(php|jsp|py|js|css|lua|ts|go|zip|tar\.gz|rar|7z|sql|bak)$" ) {
        return 403;
    }

    location ~ .*\\.(gif|jpg|jpeg|png|bmp|swf)$
    {
        expires      30d;
        error_log /dev/null;
        access_log /dev/null;
    }

    location ~ .*\\.(js|css)?$
    {
        expires      12h;
        error_log /dev/null;
        access_log /dev/null;
    }
    ## 注意这个，解决404的关键
    location /admin {
      alias /www/wwwroot/default/admin;
      try_files $uri $uri/ @router;
      index index.html;
    }
 
    location @router {
            rewrite ^.*$ /admin/index.html last;
            # rewrite ^.*$ /index.html last;
    }
    access_log  /www/wwwlogs/114.55.33.55.log;
    error_log  /www/wwwlogs/114.55.33.55.error.log;
}
```