import ListCourse from '~/components/listCourse';
import { BoxTitle } from '~/services/constants/styled';

const CourseRegister = () => {
    const title = 'Danh sách khóa học'

    return (
        <ListCourse title={title}>
            <BoxTitle>{title}</BoxTitle>
        </ListCourse>
    )
}

export default CourseRegister