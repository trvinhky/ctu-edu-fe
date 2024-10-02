import { SwapLeftOutlined } from '@ant-design/icons'
import { Flex } from 'antd'
import { useNavigate } from 'react-router-dom'

const ButtonBack = () => {
    const navigate = useNavigate()

    const handleGoBack = () => navigate(-1)

    return (
        <Flex
            align='center'
            justify='center'
            style={{
                cursor: 'pointer',
                fontSize: 35
            }}
            onClick={handleGoBack}
        >
            <SwapLeftOutlined />
        </Flex>
    )
}

export default ButtonBack