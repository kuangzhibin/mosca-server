
# mosca-server
---
基于mosca搭建的mqtt服务

### 快速上手

命令行执行语句：

    npm install && npm start


服务将在本地1883端口启动。

### 说明
服务加入了用户验证,可在user.json添加删除用户。

登录用户订阅和发布的topic,必须在用户名命名空间下，如：

登录用户admin，只可发布和订阅的topic为 /admin/**

  