# 多语言支持遗漏工作清单

## 后端遗漏工作

### ❌ 需要更新的 Controller

#### 1. CopyTradingController
- ✅ 已添加 MessageSource 依赖注入
- ❌ **所有 ApiResponse.error() 调用都缺少 messageSource 参数**
  - 第 31 行：`ApiResponse.error(ErrorCode.PARAM_ACCOUNT_ID_INVALID)` → 需要添加 `, messageSource = messageSource`
  - 第 34 行：`ApiResponse.error(ErrorCode.PARAM_TEMPLATE_ID_INVALID)` → 需要添加
  - 第 37 行：`ApiResponse.error(ErrorCode.PARAM_LEADER_ID_INVALID)` → 需要添加
  - 第 48-49 行：`ApiResponse.error(ErrorCode.PARAM_ERROR, e.message)` → 需要添加 `, messageSource`
  - 第 55 行：`ApiResponse.error(ErrorCode.SERVER_COPY_TRADING_CREATE_FAILED, e.message)` → 需要添加
  - 第 72, 77 行：查询列表的错误响应 → 需要添加
  - 第 88, 99-101, 107 行：更新状态的错误响应 → 需要添加
  - 第 118, 129-130, 136 行：删除的错误响应 → 需要添加
  - 第 147, 158-159, 165 行：查询模板的错误响应 → 需要添加

#### 2. CopyTradingTemplateController
- ❌ **未添加 MessageSource 依赖注入**
- ❌ **所有 ApiResponse.error() 调用都需要更新**
  - 需要添加：`private val messageSource: MessageSource`
  - 需要添加导入：`import com.wrbug.polymarketbot.util.error`
  - 所有 `ApiResponse.error()` 调用都需要添加 `messageSource` 参数

#### 3. MarketController
- ❌ **未添加 MessageSource 依赖注入**
- ❌ **所有 ApiResponse.error() 调用都需要更新**
  - 第 34 行：`ApiResponse.error(ErrorCode.PARAM_MARKET_ID_EMPTY)`
  - 第 44, 49 行：`ApiResponse.error(ErrorCode.SERVER_MARKET_PRICE_FETCH_FAILED, e.message)`
  - 第 62 行：`ApiResponse.error(ErrorCode.PARAM_TOKEN_ID_EMPTY)`
  - 第 72, 77 行：`ApiResponse.error(ErrorCode.SERVER_MARKET_LATEST_PRICE_FETCH_FAILED, e.message)`

#### 4. CopyTradingStatisticsController
- ❌ **未添加 MessageSource 依赖注入**
- ❌ **所有 ApiResponse.error() 调用都需要更新**
  - 第 31 行：`ApiResponse.error(ErrorCode.PARAM_COPY_TRADING_ID_INVALID)`
  - 第 42-43, 49 行：统计查询的错误响应
  - 需要检查整个文件的所有错误响应

#### 5. ProxyConfigController
- ❌ **未添加 MessageSource 依赖注入**
- ❌ **所有 ApiResponse.error() 调用都需要更新**
  - 第 35 行：`ApiResponse.error(ErrorCode.SERVER_ERROR, "获取代理配置失败：${e.message}")`
  - 第 49 行：`ApiResponse.error(ErrorCode.SERVER_ERROR, "获取代理配置列表失败：${e.message}")`
  - 需要检查整个文件的所有错误响应

#### 6. HealthController
- ✅ **不需要更新**（没有错误响应，只有健康检查）

### 更新模式

对于每个 Controller，需要：

1. **添加导入**：
```kotlin
import com.wrbug.polymarketbot.util.error
import org.springframework.context.MessageSource
```

2. **添加依赖注入**：
```kotlin
class YourController(
    private val yourService: YourService,
    private val messageSource: MessageSource  // 添加这一行
)
```

3. **更新所有 ApiResponse.error() 调用**：
```kotlin
// 模式1：只有 ErrorCode
ApiResponse.error(ErrorCode.PARAM_ERROR) 
→ ApiResponse.error(ErrorCode.PARAM_ERROR, messageSource = messageSource)

// 模式2：ErrorCode + 消息
ApiResponse.error(ErrorCode.PARAM_ERROR, e.message)
→ ApiResponse.error(ErrorCode.PARAM_ERROR, e.message, messageSource)
```

