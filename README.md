# admin

## 安装
```
npm install
```

### 本地开发
```
npm run serve
```

### 打包
```
npm run build
```

### 项目结构
```
├── dist                       # 打包文件
├── public                     # 静态资源
│   └── index.html             # html模板
├── src                        # 源代码
│   ├── api                    # 所有请求
│   ├── assets                 # 主题 字体等静态资源
│   ├── components             # 全局公用组件
│   ├── filters                # 全局 filter
│   ├── router                 # 路由
│   ├── store                  # 全局 store管理
│   ├── styles                 # 全局样式
│   ├── utils                  # 全局公用方法
│   ├── views                  # views 所有页面
│   ├── App.vue                # 入口页面
│   ├── main.js                # 入口文件
│   └── use.js                 # 加载组件 初始化等，（保证单一功能，防止main.js代码过多）
├── .browserslistrc            # 支持的浏览器版本 配置项
├── package.json               # package.json
└── vue.config.js              # vue-cli 配置
```

> `api`内文件和view文件尽量保持一致，方便查找


`vant 体量过大，最好按需引入，必要的时候选用cdn引入`