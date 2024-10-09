import { Link } from 'react-router-dom'
import '~/assets/styles/Logo.css'

interface LogoProps {
    size?: Number
}

const Logo = ({ size = 24 }: LogoProps) => {
    return (
        <span className='logo' style={{ fontSize: `${size}px` }}>
            <Link to='/'>InfoDocsHub</Link>
        </span>
    )
}

export default Logo