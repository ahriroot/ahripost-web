## AHRIPOST - 接口调试工具

## 快速开始

#### 一、 下载客户端

<a href="https://installer.service.ahriknow.com/ahripost/rust/releases/v0.1.0/msi/AhriPost_0.1.0_x64_zh-CN.msi" target="_blank">AhriPost_0.1.0_x64_zh-CN.msi</a>

-------

<a href="https://installer.service.ahriknow.com/ahripost/rust/releases/v0.1.0/msi/AhriPost_0.1.0_x64_zh-CN.msi.zip" target="_blank">AhriPost_0.1.0_x64_zh-CN.msi.zip</a>

--------

<a href="https://installer.service.ahriknow.com/ahridbms/rust/releases/v0.1.0/msi/AhriDBMS_0.1.0_x64_zh-CN.msi.sha256" target="_blank">SHA256 File</a>


#### 二、 在线文档和多人同步（可跳过）

> SET Server host (For test: `https://post.api.ahriknow.com`)
>
> SET Token
>   - Login:  (For test: `Username: test`、`Password: 123456`)
>   - GoTo: https://post.ahriknow.com/admin/token
>   - Add token And Set it to client 

![1.png](https://installer.service.ahriknow.com/ahripost/rust/release/v0.1.0/resources/1.png)

#### 三、创建项目（或下载远程项目）

![2.png](https://installer.service.ahriknow.com/ahripost/rust/release/v0.1.0/resources/2.png)

#### 四、 调试接口

![3.png](https://installer.service.ahriknow.com/ahripost/rust/release/v0.1.0/resources/3.png)

## 私有部署

### Docker

#### 部署服务器

```bash
# pull the image
docker push ahriknow/ahripost-deploy:0.1.0

# run a container
docker container run --name ahripost_deploy -p 9000:9000 -v ${}/data:/data -d ahriknow/ahripost-deploy:0.1.0
# Environments:
##  APP_NAME: 应用名
##  APP_MODE: 启动模式 => debug|production [default: production]
##  APP_HOST: 监听地址 [default: 0.0.0.0]
##  APP_PORT: 监听端口 [default: 9000]
##  DB_TYPE: 数据库类型 => sqlite|postgres [default: sqlite]
##  TIME_ZONE: POSTGRES时区 [default: Asia/Shanghai]
##  TIME_ZONE: POSTGRES时区 [default: Asia/Shanghai]
##  POSTGRES_HOST: POSTGRES地址 [default: 127.0.0.1]
##  POSTGRES_PORT: POSTGRES端口 [default: 5432]
##  POSTGRES_NAME: POSTGRES名称 [default: ahripost]
##  POSTGRES_USER: POSTGRES用户 [default: postgres]
##  POSTGRES_PASS: POSTGRES密码
```
#### 部署 Web 端

```bash
# 下载镜像
docker push ahriknow/ahripost-web:0.1.0

# 启动容器 (nginx + vue)
docker container run --name ahripost_web -p 80:80 -d ahriknow/ahripost-web:0.1.0
```

## 源码部署

#### 部署服务器 (golang >= 1.19)

```bash
# 克隆源码
## 国内地址
git clone https://git.ahriknow.com/ahriknow/ahripost-deploy.git
## Github
git clone https://github.com/ahriroot/ahripost-deploy.git

# 进入项目根目录
## 复制并编辑配置文件
## 如果用 sqlite 数据库还需要更改 ${project}/database/DB.go 大约 line: 24
cp tools/Config.go.example tools/Config.go

# 构建服务端
go build

# 启动 (应以后台进程启动)
./ahripost_deploy
```
#### 部署 Web 端 (nodejs >= 18.10 & vite2 & vue3)

```bash
# 克隆源码
## 国内地址
git clone https://git.ahriknow.com/ahriknow/ahripost-web.git
## Github
git clone https://github.com/ahriroot/ahripost-deploy.git

# 复制并编辑配置文件
cp .env.example .env

# 安装依赖
yarn
## OR
npm install

# 打包前端
yarn build
## OR
npm run build

## 部署打包后的 dist/ 文件夹
```
