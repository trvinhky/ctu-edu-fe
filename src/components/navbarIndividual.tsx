import { Menu, MenuProps } from 'antd'
import CardAvatar from '~/components/cardAvatar';
import { MenuItem, NavBarItem } from '~/services/types/dataType';
import { getItemNavbarByKeyOrHref } from '~/services/constants/navbarList';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useEffect, useState } from 'react';

interface NavbarIndividualProps {
    items: MenuItem[]
}

const Individual = styled.div`
    width: 100%;
    height: 100vh;
    overflow-x: hidden;
    overflow-y: auto;
`

const NavbarIndividual = ({ items }: NavbarIndividualProps) => {
    const navigate = useNavigate()
    const location = useLocation();
    const [active, setActive] = useState('1')

    useEffect(() => {
        const item = getItemNavbarByKeyOrHref(items as NavBarItem[], location.pathname, 'href')
        setActive(item?.key || '1')
    }, [location.pathname])

    const onNavigateTo: MenuProps['onClick'] = (e) => {
        const item = getItemNavbarByKeyOrHref(items as NavBarItem[], e.key, 'key')
        navigate(item?.href as string);
    };

    return (
        <Individual>
            <CardAvatar />
            <Menu
                defaultSelectedKeys={['1']}
                selectedKeys={[active]}
                mode="inline"
                theme="light"
                items={items}
                onClick={onNavigateTo}
            />
        </Individual>
    )
}

export default NavbarIndividual