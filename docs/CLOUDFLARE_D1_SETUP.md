
# Cloudflare D1 数据库配置指南

本项目已从JSON文件数据存储迁移到Cloudflare D1数据库。

## 前置条件

1. 安装 [Node.js](https://nodejs.org/) (v18+)
2. 注册 [Cloudflare](https://www.cloudflare.com/) 账号
3. 安装 Wrangler CLI: `npm install -g wrangler`

## 配置步骤

### 1. 登录 Cloudflare

```bash
wrangler login
```

### 2. 创建 D1 数据库

```bash
npm run db:create
# 或者
wrangler d1 create zhaopin-db
```

执行后会输出数据库ID，类似：

```
✅ Successfully created DB 'zhaopin-db'

[[d1_databases]]
binding = "DB"
database_name = "zhaopin-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### 3. 更新 wrangler.toml

将 `wrangler.toml` 中的 `database_id` 替换为上一步获取的实际数据库ID：

```toml
[[d1_databases]]
binding = "DB"
database_name = "zhaopin-db"
database_id = "你的数据库ID"
```

### 4. 初始化数据库表结构

```bash
npm run db:init
# 或者
wrangler d1 execute zhaopin-db --file=./scripts/init-db.sql
```

### 5. 导入种子数据

首先需要生成种子数据SQL：

```bash
npx tsx scripts/seed-db.ts > scripts/seed-db.sql
```

然后导入：

```bash
npm run db:seed
# 或者
wrangler d1 execute zhaopin-db --file=./scripts/seed-db.sql
```

### 6. 安装依赖

```bash
npm install
```

### 7. 启动开发服务器

```bash
npm run dev
```

## 项目架构

### 数据层

- `lib/db/cloudflare.ts` - Cloudflare D1数据库连接配置
- `lib/services/cloudflare-db.ts` - 数据库操作服务（服务端使用）
- `lib/services/api.ts` - API客户端服务（客户端使用）
- `lib/utils/data.ts` - 统一数据访问层（自动选择服务端/客户端）

### API路由

- `app/api/jobs/` - 职位API
- `app/api/companies/` - 公司API
- `app/api/users/` - 用户API
- `app/api/categories/` - 分类API
- `app/api/locations/` - 地区API

### 数据库脚本

- `scripts/init-db.sql` - 数据库表结构初始化
- `scripts/seed-db.ts` - 种子数据生成脚本

## 数据库表结构

| 表名 | 说明 |
|------|------|
| users | 用户表 |
| companies | 公司表 |
| jobs | 职位表 |
| applications | 职位申请表 |
| messages | 消息表 |
| categories | 分类表 |
| locations | 地区表 |

## 常用命令

```bash
# 查看数据库列表
wrangler d1 list

# 查看数据库信息
wrangler d1 info zhaopin-db

# 执行SQL查询
wrangler d1 execute zhaopin-db --command="SELECT * FROM jobs LIMIT 10"

# 导出数据库
wrangler d1 export zhaopin-db --output=backup.sql
```

## 部署到 Cloudflare Pages

```bash
# 构建
npm run build

# 部署
wrangler pages deploy .vercel/output/static
```

## 注意事项

1. 在本地开发时，如果没有配置Cloudflare D1，API路由会返回错误。需要确保数据库已正确配置。
2. 所有数据访问方法现在都是异步的（返回Promise），客户端组件需要使用`useState`和`useEffect`来处理异步数据。
3. 数据库连接在API路由中自动初始化，无需手动配置。
