# Controller 多语言更新指南

## 已完成的 Controller ✅

1. **AccountController** - 完全更新
2. **AuthController** - 完全更新
3. **LeaderController** - 完全更新
4. **UserController** - 完全更新

## 待更新的 Controller

以下 Controller 需要按照相同模式更新：

1. **CopyTradingController** - 已添加 MessageSource，需要更新所有 ApiResponse.error() 调用
2. **CopyTradingTemplateController** - 需要添加 MessageSource 并更新调用
3. **MarketController** - 需要添加 MessageSource 并更新调用
4. **CopyTradingStatisticsController** - 需要添加 MessageSource 并更新调用
5. **ProxyConfigController** - 需要添加 MessageSource 并更新调用
6. **HealthController** - 需要检查是否需要更新

## 更新步骤

### 步骤 1：添加导入和依赖注入

```kotlin
// 1. 添加导入
import com.wrbug.polymarketbot.util.error
import org.springframework.context.MessageSource

// 2. 在构造函数中注入 MessageSource
class YourController(
    private val yourService: YourService,
    private val messageSource: MessageSource  // 添加这一行
) {
    // ...
}
```

### 步骤 2：更新所有 ApiResponse.error() 调用

**模式 1：只有 ErrorCode**
```kotlin
// 旧代码
ApiResponse.error(ErrorCode.PARAM_ERROR)

// 新代码
ApiResponse.error(ErrorCode.PARAM_ERROR, messageSource = messageSource)
```

**模式 2：ErrorCode + 自定义消息**
```kotlin
// 旧代码
ApiResponse.error(ErrorCode.PARAM_ERROR, e.message)
ApiResponse.error(ErrorCode.PARAM_ERROR, "自定义消息")

// 新代码
ApiResponse.error(ErrorCode.PARAM_ERROR, e.message, messageSource)
ApiResponse.error(ErrorCode.PARAM_ERROR, "自定义消息", messageSource)
```

**模式 3：使用 code + msg（已废弃的方法）**
```kotlin
// 旧代码
ApiResponse.error(ErrorCode.PARAM_ERROR.code, "消息")
ApiResponse.paramError("消息")
ApiResponse.serverError("消息")

// 新代码
ApiResponse.error(ErrorCode.PARAM_ERROR, "消息", messageSource)
ApiResponse.error(ErrorCode.SERVER_ERROR, "消息", messageSource)
```

### 步骤 3：批量查找和替换

使用 IDE 的查找替换功能：

1. **查找模式**：`ApiResponse.error(ErrorCode.`
2. **替换模式**：在方法调用末尾添加 `, messageSource = messageSource)`

**注意**：需要逐个检查，因为有些调用已经有其他参数。

### 示例：CopyTradingController 更新

```kotlin
// 更新前
if (request.accountId <= 0) {
    return ResponseEntity.ok(ApiResponse.error(ErrorCode.PARAM_ACCOUNT_ID_INVALID))
}

// 更新后
if (request.accountId <= 0) {
    return ResponseEntity.ok(ApiResponse.error(ErrorCode.PARAM_ACCOUNT_ID_INVALID, messageSource = messageSource))
}

// 更新前
ApiResponse.error(ErrorCode.PARAM_ERROR, e.message)

// 更新后
ApiResponse.error(ErrorCode.PARAM_ERROR, e.message, messageSource)
```

## 验证

更新完成后，检查：

1. ✅ 所有 Controller 都注入了 MessageSource
2. ✅ 所有 ApiResponse.error() 调用都传入了 messageSource 参数
3. ✅ 编译无错误
4. ✅ 测试 API 响应消息是否正确显示对应语言

## 快速更新脚本（参考）

可以使用以下模式批量更新：

```bash
# 在 IDE 中使用正则表达式查找替换
# 查找：ApiResponse\.error\(ErrorCode\.(\w+)\)\)
# 替换：ApiResponse.error(ErrorCode.$1, messageSource = messageSource)

# 查找：ApiResponse\.error\(ErrorCode\.(\w+),\s*([^,)]+)\)\)
# 替换：ApiResponse.error(ErrorCode.$1, $2, messageSource)
```

## 注意事项

1. **自定义消息**：如果错误消息是硬编码的中文，建议：
   - 优先使用 ErrorCode 的 messageKey（已在语言包中翻译）
   - 如果必须使用自定义消息，确保消息本身也需要国际化（通过 MessageUtils.getMessage()）

2. **向后兼容**：如果前端没有发送语言 Header，后端会使用默认语言（英文）

3. **测试**：更新后测试不同语言下的错误消息显示



