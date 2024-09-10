import { DeleteOutlined } from '@ant-design/icons'
import { Button } from 'antd'

interface BtnProps {
    shape?: "circle" | "default" | "round"
}

const ButtonDelete = ({ shape }: BtnProps) => {
    return (
        <Button
            type="primary"
            style={{ backgroundColor: '#e74c3c' }}
            shape={shape}
        >
            <DeleteOutlined />
        </Button>
    )
}

export default ButtonDelete