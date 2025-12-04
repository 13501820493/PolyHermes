# 多语言支持实现总结

## 已完成的工作

### 后端部分 ✅

1. **语言资源文件** (`backend/src/main/resources/i18n/`)
   - `messages_zh_CN.properties` - 简体中文
   - `messages_zh_TW.properties` - 繁体中文
   - `messages_en.properties` - 英文
   - 已翻译所有 ErrorCode 错误消息（100+ 条）

2. **配置类**
   - `MessageSourceConfig.kt` - 配置 MessageSource 和 LocaleResolver
   - `LocaleInterceptor.kt` - 从 HTTP Header 读取语言设置

3. **核心修改**
   - `ErrorCode.kt` - 添加 `messageKey` 字段，每个错误码都有对应的消息键
   - `ApiResponse.kt` - 支持多语言错误消息
   - `ApiResponseExt.kt` - 提供便捷的扩展函数
   - `MessageUtils.kt` - 消息工具类
   - `WebMvcConfig.kt` - 注册 LocaleInterceptor

4. **示例更新**
   - `AccountController.kt` - 已更新部分方法作为示例

### 前端部分 ✅

1. **依赖安装**
   - `i18next` 和 `react-i18next` 已安装

2. **i18n 配置** (`frontend/src/i18n/config.ts`)
   - 自动检测系统语言
   - 支持语言切换
   - 语言持久化到 localStorage

3. **语言包** (`frontend/src/locales/`)
   - `zh-CN/common.json` - 简体中文
   - `zh-TW/common.json` - 繁体中文
   - `en/common.json` - 英文
   - 已包含账户管理相关的基础翻译

4. **API 集成**
   - `api.ts` - 自动在请求头添加 `X-Language` Header

5. **示例页面**
   - `AccountDetail.tsx` - 已完全使用 i18n

## 待完成的工作

### 后端部分

需要更新所有 Controller，使用 `MessageUtils` 或扩展函数来获取国际化消息：

```kotlin
// 方式1：使用扩展函数（推荐）
@RestController
class ExampleController(
    private val messageSource: MessageSource
) {
    @PostMapping("/example")
    fun example(): ResponseEntity<ApiResponse<Unit>> {
        // 使用扩展函数，自动国际化
        return ResponseEntity.ok(
            ApiResponse.error(ErrorCode.PARAM_ERROR, messageSource = messageSource)
        )
    }
}

// 方式2：使用 MessageUtils
@RestController
class ExampleController(
    private val messageUtils: MessageUtils
) {
    @PostMapping("/example")
    fun example(): ResponseEntity<ApiResponse<Unit>> {
        val msg = messageUtils.getMessage(ErrorCode.PARAM_ERROR)
        return ResponseEntity.ok(
            ApiResponse.error(ErrorCode.PARAM_ERROR.code, msg)
        )
    }
}
```

需要更新的 Controller：
- `AuthController.kt`
- `LeaderController.kt`
- `CopyTradingController.kt`
- `CopyTradingTemplateController.kt`
- `CopyTradingStatisticsController.kt`
- `MarketController.kt`
- `UserController.kt`
- `ProxyConfigController.kt`
- `AccountController.kt` (部分方法已更新，需要完成剩余部分)

### 前端部分

需要更新所有页面组件，使用 `useTranslation` Hook：

```typescript
import { useTranslation } from 'react-i18next'

const MyComponent: React.FC = () => {
  const { t } = useTranslation()
  
  return (
    <div>
      <Button>{t('common.save')}</Button>
      <div>{t('account.accountName')}</div>
    </div>
  )
}
```

需要更新的页面：
- `AccountList.tsx`
- `AccountImport.tsx`
- `AccountEdit.tsx`
- `LeaderList.tsx`
- `LeaderAdd.tsx`
- `LeaderEdit.tsx`
- `TemplateList.tsx`
- `TemplateAdd.tsx`
- `TemplateEdit.tsx`
- `CopyTradingList.tsx`
- `CopyTradingAdd.tsx`
- `Login.tsx`
- `UserList.tsx`
- 以及其他所有页面

## 使用说明

### 后端使用

1. **在 Controller 中注入 MessageSource**：
```kotlin
@RestController
class MyController(
    private val messageSource: MessageSource
) {
    // ...
}
```

2. **使用扩展函数创建错误响应**：
```kotlin
ApiResponse.error(ErrorCode.PARAM_ERROR, messageSource = messageSource)
```

