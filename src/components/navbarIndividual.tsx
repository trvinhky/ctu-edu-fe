import { Menu } from 'antd'
import CardAvatar from '~/components/cardAvatar';
import { MenuItem } from '~/services/types/dataType';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

interface NavbarIndividualProps {
    items: MenuItem[]
    name: string
}

const Individual = styled.div`
    width: 100%;
    height: 100vh;
    overflow-x: hidden;
    overflow-y: auto;
`

const NavbarIndividual = ({ items, name }: NavbarIndividualProps) => {
    const location = useLocation();

    return (
        <Individual>
            <CardAvatar name={name} />
            <Menu
                selectedKeys={[location.pathname]}
                mode="inline"
                theme="light"
                items={items}
            />
        </Individual>
    )
}

export default NavbarIndividual