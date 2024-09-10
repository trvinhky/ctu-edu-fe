import { ReactNode } from 'react';
import '~/assets/styles/GlobalStyles.css'

interface GlobalStylesProps {
    children: ReactNode;
}

const GlobalStyles = ({ children }: GlobalStylesProps) => {
    return children
}

export default GlobalStyles