3. **自定义消息（如果需要）**：
```kotlin
ApiResponse.error(ErrorCode.PARAM_ERROR, "自定义消息", messageSource)
```

### 前端使用

1. **在组件中使用 useTranslation**：
```typescript
import { useTranslation } from 'react-i18next'

const { t } = useTranslation()
```

2. **翻译文本**：
```typescript
t('common.save')  // 返回当前语言的"保存"
t('account.accountName')  // 返回当前语言的"账户名称"
```

3. **切换语言**（可选）：
```typescript
import { changeLanguage } from '../i18n/config'

changeLanguage('zh-CN')  // 切换到简体中文
changeLanguage('zh-TW')  // 切换到繁体中文
changeLanguage('en')     // 切换到英文
```

## 语言检测规则

### 前端
1. 优先使用 localStorage 中保存的语言设置
2. 如果没有，检测系统语言：
   - `zh-CN`, `zh` → 简体中文
   - `zh-TW`, `zh-HK`, `zh-MO` → 繁体中文
   - 其他 → 英文（默认）

### 后端
1. 从 HTTP Header 读取：
   - `X-Language` (优先)
   - `Accept-Language` (备选)
2. 语言映射规则同前端
3. 默认语言：英文

## 测试建议

1. **测试语言检测**：
   - 修改浏览器语言设置，刷新页面，检查是否自动切换
   - 测试不同语言下的 API 响应消息

2. **测试语言切换**：
   - 在前端添加语言切换组件（可选）
   - 测试切换后 API 请求是否正确传递语言 Header

3. **测试错误消息**：
   - 触发各种错误，检查错误消息是否正确显示对应语言

## 注意事项

1. **向后兼容**：如果前端没有发送语言 Header，后端默认使用英文
2. **消息键命名**：所有消息键使用 `error.` 前缀，便于管理
3. **翻译质量**：建议由专业翻译人员审核翻译内容
4. **性能**：语言包已配置缓存，不会影响性能

## 下一步

1. 完成所有 Controller 的更新
2. 完成所有前端页面的翻译
3. 添加语言切换组件（可选）
4. 全面测试多语言功能
5. 更新 API 文档，说明语言 Header 的使用



## 已完成的工作

### 后端部分 ✅

1. **语言资源文件** (`backend/src/main/resources/i18n/`)
   - `messages_zh_CN.properties` - 简体中文
   - `messages_zh_TW.properties` - 繁体中文
   - `messages_en.properties` - 英文
   - 已翻译所有 ErrorCode 错误消息（100+ 条）

2. **配置类**
   - `MessageSourceConfig.kt` - 配置 MessageSource 和 LocaleResolver
   - `LocaleInterceptor.kt` - 从 HTTP Header 读取语言设置

3. **核心修改**
   - `ErrorCode.kt` - 添加 `messageKey` 字段，每个错误码都有对应的消息键
   - `ApiResponse.kt` - 支持多语言错误消息
   - `ApiResponseExt.kt` - 提供便捷的扩展函数
   - `MessageUtils.kt` - 消息工具类
   - `WebMvcConfig.kt` - 注册 LocaleInterceptor

4. **示例更新**
   - `AccountController.kt` - 已更新部分方法作为示例

### 前端部分 ✅

1. **依赖安装**
   - `i18next` 和 `react-i18next` 已安装

2. **i18n 配置** (`frontend/src/i18n/config.ts`)
   - 自动检测系统语言
   - 支持语言切换
   - 语言持久化到 localStorage

3. **语言包** (`frontend/src/locales/`)
   - `zh-CN/common.json` - 简体中文
   - `zh-TW/common.json` - 繁体中文
   - `en/common.json` - 英文
   - 已包含账户管理相关的基础翻译

4. **API 集成**
   - `api.ts` - 自动在请求头添加 `X-Language` Header

5. **示例页面**
   - `AccountDetail.tsx` - 已完全使用 i18n

## 待完成的工作

### 后端部分

需要更新所有 Controller，使用 `MessageUtils` 或扩展函数来获取国际化消息：

