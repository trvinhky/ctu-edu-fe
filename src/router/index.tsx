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
    ManagerSubject,
    Search,
    Detail,
    Info,
    CourseRegister,
    ListReview,
    ListComment,
    FormCourse,
    ManagerCourse,
    ContentCourse,
    ManagerQuestion,
    ManagerLesson,
    ManagerExam,
    DetailExam,
    FormExam,
    LoginAdmin,
    ForgotPassword,
    NewPassword,
    NotFound,
    ManagerRole,
    ListStatus,
    ListType,
    ManagerCategory,
    ManagerOption,
    ManagerPost,
    FormPost,
    Subject,
    ListPost
} from '~/pages';
import { useGlobalDataContext } from "~/hooks/globalData"
import Loading from "~/components/loading"
import AdminTemplate from "~/templates/adminTemplate"
import GuardTemplate from "~/templates/guardTemplate"

const AppRouter = () => {
    const { isLoading } = useGlobalDataContext();

    return (
        <>
            <Routes>
                <Route path='/' element={<DefaultTemplate />}>
                    <Route index element={<Home />} />
                    <Route path={PATH.SEARCH} element={<Search />} />
                    <Route path={PATH.SUBJECT} element={<Subject />} />
                    <Route path={PATH.DETAIL} element={<Detail />} />
                    <Route path={PATH.CONTENT_COURSE} element={<ContentCourse />} />
                    <Route path={PATH.LIST_POST} element={<ListPost />} />
                    <Route path={PATH.CONTENT_COURSE} element={<ContentCourse />} />
                </Route>
                <Route path='/' element={<GuardTemplate />}>
                    <Route path={PATH.MANAGER_OPTION} element={<ManagerOption />} />
                    <Route path={PATH.UPDATE_COURSE} element={<FormCourse isEdit />} />
                    <Route path={PATH.UPDATE_POST} element={<FormPost />} />
                    <Route path={PATH.MANAGER_LESSON} element={<ManagerLesson />} />
                    <Route path={PATH.MANAGER_EXAM} element={<ManagerExam />} />
                    <Route path={PATH.CREATE_EXAM} element={<FormExam />} />
                    <Route path={PATH.UPDATE_EXAM} element={<FormExam isEdit />} />
                </Route>
                <Route path='/' element={<FormTemplate />}>
                    <Route path={PATH.LOGIN_ADMIN} element={<LoginAdmin />} />
                    <Route path={PATH.LOGIN} element={<Login />} />
                    <Route path={PATH.REGISTER} element={<Register />} />
                    <Route path={PATH.FORGOT} element={<ForgotPassword />} />
                    <Route path={PATH.NEW_PASSWORD} element={<NewPassword />} />
                </Route>
                <Route path={PATH.AUTH} element={<AuthTemplate />}>
                    <Route index element={<Info />} />
                    <Route path={PATH.CREATE_COURSE} element={<FormCourse />} />
                    <Route path={PATH.LIST_COURSE} element={<ManagerCourse />} />
                    <Route path={PATH.MANAGER_POST} element={<ManagerPost />} />
                    <Route path={PATH.CREATE_POST} element={<FormPost />} />
                    <Route path={PATH.MANAGER_QUESTION} element={<ManagerQuestion />} />
                </Route>
                <Route path={PATH.ADMIN} element={<AdminTemplate />}>
                    <Route index element={<Admin />} />
                    <Route path={PATH.MANAGER_ACCOUNT} element={<ListAccount />} />
                    <Route path={PATH.CREATE_ACCOUNT} element={<CreateAccount />} />
                    <Route path={PATH.MANAGER_COURSE} element={<ManagerCourse />} />
                    <Route path={PATH.MANAGER_SUBJECT} element={<ManagerSubject />} />
                    <Route path={PATH.MANAGER_ROLE} element={<ManagerRole />} />
                    <Route path={PATH.CREATE_COURSE} element={<FormCourse />} />
                    <Route path={PATH.LIST_STATUS} element={<ListStatus />} />
                    <Route path={PATH.MANAGER_CATEGORY} element={<ManagerCategory />} />
                    <Route path={PATH.LIST_TYPE} element={<ListType />} />
                    <Route path={PATH.MANAGER_QUESTION} element={<ManagerQuestion />} />
                    <Route path={PATH.MANAGER_POST} element={<ManagerPost isAdmin />} />
                    <Route path={PATH.CREATE_POST} element={<FormPost />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
            {isLoading && <Loading />}
        </>
    )
}

export default AppRouter