## 前端遗漏工作

### ❌ 需要更新的页面组件（23个页面，只有1个已更新）

#### ✅ 已完成的页面
1. **AccountDetail.tsx** - 已完全使用 i18n

#### ❌ 待更新的页面（22个）

1. **Login.tsx**
   - 硬编码文本：`'登录成功'`, `'登录失败'`, `'用户名'`, `'密码'` 等
   - 需要添加：`import { useTranslation } from 'react-i18next'`
   - 需要添加：`const { t } = useTranslation()`
   - 需要替换所有硬编码文本

2. **AccountList.tsx**
   - 需要检查并替换所有硬编码文本

3. **AccountImport.tsx**
   - 硬编码文本：`'钱包地址与私钥不匹配'`, `'钱包地址格式不正确'`, `'钱包地址'` 等
   - 需要更新

4. **AccountEdit.tsx**
   - 需要检查并替换所有硬编码文本

5. **LeaderList.tsx**
   - 需要检查并替换所有硬编码文本

6. **LeaderAdd.tsx**
   - 需要检查并替换所有硬编码文本

7. **LeaderEdit.tsx**
   - 需要检查并替换所有硬编码文本

8. **TemplateList.tsx**
   - 需要检查并替换所有硬编码文本

9. **TemplateAdd.tsx**
   - 需要检查并替换所有硬编码文本

10. **TemplateEdit.tsx**
    - 需要检查并替换所有硬编码文本

11. **CopyTradingList.tsx**
    - 硬编码文本：`'删除跟单成功'`, `'删除跟单失败'`, `'钱包'`, `'模板'`, `'Leader'`, `'取消'`, `'订单'` 等
    - 需要更新

12. **CopyTradingAdd.tsx**
    - 需要检查并替换所有硬编码文本

13. **CopyTradingStatistics.tsx**
    - 需要检查并替换所有硬编码文本

14. **CopyTradingBuyOrders.tsx**
    - 需要检查并替换所有硬编码文本

15. **CopyTradingSellOrders.tsx**
    - 需要检查并替换所有硬编码文本

16. **CopyTradingMatchedOrders.tsx**
    - 需要检查并替换所有硬编码文本

17. **PositionList.tsx**
    - 硬编码文本：`'账户'`, `'市场'`, `'搜索账户、市场、方向...'`, `'确认卖出'`, `'取消'`, `'订单类型'`, `'确认赎回'` 等
    - 需要更新

18. **OrderList.tsx**
    - 需要检查并替换所有硬编码文本

19. **Statistics.tsx**
    - 需要检查并替换所有硬编码文本

20. **UserList.tsx**
    - 需要检查并替换所有硬编码文本

21. **ResetPassword.tsx**
    - 需要检查并替换所有硬编码文本

22. **SystemSettings.tsx**
    - 需要检查并替换所有硬编码文本

23. **ConfigPage.tsx**
    - 需要检查并替换所有硬编码文本

### App.tsx 中的硬编码文本

**App.tsx** 中有硬编码的中文文本：
- 第 61 行：`'订单创建'`
- 第 63 行：`'订单更新'`
- 第 65 行：`'订单取消'`
- 第 67 行：`'订单事件'`
- 第 79 行：`'买入'`, `'卖出'`
- 第 92 行：`'市场:'`, `'状态:'`, `'已成交:'`, `'剩余:'`

需要：
1. 添加 `import { useTranslation } from 'react-i18next'`
2. 在组件中使用 `const { t } = useTranslation()`
3. 替换所有硬编码文本

### 前端更新模式

对于每个页面组件：

1. **添加导入**：
```typescript
import { useTranslation } from 'react-i18next'
```

2. **在组件中使用**：
```typescript
const YourComponent: React.FC = () => {
  const { t } = useTranslation()
  // ...
}
```

3. **替换硬编码文本**：
```typescript
// 旧代码
<Button>保存</Button>
message.success('操作成功')

// 新代码
<Button>{t('common.save')}</Button>
message.success(t('message.operationSuccess'))
```

4. **扩展语言包**：
   - 在 `frontend/src/locales/*/common.json` 中添加缺失的翻译键
   - 确保三个语言包（zh-CN, zh-TW, en）都有对应的翻译