```kotlin
// 方式1：使用扩展函数（推荐）
@RestController
class ExampleController(
    private val messageSource: MessageSource
) {
    @PostMapping("/example")
    fun example(): ResponseEntity<ApiResponse<Unit>> {
        // 使用扩展函数，自动国际化
        return ResponseEntity.ok(
            ApiResponse.error(ErrorCode.PARAM_ERROR, messageSource = messageSource)
        )
    }
}

// 方式2：使用 MessageUtils
@RestController
class ExampleController(
    private val messageUtils: MessageUtils
) {
    @PostMapping("/example")
    fun example(): ResponseEntity<ApiResponse<Unit>> {
        val msg = messageUtils.getMessage(ErrorCode.PARAM_ERROR)
        return ResponseEntity.ok(
            ApiResponse.error(ErrorCode.PARAM_ERROR.code, msg)
        )
    }
}
```

需要更新的 Controller：
- `AuthController.kt`
- `LeaderController.kt`
- `CopyTradingController.kt`
- `CopyTradingTemplateController.kt`
- `CopyTradingStatisticsController.kt`
- `MarketController.kt`
- `UserController.kt`
- `ProxyConfigController.kt`
- `AccountController.kt` (部分方法已更新，需要完成剩余部分)

### 前端部分

需要更新所有页面组件，使用 `useTranslation` Hook：

```typescript
import { useTranslation } from 'react-i18next'

const MyComponent: React.FC = () => {
  const { t } = useTranslation()
  
  return (
    <div>
      <Button>{t('common.save')}</Button>
      <div>{t('account.accountName')}</div>
    </div>
  )
}
```

需要更新的页面：
- `AccountList.tsx`
- `AccountImport.tsx`
- `AccountEdit.tsx`
- `LeaderList.tsx`
- `LeaderAdd.tsx`
- `LeaderEdit.tsx`
- `TemplateList.tsx`
- `TemplateAdd.tsx`
- `TemplateEdit.tsx`
- `CopyTradingList.tsx`
- `CopyTradingAdd.tsx`
- `Login.tsx`
- `UserList.tsx`
- 以及其他所有页面

## 使用说明

### 后端使用

1. **在 Controller 中注入 MessageSource**：
```kotlin
@RestController
class MyController(
    private val messageSource: MessageSource
) {
    // ...
}
```

2. **使用扩展函数创建错误响应**：
```kotlin
ApiResponse.error(ErrorCode.PARAM_ERROR, messageSource = messageSource)
```

3. **自定义消息（如果需要）**：
```kotlin
ApiResponse.error(ErrorCode.PARAM_ERROR, "自定义消息", messageSource)
```

### 前端使用

1. **在组件中使用 useTranslation**：
```typescript
import { useTranslation } from 'react-i18next'

const { t } = useTranslation()
```

2. **翻译文本**：
```typescript
t('common.save')  // 返回当前语言的"保存"
t('account.accountName')  // 返回当前语言的"账户名称"
```

3. **切换语言**（可选）：
```typescript
import { changeLanguage } from '../i18n/config'

changeLanguage('zh-CN')  // 切换到简体中文
changeLanguage('zh-TW')  // 切换到繁体中文
changeLanguage('en')     // 切换到英文
```

## 语言检测规则

### 前端
1. 优先使用 localStorage 中保存的语言设置
2. 如果没有，检测系统语言：
   - `zh-CN`, `zh` → 简体中文
   - `zh-TW`, `zh-HK`, `zh-MO` → 繁体中文
   - 其他 → 英文（默认）

### 后端
1. 从 HTTP Header 读取：
   - `X-Language` (优先)
   - `Accept-Language` (备选)
2. 语言映射规则同前端
3. 默认语言：英文

## 测试建议

1. **测试语言检测**：
   - 修改浏览器语言设置，刷新页面，检查是否自动切换
   - 测试不同语言下的 API 响应消息

2. **测试语言切换**：
   - 在前端添加语言切换组件（可选）
   - 测试切换后 API 请求是否正确传递语言 Header

3. **测试错误消息**：
   - 触发各种错误，检查错误消息是否正确显示对应语言

## 注意事项

1. **向后兼容**：如果前端没有发送语言 Header，后端默认使用英文
2. **消息键命名**：所有消息键使用 `error.` 前缀，便于管理
3. **翻译质量**：建议由专业翻译人员审核翻译内容
4. **性能**：语言包已配置缓存，不会影响性能

## 下一步

1. 完成所有 Controller 的更新
2. 完成所有前端页面的翻译
3. 添加语言切换组件（可选）
4. 全面测试多语言功能
5. 更新 API 文档，说明语言 Header 的使用

