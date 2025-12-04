import { useState, useEffect } from 'react'
import { Select, Space } from 'antd'
import { GlobalOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation()
  const isMobile = useMediaQuery({ maxWidth: 768 })
  const [currentLang, setCurrentLang] = useState<string>(i18n.language || 'en')

  useEffect(() => {
    setCurrentLang(i18n.language || 'en')
  }, [i18n.language])

  const languages = [
    { value: 'zh-CN', label: '简体中文' },
    { value: 'zh-TW', label: '繁體中文' },
    { value: 'en', label: 'English' }
  ]

  const handleChange = async (value: string) => {
    setCurrentLang(value)
    await i18n.changeLanguage(value)
    // 保存到 localStorage
    localStorage.setItem('i18nextLng', value)
    // 刷新页面以应用 Ant Design 的 locale 和所有翻译
    window.location.reload()
  }

  return (
    <Space>
      <GlobalOutlined style={{ color: '#fff', fontSize: isMobile ? '14px' : '16px' }} />
      <Select
        value={currentLang}
        onChange={handleChange}
        options={languages}
        style={{ 
          width: isMobile ? 100 : 120,
          color: '#fff'
        }}
        dropdownStyle={{ 
          minWidth: 120
        }}
        bordered={false}
        size={isMobile ? 'small' : 'middle'}
      />
    </Space>
  )
}

export default LanguageSwitcher
