import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Form, Input, Button, message, Typography, Radio, Space, Alert } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useAccountStore } from '../store/accountStore'
import { 
  getAddressFromPrivateKey, 
  getAddressFromMnemonic,
  getPrivateKeyFromMnemonic,
  isValidWalletAddress, 
  isValidPrivateKey,
  isValidMnemonic
} from '../utils'
import { useMediaQuery } from 'react-responsive'

const { Title } = Typography

type ImportType = 'privateKey' | 'mnemonic'

const AccountImport: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const isMobile = useMediaQuery({ maxWidth: 768 })
  const { importAccount, loading } = useAccountStore()
  const [form] = Form.useForm()
  const [importType, setImportType] = useState<ImportType>('privateKey')
  const [derivedAddress, setDerivedAddress] = useState<string>('')
  const [addressError, setAddressError] = useState<string>('')
  
  // 当私钥输入时，自动推导地址
  const handlePrivateKeyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const privateKey = e.target.value.trim()
    if (!privateKey) {
      setDerivedAddress('')
      setAddressError('')
      return
    }
    
    // 验证私钥格式
    if (!isValidPrivateKey(privateKey)) {
      setAddressError(t('accountImport.privateKeyInvalid'))
      setDerivedAddress('')
      return
    }
    
    try {
      const address = getAddressFromPrivateKey(privateKey)
      setDerivedAddress(address)
      setAddressError('')
      
      // 自动填充钱包地址字段
      form.setFieldsValue({ walletAddress: address })
    } catch (error: any) {
      setAddressError(error.message || t('accountImport.addressError'))
      setDerivedAddress('')
    }
  }
  
  // 当助记词输入时，自动推导地址
  const handleMnemonicChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const mnemonic = e.target.value.trim()
    if (!mnemonic) {
      setDerivedAddress('')
      setAddressError('')
      return
    }
    
    // 验证助记词格式
    if (!isValidMnemonic(mnemonic)) {
      setAddressError(t('accountImport.mnemonicInvalid'))
      setDerivedAddress('')
      return
    }
    
    try {
      const address = getAddressFromMnemonic(mnemonic, 0)
      setDerivedAddress(address)
      setAddressError('')
      
      // 自动填充钱包地址字段
      form.setFieldsValue({ walletAddress: address })
    } catch (error: any) {
      setAddressError(error.message || t('accountImport.addressErrorMnemonic'))
      setDerivedAddress('')
    }
  }
  
  const handleSubmit = async (values: any) => {
    try {
      let privateKey: string
      let walletAddress: string
      
      if (importType === 'privateKey') {
        // 私钥模式
        privateKey = values.privateKey
        walletAddress = values.walletAddress
        
        // 验证推导的地址和输入的地址是否一致
        if (derivedAddress && walletAddress !== derivedAddress) {
          message.error(t('accountImport.walletAddressMismatch'))
          return
        }
      } else {
        // 助记词模式
        if (!values.mnemonic) {
          message.error(t('accountImport.mnemonicRequired'))
          return
        }
        
        // 从助记词导出私钥和地址
        privateKey = getPrivateKeyFromMnemonic(values.mnemonic, 0)
        const derivedAddressFromMnemonic = getAddressFromMnemonic(values.mnemonic, 0)
        
        // 如果用户手动输入了地址，验证是否与推导的地址一致
        if (values.walletAddress) {
          if (values.walletAddress !== derivedAddressFromMnemonic) {
            // 地址不匹配，使用推导的地址（因为私钥是从助记词导出的，必须使用对应的地址）
            message.warning(`${t('accountImport.walletAddressMismatchMnemonic')}: ${derivedAddressFromMnemonic}`)
            walletAddress = derivedAddressFromMnemonic
          } else {
            // 地址匹配，使用用户输入的地址
            walletAddress = values.walletAddress
          }
        } else {
          // 如果用户没有输入地址，使用推导的地址
          walletAddress = derivedAddressFromMnemonic
        }
      }
      
      // 验证钱包地址格式
      if (!isValidWalletAddress(walletAddress)) {
        message.error(t('accountImport.walletAddressInvalid'))
        return
      }
      
      await importAccount({
        privateKey: privateKey,
        walletAddress: walletAddress,
        accountName: values.accountName
      })
      
      message.success(t('accountImport.importSuccess'))
      navigate('/accounts')
    } catch (error: any) {
      message.error(error.message || t('accountImport.importFailed'))
    }
  }
  
  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/accounts')}
          style={{ marginBottom: '16px' }}
        >
          {t('accountImport.back')}
        </Button>
        <Title level={2} style={{ margin: 0 }}>{t('accountImport.title')}</Title>
      </div>
      
      <Card>
        <Alert
          message={t('accountImport.securityTip')}
          description={t('accountImport.securityTipDesc')}
          type="warning"
          showIcon
          style={{ marginBottom: '24px' }}
        />
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          size={isMobile ? 'middle' : 'large'}
        >
          <Form.Item label={t('accountImport.importMethod')}>
            <Radio.Group 
              value={importType} 
              onChange={(e) => {
                setImportType(e.target.value)
                setDerivedAddress('')
                setAddressError('')
                form.setFieldsValue({ walletAddress: '' })
              }}
            >
              <Radio value="privateKey">{t('accountImport.privateKey')}</Radio>
              <Radio value="mnemonic">{t('accountImport.mnemonic')}</Radio>
            </Radio.Group>
          </Form.Item>
          
          {importType === 'privateKey' ? (
            <>
              <Form.Item
                label={t('accountImport.privateKeyLabel')}
                name="privateKey"
                rules={[
                  { required: true, message: t('accountImport.privateKeyRequired') },
                  {
                    validator: (_, value) => {
                      if (!value) return Promise.resolve()
                      if (!isValidPrivateKey(value)) {
                        return Promise.reject(new Error(t('accountImport.privateKeyInvalid')))
                      }
                      return Promise.resolve()
                    }
                  }
                ]}
                help={addressError || (derivedAddress ? `${t('accountImport.derivedAddress')}: ${derivedAddress}` : '')}
                validateStatus={addressError ? 'error' : derivedAddress ? 'success' : ''}
              >
                <Input.TextArea
                  rows={3}
                  placeholder={t('accountImport.privateKeyPlaceholder')}
                  onChange={handlePrivateKeyChange}
                />
              </Form.Item>
              
              <Form.Item
                label={t('accountImport.walletAddress')}
                name="walletAddress"
                rules={[
                  { required: true, message: t('accountImport.walletAddressRequired') },
                  {
                    validator: (_, value) => {
                      if (!value) return Promise.resolve()
                      if (!isValidWalletAddress(value)) {
                        return Promise.reject(new Error(t('accountImport.walletAddressInvalid')))
                      }
                      if (derivedAddress && value !== derivedAddress) {
                        return Promise.reject(new Error(t('accountImport.walletAddressMismatch')))
                      }
                      return Promise.resolve()
                    }
                  }
                ]}
              >
                <Input
                  placeholder={t('accountImport.walletAddressPlaceholder')}
                  readOnly={!!derivedAddress}
                />
              </Form.Item>
            </>
          ) : (
            <>
              <Form.Item
                label={t('accountImport.mnemonicLabel')}
                name="mnemonic"
                rules={[
                  { required: true, message: t('accountImport.mnemonicRequired') },
                  {
                    validator: (_, value) => {
                      if (!value) return Promise.resolve()
                      if (!isValidMnemonic(value)) {
                        return Promise.reject(new Error(t('accountImport.mnemonicInvalid')))
                      }
                      return Promise.resolve()
                    }
                  }
                ]}
                help={addressError || (derivedAddress ? `${t('accountImport.derivedAddress')}: ${derivedAddress}` : '')}
                validateStatus={addressError ? 'error' : derivedAddress ? 'success' : ''}
              >
                <Input.TextArea
                  rows={4}
                  placeholder={t('accountImport.mnemonicPlaceholder')}
                  onChange={handleMnemonicChange}
                />
              </Form.Item>
              
              <Form.Item
                label={t('accountImport.walletAddress')}
                name="walletAddress"
                rules={[
                  { required: true, message: t('accountImport.walletAddressRequired') },
                  {
                    validator: (_, value) => {
                      if (!value) return Promise.resolve()
                      if (!isValidWalletAddress(value)) {
                        return Promise.reject(new Error(t('accountImport.walletAddressInvalid')))
                      }
                      if (derivedAddress && value !== derivedAddress) {
                        return Promise.reject(new Error(t('accountImport.walletAddressMismatchMnemonic')))
                      }
                      return Promise.resolve()
                    }
                  }
                ]}
              >
                <Input
                  placeholder={t('accountImport.walletAddressPlaceholder')}
                  readOnly={!!derivedAddress}
                />
              </Form.Item>
            </>
          )}
          
          <Form.Item
            label={t('accountImport.accountName')}
            name="accountName"
          >
            <Input placeholder={t('accountImport.accountNamePlaceholder')} />
          </Form.Item>
          
          
          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size={isMobile ? 'middle' : 'large'}
              >
                {t('accountImport.importAccount')}
              </Button>
              <Button onClick={() => navigate('/accounts')}>
                {t('common.cancel')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default AccountImport

