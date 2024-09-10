import ListCourse from '~/components/listCourse';
import { Title } from '~/services/constants/styled';

const ManagerCourse = () => {
    const title = 'Danh sách khóa học'

    return (
        <>
            <ListCourse title={title} isAction={true}>
                <Title>{title}</Title>
            </ListCourse>
        </>
    )
}

export default ManagerCourse