import { Link } from 'react-router-dom'
import styled from 'styled-components'
import '~/assets/styles/Logo.css'

interface LogoProps {
    size?: number
}

const LogoText = styled.span<{ $size: number; }>`
    font-size: ${props => props.$size + 'px'};

    @media screen and (max-width: 768px) {
        font-size: 20px;
    }
`

const Logo = ({ size = 24 }: LogoProps) => {
    return (
        <LogoText $size={size} className='logo'>
            <Link to='/'>InfoDocsHub</Link>
        </LogoText>
    )
}

export default Logo