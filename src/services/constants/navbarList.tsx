import {
    AuditOutlined,
    BookOutlined,
    DesktopOutlined,
    FileOutlined,
    KeyOutlined,
    LikeOutlined,
    MessageOutlined,
    PieChartOutlined,
    QuestionOutlined,
    TagOutlined,
    TeamOutlined,
    UnorderedListOutlined
} from "@ant-design/icons"
import { Link } from "react-router-dom"
import { MenuItem } from "~/services/types/dataType"

const PATH = {
    HOME: '/',
    SEARCH: '/search',
    SUBJECT: '/subject/:id',
    LOGIN: '/login',
    FORGOT: '/forgot',
    NEW_PASSWORD: '/new-password',
    REGISTER: '/register',
    DETAIL: '/detail/:id',
    ADMIN: '/admin',
    LOGIN_ADMIN: '/login/admin',
    INFO: '/info',
    CREATE_ACCOUNT: 'create-account',
    MANAGER_ACCOUNT: 'manager-account',
    MANAGER_COURSE: 'manager-course',
    MANAGER_SUBJECT: 'manager-subject',
    COURSE_REGISTER: 'course-register',
    MANAGER_REVIEW: 'manager-review',
    CREATE_COURSE: 'create-course',
    MANAGER_QUESTION: 'manager-question',
    CREATE_QUESTION: 'create-question',
    UPDATE_COURSE: 'course-update/:id',
    LIST_COURSE: 'list-course',
    MANAGER_LESSON: 'manager-lesson/:id',
    MANAGER_EXAM: 'manager-exam/:id',
    DETAIL_EXAM: '/exam/:id',
    CREATE_EXAM: 'create-exam/:id',
    UPDATE_EXAM: 'update-exam/:id',
    LIST_STUDENT: '/ist-student',
    QUESTION_RESOURCE: 'question-resource/:id',
    LIST_COMMENT: 'list-comment',
    CONTENT_COURSE: '/course/:id',
    LIST_STATUS: 'status',
    MANAGER_CATEGORY: 'manager-category',
    LIST_TYPE: 'list-type',
    MANAGER_ROLE: 'manager-role'
}

const pathAdmin = (path: string) => `${PATH.ADMIN}/${path}`

const NAVBARADMIN: MenuItem[] = [
    {
        key: PATH.ADMIN,
        icon: <PieChartOutlined />,
        label: <Link to={PATH.ADMIN}>Trang chủ Admin</Link>,
    },
    {
        key: pathAdmin(PATH.MANAGER_ROLE),
        icon: <KeyOutlined />,
        label: <Link to={PATH.MANAGER_ROLE}>Quản lý quyền</Link>
    },
    {
        key: 'sub1',
        icon: <TeamOutlined />,
        label: 'Quản lý tài khoản',
        children: [
            {
                key: pathAdmin(PATH.MANAGER_ACCOUNT),
                label: <Link to={PATH.MANAGER_ACCOUNT}>Danh sách tài khoản</Link>
            },
            {
                key: pathAdmin(PATH.CREATE_ACCOUNT),
                label: <Link to={PATH.CREATE_ACCOUNT}>Tạo tài khoản</Link>
            }
        ]
    },
    {
        key: pathAdmin(PATH.MANAGER_SUBJECT),
        icon: <BookOutlined />,
        label: <Link to={PATH.MANAGER_SUBJECT}>Quản lý môn học</Link>
    },
    {
        key: 'sub2',
        icon: <DesktopOutlined />,
        label: 'Quản lý khóa học',
        children: [
            {
                key: pathAdmin(PATH.MANAGER_COURSE),
                label: <Link to={PATH.MANAGER_COURSE}>Danh sách khóa học</Link>
            },
            {
                key: pathAdmin(PATH.CREATE_COURSE),
                label: <Link to={PATH.CREATE_COURSE}>Tạo khóa học</Link>
            }
        ]
    },
    {
        key: pathAdmin(PATH.LIST_STATUS),
        icon: <UnorderedListOutlined />,
        label: <Link to={PATH.LIST_STATUS}>Danh sách trạng thái</Link>
    },
    {
        key: pathAdmin(PATH.LIST_TYPE),
        icon: <TagOutlined />,
        label: <Link to={PATH.LIST_TYPE}>Danh sách loại câu hỏi</Link>
    },
    {
        key: 'sub3',
        icon: <QuestionOutlined />,
        label: 'Quản lý câu hỏi',
        children: [
            {
                key: pathAdmin(PATH.MANAGER_QUESTION),
                label: <Link to={PATH.MANAGER_QUESTION}>Danh sách câu hỏi</Link>
            },
            {
                key: pathAdmin(PATH.CREATE_QUESTION),
                label: <Link to={PATH.CREATE_QUESTION}>Tạo câu hỏic</Link>
            }
        ]
    },
    {
        key: pathAdmin(PATH.MANAGER_CATEGORY),
        icon: <FileOutlined />,
        label: <Link to={PATH.MANAGER_CATEGORY}>Quản lý loại file</Link>
    }
]

const NAVBARTEACHER: MenuItem[] = [
    {
        key: PATH.INFO,
        icon: <AuditOutlined />,
        label: <Link to={PATH.INFO}>Thông tin</Link>,
    },
    {
        key: 'sub1',
        icon: <DesktopOutlined />,
        label: 'Quản lý khóa học',
        children: [
            {
                key: PATH.LIST_COURSE,
                label: <Link to={PATH.INFO}>Danh sách khóa học</Link>
            },
            {
                key: PATH.CREATE_COURSE,
                label: <Link to={PATH.CREATE_COURSE}>Tạo khóa học</Link>
            }
        ]
    },
    {
        key: PATH.MANAGER_QUESTION,
        icon: <QuestionOutlined />,
        label: <Link to={PATH.CREATE_COURSE}>Câu hỏi</Link>,
    },
    {
        key: PATH.LIST_COMMENT,
        icon: <MessageOutlined />,
        label: <Link to={PATH.CREATE_COURSE}>Thảo luận</Link>
    }

]

const NAVBARSTUDENT: MenuItem[] = [
    {
        key: PATH.INFO,
        icon: <AuditOutlined />,
        label: <Link to={PATH.CREATE_COURSE}>Thông tin</Link>
    },
    {
        key: PATH.COURSE_REGISTER,
        icon: <DesktopOutlined />,
        label: <Link to={PATH.COURSE_REGISTER}>Khóa học</Link>
    },
    {
        key: PATH.LIST_COMMENT,
        icon: <MessageOutlined />,
        label: <Link to={PATH.LIST_COMMENT}>Thảo luận</Link>
    },
    {
        key: PATH.MANAGER_REVIEW,
        icon: <LikeOutlined />,
        label: <Link to={PATH.MANAGER_REVIEW}>Review</Link>
    },
]

export {
    PATH,
    NAVBARADMIN,
    NAVBARSTUDENT,
    NAVBARTEACHER
}