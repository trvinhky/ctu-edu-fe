import { EditOutlined } from '@ant-design/icons'
import { Button } from 'antd'

interface BtnProps {
    shape?: "circle" | "default" | "round"
    text?: string
    htmlType?: "button" | "submit" | "reset"
    form?: string
}

const ButtonEdit = ({ shape, text, htmlType, form }: BtnProps) => {
    return (
        <Button
            type="primary"
            style={{ backgroundColor: '#f39c12' }}
            shape={shape}
            htmlType={htmlType}
            form={form}
        >
            {text ?? <EditOutlined />}
        </Button>
    )
}

export default ButtonEdit