import {
    AuditOutlined,
    BookOutlined,
    DesktopOutlined,
    LikeOutlined,
    MessageOutlined,
    PieChartOutlined,
    QuestionOutlined,
    TeamOutlined
} from "@ant-design/icons"
import { NavBarItem } from "~/services/types/dataType"

const PATH = {
    HOME: '/',
    SEARCH: '/search',
    FIELD: '/field/:id',
    LOGIN: '/login',
    REGISTER: '/register',
    DETAIL: '/detail/:id',
    /* admin */
    ADMIN: '/admin',
    LOGIN_ADMIN: '/login/admin',
    CREATE_ACCOUNT: '/admin/create-account',
    MANAGER_ACCOUNT: '/admin/manager-account',
    MANAGER_COURSE: '/admin/manager-course',
    MANAGER_FIELD: '/admin/manager-field',
    CREATE_FIELD: '/admin/create-field',
    /* student */
    COURSE_REGISTER: '/info/course/:id',
    MANAGER_REVIEW: '/info/review/:id',
    /* teacher */
    CREATE_COURSE: '/teacher/course-create/:id',
    MANAGER_QUESTION: '/teacher/manager-question/:id',
    UPDATE_COURSE: '/course-update/:id',
    LIST_COURSE: '/teacher/list-course/:id',
    MANAGER_LESSON: '/teacher/manager-lesson/:id',
    MANAGER_EXAM: '/teacher/exam/:id',
    DETAIL_EXAM: '/exam/:id',
    CREATE_EXAM: '/exam-create/:id',
    UPDATE_EXAM: '/exam-update/:id',
    LIST_STUDENT: '/teacher/list-student/:id',
    QUESTION_RESOURCE: '/question-resource/:id',
    /* other */
    INFO: '/info/:id',
    LIST_COMMENT: '/info/comment/:id',
    CONTENT_COURSE: '/course/:id'
}

const NAVBARADMIN: NavBarItem[] = [
    {
        key: '1',
        icon: <PieChartOutlined />,
        label: 'Trang chủ Admin',
        href: PATH.ADMIN
    },
    {
        key: 'sub1',
        icon: <TeamOutlined />,
        label: 'Quản lý tài khoản',
        children: [
            {
                key: '2',
                label: 'Danh sách tài khoản',
                href: PATH.MANAGER_ACCOUNT
            },
            {
                key: '3',
                label: 'Tạo tài khoản',
                href: PATH.CREATE_ACCOUNT
            }
        ]
    },
    {
        key: '4',
        icon: <BookOutlined />,
        label: 'Danh sách lĩnh vực',
        href: PATH.MANAGER_FIELD
    },
    {
        key: '5',
        icon: <DesktopOutlined />,
        label: 'Danh sách khóa học',
        href: PATH.MANAGER_COURSE
    }
]

const NAVBARTEACHER: NavBarItem[] = [
    {
        key: '1',
        icon: <AuditOutlined />,
        label: 'Thông tin',
        href: PATH.INFO
    },
    {
        key: 'sub1',
        icon: <DesktopOutlined />,
        label: 'Quản lý khóa học',
        children: [
            {
                key: '2',
                label: 'Danh sách khóa học',
                href: PATH.LIST_COURSE
            },
            {
                key: '3',
                label: 'Tạo khóa học',
                href: PATH.CREATE_COURSE
            }
        ]
    },
    {
        key: '4',
        icon: <QuestionOutlined />,
        label: 'Câu hỏi',
        href: PATH.MANAGER_QUESTION
    },
    {
        key: '5',
        icon: <MessageOutlined />,
        label: 'Thảo luận',
        href: PATH.LIST_COMMENT
    }

]

const NAVBARSTUDENT: NavBarItem[] = [
    {
        key: '1',
        icon: <AuditOutlined />,
        label: 'Thông tin',
        href: PATH.INFO
    },
    {
        key: '2',
        icon: <DesktopOutlined />,
        label: 'Khóa học',
        href: PATH.COURSE_REGISTER
    },
    {
        key: '3',
        icon: <MessageOutlined />,
        label: 'Thảo luận',
        href: PATH.LIST_COMMENT
    },
    {
        key: '4',
        icon: <LikeOutlined />,
        label: 'Review',
        href: PATH.MANAGER_REVIEW
    },
]

const getItemNavbarByKeyOrHref = (items: NavBarItem[], check: string, type: string) => {
    let result = items.find(
        (val) => (type === 'key' ? val.key : val.href) === check
    )

    if (result) return result

    for (const item of items) {
        const child = item.children?.find(
            (val) => (type === 'key' ? val.key : val.href) === check
        )
        if (child) {
            return child
        }
    }
}

export {
    PATH,
    NAVBARADMIN,
    NAVBARSTUDENT,
    NAVBARTEACHER,
    getItemNavbarByKeyOrHref
}