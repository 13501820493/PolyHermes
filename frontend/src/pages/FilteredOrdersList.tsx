import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, Table, Button, Tag, Select, Space, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { apiService } from '../services/api'
import type { FilteredOrder, FilteredOrderListResponse } from '../types'
import { useMediaQuery } from 'react-responsive'
import { formatUSDC } from '../utils'

const { Option } = Select

const FilteredOrdersList: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isMobile = useMediaQuery({ maxWidth: 768 })
  const [loading, setLoading] = useState(false)
  const [filteredOrders, setFilteredOrders] = useState<FilteredOrder[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [filterType, setFilterType] = useState<string | undefined>(undefined)
  
  useEffect(() => {
    if (id) {
      fetchFilteredOrders()
    }
  }, [id, page, filterType])
  
  const fetchFilteredOrders = async () => {
    if (!id) return
    
    setLoading(true)
    try {
      const response = await apiService.copyTrading.getFilteredOrders({
        copyTradingId: parseInt(id),
        filterType: filterType,
        page: page,
        limit: limit
      })
      
      if (response.data.code === 0 && response.data.data) {
        const data: FilteredOrderListResponse = response.data.data
        setFilteredOrders(data.list || [])
        setTotal(data.total || 0)
      } else {
        message.error(response.data.msg || t('filteredOrdersList.fetchFailed') || '获取被过滤订单列表失败')
      }
    } catch (error: any) {
      console.error('获取被过滤订单列表失败:', error)
      message.error(error.message || t('filteredOrdersList.fetchFailed') || '获取被过滤订单列表失败')
    } finally {
      setLoading(false)
    }
  }
  
  const getFilterTypeTag = (type: string) => {
    const typeMap: Record<string, { color: string; label: string }> = {
      'ORDER_DEPTH': { color: 'orange', label: t('filteredOrdersList.filterTypes.orderDepth') || '订单深度不足' },
      'SPREAD': { color: 'red', label: t('filteredOrdersList.filterTypes.spread') || '价差过大' },
      'ORDERBOOK_DEPTH': { color: 'volcano', label: t('filteredOrdersList.filterTypes.orderbookDepth') || '订单簿深度不足' },
      'PRICE_VALIDITY': { color: 'purple', label: t('filteredOrdersList.filterTypes.priceValidity') || '价格不合理' },
      'MARKET_STATUS': { color: 'blue', label: t('filteredOrdersList.filterTypes.marketStatus') || '市场状态不可交易' },
      'ORDERBOOK_ERROR': { color: 'default', label: t('filteredOrdersList.filterTypes.orderbookError') || '订单簿获取失败' },
      'ORDERBOOK_EMPTY': { color: 'default', label: t('filteredOrdersList.filterTypes.orderbookEmpty') || '订单簿为空' },
      'UNKNOWN': { color: 'default', label: t('filteredOrdersList.filterTypes.unknown') || '未知原因' }
    }
    const config = typeMap[type] || typeMap['UNKNOWN']
    return <Tag color={config.color}>{config.label}</Tag>
  }
  
  const getMarketLink = (order: FilteredOrder) => {
    if (order.marketSlug) {
      return `https://polymarket.com/event/${order.marketSlug}`
    }
    if (order.marketId && order.marketId.startsWith('0x')) {
      return `https://polymarket.com/condition/${order.marketId}`
    }
    return null
  }
  
  const columns = [
    {
      title: t('filteredOrdersList.market') || '市场',
      key: 'market',
      width: isMobile ? 150 : 200,
      render: (_: any, record: FilteredOrder) => {
        const link = getMarketLink(record)
        const marketTitle = record.marketTitle || record.marketId.slice(0, 10) + '...'
        return link ? (
          <a href={link} target="_blank" rel="noopener noreferrer" style={{ fontSize: isMobile ? 12 : 14 }}>
            {marketTitle}
          </a>
        ) : (
          <span style={{ fontSize: isMobile ? 12 : 14 }}>{marketTitle}</span>
        )
      }
    },
    {
      title: t('filteredOrdersList.side') || '订单方向',
      key: 'side',
      width: isMobile ? 80 : 100,
      render: (_: any, record: FilteredOrder) => (
        <Tag color={record.side === 'BUY' ? 'green' : 'red'} style={{ fontSize: isMobile ? 11 : 12 }}>
          {record.side === 'BUY' ? (t('order.buy') || '买入') : (t('order.sell') || '卖出')}
        </Tag>
      )
    },
    {
      title: t('filteredOrdersList.outcome') || '市场方向',
      key: 'outcome',
      width: isMobile ? 80 : 100,
      render: (_: any, record: FilteredOrder) => (
        <span style={{ fontSize: isMobile ? 12 : 14 }}>
          {record.outcome || (record.outcomeIndex !== undefined ? `Index ${record.outcomeIndex}` : '-')}
        </span>
      )
    },
    {
      title: t('filteredOrdersList.price') || '价格',
      key: 'price',
      width: isMobile ? 80 : 100,
      render: (_: any, record: FilteredOrder) => (
        <span style={{ fontSize: isMobile ? 12 : 14 }}>{record.price}</span>
      )
    },
    {
      title: t('filteredOrdersList.size') || 'Leader数量',
      key: 'size',
      width: isMobile ? 80 : 100,
      render: (_: any, record: FilteredOrder) => (
        <span style={{ fontSize: isMobile ? 12 : 14 }}>{formatUSDC(record.size)}</span>
      )
    },
    {
      title: t('filteredOrdersList.calculatedQuantity') || '计算数量',
      key: 'calculatedQuantity',
      width: isMobile ? 80 : 100,
      render: (_: any, record: FilteredOrder) => (
        <span style={{ fontSize: isMobile ? 12 : 14 }}>
          {record.calculatedQuantity ? formatUSDC(record.calculatedQuantity) : '-'}
        </span>
      )
    },
    {
      title: t('filteredOrdersList.filterType') || '过滤类型',
      key: 'filterType',
      width: isMobile ? 120 : 150,
      render: (_: any, record: FilteredOrder) => getFilterTypeTag(record.filterType)
    },
    {
      title: t('filteredOrdersList.filterReason') || '过滤原因',
      key: 'filterReason',
      width: isMobile ? 150 : 250,
      ellipsis: true,
      render: (_: any, record: FilteredOrder) => (
        <span style={{ fontSize: isMobile ? 11 : 12 }} title={record.filterReason}>
          {record.filterReason}
        </span>
      )
    },
    {
      title: t('filteredOrdersList.createdAt') || '时间',
      key: 'createdAt',
      width: isMobile ? 120 : 160,
      render: (_: any, record: FilteredOrder) => {
        const date = new Date(record.createdAt)
        const format = isMobile 
          ? `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
          : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`
        return (
          <span style={{ fontSize: isMobile ? 11 : 12 }}>
            {format}
          </span>
        )
      }
    }
  ]
  
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/copy-trading')}
        >
          {t('common.back') || '返回'}
        </Button>
      </div>
      
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <h3 style={{ margin: 0 }}>{t('filteredOrdersList.title') || '被过滤订单列表'}</h3>
          <Space>
            <Select
              placeholder={t('filteredOrdersList.filterByType') || '按类型筛选'}
              value={filterType}
              onChange={(value) => {
                setFilterType(value)
                setPage(1)
              }}
              allowClear
              style={{ width: isMobile ? 120 : 150 }}
            >
              <Option value="ORDER_DEPTH">{t('filteredOrdersList.filterTypes.orderDepth') || '订单深度不足'}</Option>
              <Option value="SPREAD">{t('filteredOrdersList.filterTypes.spread') || '价差过大'}</Option>
              <Option value="ORDERBOOK_DEPTH">{t('filteredOrdersList.filterTypes.orderbookDepth') || '订单簿深度不足'}</Option>
              <Option value="PRICE_VALIDITY">{t('filteredOrdersList.filterTypes.priceValidity') || '价格不合理'}</Option>
              <Option value="MARKET_STATUS">{t('filteredOrdersList.filterTypes.marketStatus') || '市场状态不可交易'}</Option>
              <Option value="ORDERBOOK_ERROR">{t('filteredOrdersList.filterTypes.orderbookError') || '订单簿获取失败'}</Option>
              <Option value="ORDERBOOK_EMPTY">{t('filteredOrdersList.filterTypes.orderbookEmpty') || '订单簿为空'}</Option>
            </Select>
          </Space>
        </div>
        
        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="id"
          loading={loading}
          pagination={{
            current: page,
            pageSize: limit,
            total: total,
            showSizeChanger: false,
            showTotal: (total) => t('common.total') + `: ${total}`,
            onChange: (page) => setPage(page)
          }}
          scroll={{ x: isMobile ? 800 : 'auto' }}
          size={isMobile ? 'small' : 'middle'}
        />
      </Card>
    </div>
  )
}

export default FilteredOrdersList

