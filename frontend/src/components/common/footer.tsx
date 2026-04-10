import { Layout, Typography, Space } from 'antd'
import { YoutubeOutlined, TwitterOutlined, FacebookOutlined } from '@ant-design/icons'

const { Text, Link } = Typography

export default function Footer() {
    return (
        <Layout.Footer
        style={{backgroundColor: '#1a1a2e', padding: '16px 24px', display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', flexWrap: 'wrap', gap: 8,
        }}
        >
            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
                &copy;2025 All Rights Reserved.
                </Text>
                <Space size="middle">
                    <YoutubeOutlined style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }} />
                    <TwitterOutlined style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }} />
                    <FacebookOutlined style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }} />
                </Space>

            <Space size="large">
                <Link style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Contact us</Link>
                <Link style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Privacy Policies</Link>
                <Link style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Help</Link>
                </Space>
                </Layout.Footer>
    )
}