## 语言包扩展

### 需要添加的翻译键

根据检查，需要在语言包中添加以下键：

```json
{
  "order": {
    "create": "订单创建",
    "update": "订单更新",
    "cancel": "订单取消",
    "event": "订单事件",
    "buy": "买入",
    "sell": "卖出",
    "market": "市场",
    "status": "状态",
    "filled": "已成交",
    "remaining": "剩余"
  },
  "wallet": {
    "address": "钱包地址",
    "addressMismatch": "钱包地址与私钥不匹配",
    "addressInvalid": "钱包地址格式不正确"
  },
  "copyTrading": {
    "deleteSuccess": "删除跟单成功",
    "deleteFailed": "删除跟单失败",
    "wallet": "钱包",
    "template": "模板",
    "leader": "Leader"
  },
  "position": {
    "account": "账户",
    "market": "市场",
    "searchPlaceholder": "搜索账户、市场、方向...",
    "confirmSell": "确认卖出",
    "confirmRedeem": "确认赎回",
    "orderType": "订单类型"
  }
}
```

## 优先级建议

### 高优先级（核心功能）
1. ✅ 后端：完成所有 Controller 的 MessageSource 更新
2. ✅ 前端：更新 Login.tsx（登录页面）
3. ✅ 前端：更新 App.tsx（全局通知）

### 中优先级（常用功能）
4. 前端：更新 AccountList.tsx, AccountImport.tsx
5. 前端：更新 LeaderList.tsx, LeaderAdd.tsx
6. 前端：更新 CopyTradingList.tsx

### 低优先级（其他页面）
7. 前端：逐步更新其他页面组件

## 验证清单

完成后检查：

### 后端
- [ ] 所有 Controller 都注入了 MessageSource
- [ ] 所有 ApiResponse.error() 调用都传入了 messageSource
- [ ] 编译无错误
- [ ] 测试不同语言下的错误消息

### 前端
- [ ] 所有页面都使用了 useTranslation
- [ ] 所有硬编码文本都已替换
- [ ] 语言包包含所有需要的翻译键
- [ ] 测试不同语言下的页面显示
- [ ] 测试语言切换功能



## 后端遗漏工作

### ❌ 需要更新的 Controller

#### 1. CopyTradingController
- ✅ 已添加 MessageSource 依赖注入
- ❌ **所有 ApiResponse.error() 调用都缺少 messageSource 参数**
  - 第 31 行：`ApiResponse.error(ErrorCode.PARAM_ACCOUNT_ID_INVALID)` → 需要添加 `, messageSource = messageSource`
  - 第 34 行：`ApiResponse.error(ErrorCode.PARAM_TEMPLATE_ID_INVALID)` → 需要添加
  - 第 37 行：`ApiResponse.error(ErrorCode.PARAM_LEADER_ID_INVALID)` → 需要添加
  - 第 48-49 行：`ApiResponse.error(ErrorCode.PARAM_ERROR, e.message)` → 需要添加 `, messageSource`
  - 第 55 行：`ApiResponse.error(ErrorCode.SERVER_COPY_TRADING_CREATE_FAILED, e.message)` → 需要添加
  - 第 72, 77 行：查询列表的错误响应 → 需要添加
  - 第 88, 99-101, 107 行：更新状态的错误响应 → 需要添加
  - 第 118, 129-130, 136 行：删除的错误响应 → 需要添加
  - 第 147, 158-159, 165 行：查询模板的错误响应 → 需要添加

#### 2. CopyTradingTemplateController
- ❌ **未添加 MessageSource 依赖注入**
- ❌ **所有 ApiResponse.error() 调用都需要更新**
  - 需要添加：`private val messageSource: MessageSource`
  - 需要添加导入：`import com.wrbug.polymarketbot.util.error`
  - 所有 `ApiResponse.error()` 调用都需要添加 `messageSource` 参数

#### 3. MarketController
- ❌ **未添加 MessageSource 依赖注入**
- ❌ **所有 ApiResponse.error() 调用都需要更新**
  - 第 34 行：`ApiResponse.error(ErrorCode.PARAM_MARKET_ID_EMPTY)`
  - 第 44, 49 行：`ApiResponse.error(ErrorCode.SERVER_MARKET_PRICE_FETCH_FAILED, e.message)`
  - 第 62 行：`ApiResponse.error(ErrorCode.PARAM_TOKEN_ID_EMPTY)`
  - 第 72, 77 行：`ApiResponse.error(ErrorCode.SERVER_MARKET_LATEST_PRICE_FETCH_FAILED, e.message)`

