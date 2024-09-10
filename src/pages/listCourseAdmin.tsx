import ListCourse from '~/components/listCourse';
import { Title } from '~/services/constants/styled';

const ListCourseAdmin = () => {
    const title = 'Danh sách khóa học'

    return (
        <section>
            <ListCourse title={title}>
                <Title>{title}</Title>
            </ListCourse>
        </section>
    )
}

export default ListCourseAdmin