import {
    AuditOutlined,
    BookOutlined,
    DesktopOutlined,
    FileOutlined,
    FolderOutlined,
    KeyOutlined,
    MessageOutlined,
    PicLeftOutlined,
    PieChartOutlined,
    QuestionOutlined,
    TeamOutlined,
    UnorderedListOutlined
} from "@ant-design/icons"
import { Link } from "react-router-dom"
import { MenuItem } from "~/services/types/dataType"

const PATH = {
    HOME: '/',
    SEARCH: '/search',
    SUBJECT: '/subject/:id',
    BUY: '/pay-lesson/:id',
    POST: '/post',
    DETAIL_POST: '/detail-post/:id',
    DETAIL_LESSON: '/detail-lesson/:id',
    CREATE_POST: 'create-post',
    UPDATE_POST: '/update-post/:id',
    LOGIN: '/login',
    AUTH: '/auth',
    FORGOT: '/forgot',
    NEW_PASSWORD: '/new-password',
    REGISTER: '/register',
    DETAIL: '/detail/:id',
    ADMIN: '/admin',
    LOGIN_ADMIN: '/login/admin',
    CREATE_ACCOUNT: 'create-account',
    MANAGER_ACCOUNT: 'manager-account',
    MANAGER_COURSE: 'manager-course',
    MANAGER_SUBJECT: 'manager-subject',
    COURSE_REGISTER: 'course-register',
    CREATE_COURSE: 'create-course',
    MANAGER_QUESTION: 'manager-question',
    CREATE_QUESTION: 'create-question',
    UPDATE_COURSE: '/course-update/:id',
    LIST_COURSE: 'list-course',
    MANAGER_LESSON: '/manager-lesson/:id',
    MANAGER_EXAM: '/manager-exam/:id',
    DETAIL_EXAM: '/exam/:id',
    CREATE_EXAM: '/create-exam/:id',
    UPDATE_EXAM: '/update-exam/:id',
    LIST_STUDENT: '/ist-student',
    QUESTION_RESOURCE: '/question-resource/:id',
    LESSON_RESOURCE: '/lesson-resource/:id',
    LIST_COMMENT: 'list-comment',
    CONTENT_COURSE: '/course/:id',
    LIST_STATUS: 'status',
    MANAGER_CATEGORY: 'manager-category',
    MANAGER_ROLE: 'manager-role',
    MANAGER_OPTION: '/manager-option/:id',
    EXAM_QUESTION: '/exam-question/:id',
    LIST_POST: '/list-post',
    MANAGER_POST: 'manager-post',
    LESSON_BUY: 'lesson-buy',
    QUESTION_EXAM: '/question-exam/:id',
    ADD_QUESTION: '/add-question/:id',
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
        key: 'sub3',
        icon: <PicLeftOutlined />,
        label: 'Quản lý bài đăng',
        children: [
            {
                key: pathAdmin(PATH.MANAGER_POST),
                label: <Link to={PATH.MANAGER_POST}>Danh sách bài đăng</Link>
            },
            {
                key: pathAdmin(PATH.CREATE_POST),
                label: <Link to={PATH.CREATE_POST}>Tạo bài đăng</Link>
            }
        ]
    },
    {
        key: pathAdmin(PATH.LIST_STATUS),
        icon: <UnorderedListOutlined />,
        label: <Link to={PATH.LIST_STATUS}>Danh sách trạng thái</Link>
    },
    {
        key: pathAdmin(PATH.MANAGER_CATEGORY),
        icon: <FileOutlined />,
        label: <Link to={PATH.MANAGER_CATEGORY}>Quản lý loại file</Link>
    },
    {
        key: pathAdmin(PATH.MANAGER_QUESTION),
        icon: <QuestionOutlined />,
        label: <Link to={PATH.MANAGER_QUESTION}>Danh sách câu hỏi</Link>
    }
]

const pathAuth = (path: string) => `${PATH.AUTH}/${path}`

const NAVBARTEACHER: MenuItem[] = [
    {
        key: PATH.AUTH,
        icon: <AuditOutlined />,
        label: <Link to={PATH.AUTH}>Thông tin</Link>,
    },
    {
        key: 'sub1',
        icon: <DesktopOutlined />,
        label: 'Quản lý khóa học',
        children: [
            {
                key: pathAuth(PATH.LIST_COURSE),
                label: <Link to={pathAuth(PATH.LIST_COURSE)}>Danh sách khóa học</Link>
            },
            {
                key: pathAuth(PATH.CREATE_COURSE),
                label: <Link to={pathAuth(PATH.CREATE_COURSE)}>Tạo khóa học</Link>
            }
        ]
    },
    {
        key: 'sub2',
        icon: <PicLeftOutlined />,
        label: 'Quản lý bài đăng',
        children: [
            {
                key: pathAuth(PATH.MANAGER_POST),
                label: <Link to={pathAuth(PATH.MANAGER_POST)}>Danh sách bài đăng</Link>
            },
            {
                key: pathAuth(PATH.CREATE_POST),
                label: <Link to={pathAuth(PATH.CREATE_POST)}>Tạo bài đăng</Link>
            }
        ]
    },
    {
        key: pathAuth(PATH.MANAGER_QUESTION),
        icon: <QuestionOutlined />,
        label: <Link to={pathAuth(PATH.MANAGER_QUESTION)}>Danh sách câu hỏi</Link>
    }
]

const NAVBARSTUDENT: MenuItem[] = [
    {
        key: PATH.AUTH,
        icon: <AuditOutlined />,
        label: <Link to={PATH.AUTH}>Thông tin</Link>
    },
    {
        key: pathAuth(PATH.COURSE_REGISTER),
        icon: <DesktopOutlined />,
        label: <Link to={PATH.COURSE_REGISTER}>Khóa học</Link>
    },
    {
        key: pathAuth(PATH.LESSON_BUY),
        icon: <FolderOutlined />,
        label: <Link to={PATH.LESSON_BUY}>Bài học đã mua</Link>
    },
    {
        key: pathAuth(PATH.LIST_COMMENT),
        icon: <MessageOutlined />,
        label: <Link to={PATH.LIST_COMMENT}>Thảo luận</Link>
    }
]

export {
    PATH,
    NAVBARADMIN,
    NAVBARSTUDENT,
    NAVBARTEACHER,
    pathAdmin,
    pathAuth
}