## 已完成的 Controller ✅

1. **AccountController** - 完全更新
2. **AuthController** - 完全更新
3. **LeaderController** - 完全更新
4. **UserController** - 完全更新

## 待更新的 Controller

以下 Controller 需要按照相同模式更新：

1. **CopyTradingController** - 已添加 MessageSource，需要更新所有 ApiResponse.error() 调用
2. **CopyTradingTemplateController** - 需要添加 MessageSource 并更新调用
3. **MarketController** - 需要添加 MessageSource 并更新调用
4. **CopyTradingStatisticsController** - 需要添加 MessageSource 并更新调用
5. **ProxyConfigController** - 需要添加 MessageSource 并更新调用
6. **HealthController** - 需要检查是否需要更新

## 更新步骤

### 步骤 1：添加导入和依赖注入

```kotlin
// 1. 添加导入
import com.wrbug.polymarketbot.util.error
import org.springframework.context.MessageSource

// 2. 在构造函数中注入 MessageSource
class YourController(
    private val yourService: YourService,
    private val messageSource: MessageSource  // 添加这一行
) {
    // ...
}
```

### 步骤 2：更新所有 ApiResponse.error() 调用

**模式 1：只有 ErrorCode**
```kotlin
// 旧代码
ApiResponse.error(ErrorCode.PARAM_ERROR)

// 新代码
ApiResponse.error(ErrorCode.PARAM_ERROR, messageSource = messageSource)
```

**模式 2：ErrorCode + 自定义消息**
```kotlin
// 旧代码
ApiResponse.error(ErrorCode.PARAM_ERROR, e.message)
ApiResponse.error(ErrorCode.PARAM_ERROR, "自定义消息")

// 新代码
ApiResponse.error(ErrorCode.PARAM_ERROR, e.message, messageSource)
ApiResponse.error(ErrorCode.PARAM_ERROR, "自定义消息", messageSource)
```

**模式 3：使用 code + msg（已废弃的方法）**
```kotlin
// 旧代码
ApiResponse.error(ErrorCode.PARAM_ERROR.code, "消息")
ApiResponse.paramError("消息")
ApiResponse.serverError("消息")

// 新代码
ApiResponse.error(ErrorCode.PARAM_ERROR, "消息", messageSource)
ApiResponse.error(ErrorCode.SERVER_ERROR, "消息", messageSource)
```

### 步骤 3：批量查找和替换

使用 IDE 的查找替换功能：

1. **查找模式**：`ApiResponse.error(ErrorCode.`
2. **替换模式**：在方法调用末尾添加 `, messageSource = messageSource)`

**注意**：需要逐个检查，因为有些调用已经有其他参数。

### 示例：CopyTradingController 更新

```kotlin
// 更新前
if (request.accountId <= 0) {
    return ResponseEntity.ok(ApiResponse.error(ErrorCode.PARAM_ACCOUNT_ID_INVALID))
}

// 更新后
if (request.accountId <= 0) {
    return ResponseEntity.ok(ApiResponse.error(ErrorCode.PARAM_ACCOUNT_ID_INVALID, messageSource = messageSource))
}

// 更新前
ApiResponse.error(ErrorCode.PARAM_ERROR, e.message)

// 更新后
ApiResponse.error(ErrorCode.PARAM_ERROR, e.message, messageSource)
```

## 验证

更新完成后，检查：

1. ✅ 所有 Controller 都注入了 MessageSource
2. ✅ 所有 ApiResponse.error() 调用都传入了 messageSource 参数
3. ✅ 编译无错误
4. ✅ 测试 API 响应消息是否正确显示对应语言

## 快速更新脚本（参考）

可以使用以下模式批量更新：

```bash
# 在 IDE 中使用正则表达式查找替换
# 查找：ApiResponse\.error\(ErrorCode\.(\w+)\)\)
# 替换：ApiResponse.error(ErrorCode.$1, messageSource = messageSource)

# 查找：ApiResponse\.error\(ErrorCode\.(\w+),\s*([^,)]+)\)\)
# 替换：ApiResponse.error(ErrorCode.$1, $2, messageSource)
```

## 注意事项

1. **自定义消息**：如果错误消息是硬编码的中文，建议：
   - 优先使用 ErrorCode 的 messageKey（已在语言包中翻译）
   - 如果必须使用自定义消息，确保消息本身也需要国际化（通过 MessageUtils.getMessage()）

2. **向后兼容**：如果前端没有发送语言 Header，后端会使用默认语言（英文）

3. **测试**：更新后测试不同语言下的错误消息显示