#### 4. CopyTradingStatisticsController
- ❌ **未添加 MessageSource 依赖注入**
- ❌ **所有 ApiResponse.error() 调用都需要更新**
  - 第 31 行：`ApiResponse.error(ErrorCode.PARAM_COPY_TRADING_ID_INVALID)`
  - 第 42-43, 49 行：统计查询的错误响应
  - 需要检查整个文件的所有错误响应

#### 5. ProxyConfigController
- ❌ **未添加 MessageSource 依赖注入**
- ❌ **所有 ApiResponse.error() 调用都需要更新**
  - 第 35 行：`ApiResponse.error(ErrorCode.SERVER_ERROR, "获取代理配置失败：${e.message}")`
  - 第 49 行：`ApiResponse.error(ErrorCode.SERVER_ERROR, "获取代理配置列表失败：${e.message}")`
  - 需要检查整个文件的所有错误响应

#### 6. HealthController
- ✅ **不需要更新**（没有错误响应，只有健康检查）

### 更新模式

对于每个 Controller，需要：

1. **添加导入**：
```kotlin
import com.wrbug.polymarketbot.util.error
import org.springframework.context.MessageSource
```

2. **添加依赖注入**：
```kotlin
class YourController(
    private val yourService: YourService,
    private val messageSource: MessageSource  // 添加这一行
)
```

3. **更新所有 ApiResponse.error() 调用**：
```kotlin
// 模式1：只有 ErrorCode
ApiResponse.error(ErrorCode.PARAM_ERROR) 
→ ApiResponse.error(ErrorCode.PARAM_ERROR, messageSource = messageSource)

// 模式2：ErrorCode + 消息
ApiResponse.error(ErrorCode.PARAM_ERROR, e.message)
→ ApiResponse.error(ErrorCode.PARAM_ERROR, e.message, messageSource)
```

## 前端遗漏工作

### ❌ 需要更新的页面组件（23个页面，只有1个已更新）

#### ✅ 已完成的页面
1. **AccountDetail.tsx** - 已完全使用 i18n

#### ❌ 待更新的页面（22个）

1. **Login.tsx**
   - 硬编码文本：`'登录成功'`, `'登录失败'`, `'用户名'`, `'密码'` 等
   - 需要添加：`import { useTranslation } from 'react-i18next'`
   - 需要添加：`const { t } = useTranslation()`
   - 需要替换所有硬编码文本

2. **AccountList.tsx**
   - 需要检查并替换所有硬编码文本

3. **AccountImport.tsx**
   - 硬编码文本：`'钱包地址与私钥不匹配'`, `'钱包地址格式不正确'`, `'钱包地址'` 等
   - 需要更新

4. **AccountEdit.tsx**
   - 需要检查并替换所有硬编码文本

5. **LeaderList.tsx**
   - 需要检查并替换所有硬编码文本

6. **LeaderAdd.tsx**
   - 需要检查并替换所有硬编码文本

7. **LeaderEdit.tsx**
   - 需要检查并替换所有硬编码文本

8. **TemplateList.tsx**
   - 需要检查并替换所有硬编码文本

9. **TemplateAdd.tsx**
   - 需要检查并替换所有硬编码文本

10. **TemplateEdit.tsx**
    - 需要检查并替换所有硬编码文本

11. **CopyTradingList.tsx**
    - 硬编码文本：`'删除跟单成功'`, `'删除跟单失败'`, `'钱包'`, `'模板'`, `'Leader'`, `'取消'`, `'订单'` 等
    - 需要更新

12. **CopyTradingAdd.tsx**
    - 需要检查并替换所有硬编码文本

13. **CopyTradingStatistics.tsx**
    - 需要检查并替换所有硬编码文本

14. **CopyTradingBuyOrders.tsx**
    - 需要检查并替换所有硬编码文本

15. **CopyTradingSellOrders.tsx**
    - 需要检查并替换所有硬编码文本

