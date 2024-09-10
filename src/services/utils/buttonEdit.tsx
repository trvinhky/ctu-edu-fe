import { EditOutlined } from '@ant-design/icons'
import { Button } from 'antd'

interface BtnProps {
    shape?: "circle" | "default" | "round"
    text?: string
    htmlType?: "button" | "submit" | "reset"
}

const ButtonEdit = ({ shape, text, htmlType }: BtnProps) => {
    return (
        <Button
            type="primary"
            style={{ backgroundColor: '#f39c12' }}
            shape={shape}
            htmlType={htmlType}
        >
            {text ?? <EditOutlined />}
        </Button>
    )
}

export default ButtonEdit