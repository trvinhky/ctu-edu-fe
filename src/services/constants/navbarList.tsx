import {
    AuditOutlined,
    ClockCircleOutlined,
    DatabaseOutlined,
    DesktopOutlined,
    DollarOutlined,
    FileOutlined,
    FileTextOutlined,
    FolderOutlined,
    HomeOutlined,
    PicLeftOutlined,
    PieChartOutlined,
    SolutionOutlined,
    TeamOutlined,
    UnorderedListOutlined,
    WalletOutlined
} from "@ant-design/icons"
import { Link } from "react-router-dom"
import { MenuItem } from "~/services/types/dataType"

const PATH = {
    HOME: '/',
    SEARCH: '/search',
    FORMAT: '/format/:id',
    BUY: '/pay-document/:id',
    POINT: '/point',
    STORE: '/store',
    DETAIL_POST: '/detail-post/:id',
    DETAIL_DOCUMENT: '/detail-document/:id',
    CREATE_POST: 'create-post',
    UPDATE_POST: '/update-post/:id',
    LOGIN: '/login',
    AUTH: '/auth',
    CHECK: '/check/:order',
    FORGOT: '/forgot',
    NEW_PASSWORD: '/new-password',
    REGISTER: '/register',
    DETAIL_STORE: '/detail-store/:id',
    ADMIN: '/admin',
    CREATE_ACCOUNT: 'create-account',
    MANAGER_ACCOUNT: 'manager-account',
    REVENUE: 'revenue',
    MANAGER_STORE: 'manager-store',
    MANAGER_POINT: 'manager-point',
    LIST_STORE: 'list-store',
    LIST_HISTORY: 'list-history',
    MANAGER_DOCUMENT: 'manager-document',
    LIST_STATUS: 'status',
    MANAGER_FORMAT: 'manager-format',
    LIST_POST: '/list-post',
    MANAGER_POST: 'manager-post',
    DOCUMENT_BUY: 'document-buy'
}

const NAVBARHEADER = [
    {
        key: PATH.HOME,
        icon: <HomeOutlined />,
        label: <Link to={PATH.HOME}>Trang chủ </Link>,
    },
    {
        key: PATH.SEARCH,
        icon: <DesktopOutlined />,
        label: <Link to={PATH.SEARCH}>Tài liệu </Link>,
    },
    {
        key: PATH.STORE,
        icon: <DatabaseOutlined />,
        label: <Link to={PATH.STORE}>Kho </Link>,
    },
    {
        key: PATH.LIST_POST,
        icon: <SolutionOutlined />,
        label: <Link to={PATH.LIST_POST}>Bài đăng </Link>,
    },
    {
        key: PATH.POINT,
        icon: <DollarOutlined />,
        label: <Link to={PATH.POINT}>Nạp điểm </Link>,
    },
]

const pathAdmin = (path: string) => `${PATH.ADMIN}/${path}`

const NAVBARADMIN: MenuItem[] = [
    {
        key: PATH.ADMIN,
        icon: <PieChartOutlined />,
        label: <Link to={PATH.ADMIN}>Trang chủ Admin</Link>,
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
        key: pathAdmin(PATH.MANAGER_FORMAT),
        icon: <FileOutlined />,
        label: <Link to={PATH.MANAGER_FORMAT}>Quản lý định dạng file</Link>
    },
    {
        key: pathAdmin(PATH.MANAGER_STORE),
        icon: <DatabaseOutlined />,
        label: <Link to={PATH.MANAGER_STORE}>Quản lý kho tài liệu</Link>
    },
    {
        key: pathAdmin(PATH.MANAGER_DOCUMENT),
        icon: <FileTextOutlined />,
        label: <Link to={PATH.MANAGER_DOCUMENT}>Quản lý tài liệu</Link>
    },
    {
        key: pathAdmin(PATH.MANAGER_POINT),
        icon: <DollarOutlined />,
        label: <Link to={PATH.MANAGER_POINT}>Danh sách gói nạp</Link>
    },
    {
        key: pathAdmin(PATH.REVENUE),
        icon: <WalletOutlined />,
        label: <Link to={PATH.REVENUE}>Danh thu</Link>
    }
]

const pathAuth = (path: string) => `${PATH.AUTH}/${path}`

const NAVBARAUTH: MenuItem[] = [
    {
        key: PATH.AUTH,
        icon: <AuditOutlined />,
        label: <Link to={PATH.AUTH}>Thông tin</Link>,
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
        key: pathAuth(PATH.DOCUMENT_BUY),
        icon: <FolderOutlined />,
        label: <Link to={PATH.DOCUMENT_BUY}>Tài liệu đã mua</Link>
    },
    {
        key: pathAuth(PATH.LIST_HISTORY),
        icon: <ClockCircleOutlined />,
        label: <Link to={PATH.LIST_HISTORY}>Lịch sử nạp</Link>
    }
]

export {
    PATH,
    NAVBARADMIN,
    NAVBARAUTH,
    pathAdmin,
    pathAuth,
    NAVBARHEADER
}