import { Route, Routes } from "react-router-dom"
import { PATH } from "~/services/constants/navbarList"
import DefaultTemplate from "~/templates/defaultTemplate"
import FormTemplate from "~/templates/formTemplate"
import AuthTemplate from "~/templates/authTemplate"
import {
    Home,
    Register,
    Admin,
    ListAccount,
    CreateAccount,
    Login,
    Info,
    ForgotPassword,
    NewPassword,
    NotFound,
    ListStatus,
    ManagerPost,
    FormPost,
    ManagerPoint,
    Revenue,
    ManagerFormat,
    ManagerStore,
    DetailStore,
    DetailDocument,
    DetailPost,
    Search,
    ListPost,
    ListBuy,
    Point,
    ListHistory,
    ManagerDocument,
    ListStore,
    CheckOrder
} from '~/pages';
import { useGlobalDataContext } from "~/hooks/globalData"
import Loading from "~/components/loading"
import AdminTemplate from "~/templates/adminTemplate"
import GuardTemplate from "~/templates/guardTemplate"
import { useEffect } from "react"

const AppRouter = () => {
    const { isLoading } = useGlobalDataContext();
    useEffect(() => {
        const handleCopy = (e: ClipboardEvent) => {
            e.preventDefault();
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                e.key === "F12" ||
                (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "C"))
            ) {
                e.preventDefault();
            }
        };

        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("copy", handleCopy);
        document.addEventListener("contextmenu", handleContextMenu);


        return () => {
            document.removeEventListener("copy", handleCopy);
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("contextmenu", handleContextMenu);
        };
    }, []);

    return (
        <>
            <Routes>
                <Route path='/' element={<DefaultTemplate />}>
                    <Route index element={<Home />} />
                    <Route path={PATH.DETAIL_STORE} element={<DetailStore />} />
                    <Route path={PATH.DETAIL_DOCUMENT} element={<DetailDocument />} />
                    <Route path={PATH.DETAIL_POST} element={<DetailPost />} />
                    <Route path={PATH.SEARCH} element={<Search />} />
                    <Route path={PATH.LIST_POST} element={<ListPost />} />
                    <Route path={PATH.POINT} element={<Point />} />
                    <Route path={PATH.STORE} element={<ListStore />} />
                </Route>
                <Route path='/' element={<GuardTemplate isUser />}>
                    <Route path={PATH.UPDATE_POST} element={<FormPost />} />
                    <Route path={PATH.CHECK} element={<CheckOrder />} />
                </Route>
                <Route path='/' element={<FormTemplate />}>
                    <Route path={PATH.LOGIN} element={<Login />} />
                    <Route path={PATH.REGISTER} element={<Register />} />
                    <Route path={PATH.FORGOT} element={<ForgotPassword />} />
                    <Route path={PATH.NEW_PASSWORD} element={<NewPassword />} />
                </Route>
                <Route path={PATH.AUTH} element={<AuthTemplate />}>
                    <Route index element={<Info />} />
                    <Route path={PATH.DOCUMENT_BUY} element={<ListBuy />} />
                    <Route path={PATH.LIST_HISTORY} element={<ListHistory />} />
                    <Route path={PATH.MANAGER_POST} element={<ManagerPost />} />
                    <Route path={PATH.CREATE_POST} element={<FormPost />} />
                </Route>
                <Route path={PATH.ADMIN} element={<AdminTemplate />}>
                    <Route index element={<Admin />} />
                    <Route path={PATH.MANAGER_ACCOUNT} element={<ListAccount />} />
                    <Route path={PATH.CREATE_ACCOUNT} element={<CreateAccount />} />
                    <Route path={PATH.LIST_STATUS} element={<ListStatus />} />
                    <Route path={PATH.MANAGER_POST} element={<ManagerPost isAdmin />} />
                    <Route path={PATH.CREATE_POST} element={<FormPost />} />
                    <Route path={PATH.MANAGER_POINT} element={<ManagerPoint />} />
                    <Route path={PATH.REVENUE} element={<Revenue />} />
                    <Route path={PATH.MANAGER_FORMAT} element={<ManagerFormat />} />
                    <Route path={PATH.MANAGER_STORE} element={<ManagerStore />} />
                    <Route path={PATH.MANAGER_DOCUMENT} element={<ManagerDocument />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
            {isLoading && <Loading />}
        </>
    )
}

export default AppRouter