16. **CopyTradingMatchedOrders.tsx**
    - 需要检查并替换所有硬编码文本

17. **PositionList.tsx**
    - 硬编码文本：`'账户'`, `'市场'`, `'搜索账户、市场、方向...'`, `'确认卖出'`, `'取消'`, `'订单类型'`, `'确认赎回'` 等
    - 需要更新

18. **OrderList.tsx**
    - 需要检查并替换所有硬编码文本

19. **Statistics.tsx**
    - 需要检查并替换所有硬编码文本

20. **UserList.tsx**
    - 需要检查并替换所有硬编码文本

21. **ResetPassword.tsx**
    - 需要检查并替换所有硬编码文本

22. **SystemSettings.tsx**
    - 需要检查并替换所有硬编码文本

23. **ConfigPage.tsx**
    - 需要检查并替换所有硬编码文本

### App.tsx 中的硬编码文本

**App.tsx** 中有硬编码的中文文本：
- 第 61 行：`'订单创建'`
- 第 63 行：`'订单更新'`
- 第 65 行：`'订单取消'`
- 第 67 行：`'订单事件'`
- 第 79 行：`'买入'`, `'卖出'`
- 第 92 行：`'市场:'`, `'状态:'`, `'已成交:'`, `'剩余:'`

需要：
1. 添加 `import { useTranslation } from 'react-i18next'`
2. 在组件中使用 `const { t } = useTranslation()`
3. 替换所有硬编码文本

### 前端更新模式

对于每个页面组件：

1. **添加导入**：
```typescript
import { useTranslation } from 'react-i18next'
```

2. **在组件中使用**：
```typescript
const YourComponent: React.FC = () => {
  const { t } = useTranslation()
  // ...
}
```

3. **替换硬编码文本**：
```typescript
// 旧代码
<Button>保存</Button>
message.success('操作成功')

// 新代码
<Button>{t('common.save')}</Button>
message.success(t('message.operationSuccess'))
```

4. **扩展语言包**：
   - 在 `frontend/src/locales/*/common.json` 中添加缺失的翻译键
   - 确保三个语言包（zh-CN, zh-TW, en）都有对应的翻译

## 语言包扩展

### 需要添加的翻译键

根据检查，需要在语言包中添加以下键：

```json
{
  "order": {
    "create": "订单创建",
    "update": "订单更新",
    "cancel": "订单取消",
    "event": "订单事件",
    "buy": "买入",
    "sell": "卖出",
    "market": "市场",
    "status": "状态",
    "filled": "已成交",
    "remaining": "剩余"
  },
  "wallet": {
    "address": "钱包地址",
    "addressMismatch": "钱包地址与私钥不匹配",
    "addressInvalid": "钱包地址格式不正确"
  },
  "copyTrading": {
    "deleteSuccess": "删除跟单成功",
    "deleteFailed": "删除跟单失败",
    "wallet": "钱包",
    "template": "模板",
    "leader": "Leader"
  },
  "position": {
    "account": "账户",
    "market": "市场",
    "searchPlaceholder": "搜索账户、市场、方向...",
    "confirmSell": "确认卖出",
    "confirmRedeem": "确认赎回",
    "orderType": "订单类型"
  }
}
```

## 优先级建议

### 高优先级（核心功能）
1. ✅ 后端：完成所有 Controller 的 MessageSource 更新
2. ✅ 前端：更新 Login.tsx（登录页面）
3. ✅ 前端：更新 App.tsx（全局通知）

### 中优先级（常用功能）
4. 前端：更新 AccountList.tsx, AccountImport.tsx
5. 前端：更新 LeaderList.tsx, LeaderAdd.tsx
6. 前端：更新 CopyTradingList.tsx

### 低优先级（其他页面）
7. 前端：逐步更新其他页面组件

## 验证清单

完成后检查：

### 后端
- [ ] 所有 Controller 都注入了 MessageSource
- [ ] 所有 ApiResponse.error() 调用都传入了 messageSource
- [ ] 编译无错误
- [ ] 测试不同语言下的错误消息

### 前端
- [ ] 所有页面都使用了 useTranslation
- [ ] 所有硬编码文本都已替换
- [ ] 语言包包含所有需要的翻译键
- [ ] 测试不同语言下的页面显示
- [ ] 测试语言切换功能

