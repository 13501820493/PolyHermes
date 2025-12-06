package com.wrbug.polymarketbot.controller

import com.wrbug.polymarketbot.dto.*
import com.wrbug.polymarketbot.enums.ErrorCode
import com.wrbug.polymarketbot.service.SystemConfigService
import com.wrbug.polymarketbot.service.RelayClientService
import kotlinx.coroutines.runBlocking
import org.slf4j.LoggerFactory
import org.springframework.context.MessageSource
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

/**
 * 系统配置控制器
 */
@RestController
@RequestMapping("/api/system/config")
class SystemConfigController(
    private val systemConfigService: SystemConfigService,
    private val relayClientService: RelayClientService,
    private val messageSource: MessageSource
) {
    
    private val logger = LoggerFactory.getLogger(SystemConfigController::class.java)
    
    /**
     * 获取系统配置
     */
    @PostMapping("/get")
    fun getSystemConfig(): ResponseEntity<ApiResponse<SystemConfigDto>> {
        return try {
            val config = systemConfigService.getSystemConfig()
            ResponseEntity.ok(ApiResponse.success(config))
        } catch (e: Exception) {
            logger.error("获取系统配置失败: ${e.message}", e)
            ResponseEntity.ok(ApiResponse.error(ErrorCode.SERVER_ERROR, "获取系统配置失败: ${e.message}", messageSource))
        }
    }
    
    /**
     * 更新 Builder API Key 配置
     */
    @PostMapping("/builder-api-key/update")
    fun updateBuilderApiKey(@RequestBody request: SystemConfigUpdateRequest): ResponseEntity<ApiResponse<SystemConfigDto>> {
        return try {
            val result = systemConfigService.updateBuilderApiKey(request)
            result.fold(
                onSuccess = { config ->
                    ResponseEntity.ok(ApiResponse.success(config))
                },
                onFailure = { e ->
                    logger.error("更新 Builder API Key 配置失败: ${e.message}", e)
                    ResponseEntity.ok(
                        ApiResponse.error(
                            ErrorCode.SERVER_ERROR,
                            "更新 Builder API Key 配置失败: ${e.message}",
                            messageSource
                        )
                    )
                }
            )
        } catch (e: Exception) {
            logger.error("更新 Builder API Key 配置异常: ${e.message}", e)
            ResponseEntity.ok(ApiResponse.error(ErrorCode.SERVER_ERROR, "更新 Builder API Key 配置失败: ${e.message}", messageSource))
        }
    }
    
}

