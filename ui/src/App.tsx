import { useState } from 'react'
import { Button, Card, Layout, Space, Typography } from 'antd'
import './App.css'

const { Header, Content } = Layout
const { Title, Text } = Typography

function App() {
  const [count, setCount] = useState(0)

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ color: '#fff', display: 'flex', alignItems: 'center' }}>
        <Title level={4} style={{ color: '#fff', margin: 0 }}>
          Inventory Service
        </Title>
      </Header>
      <Content style={{ padding: 24 }}>
        <Card title="Vite + React + TypeScript + Ant Design">
          <Space direction="vertical" size="middle">
            <Text>Count: {count}</Text>
            <Button type="primary" onClick={() => setCount((c) => c + 1)}>
              Increment
            </Button>
          </Space>
        </Card>
      </Content>
    </Layout>
  )
}

export default App
