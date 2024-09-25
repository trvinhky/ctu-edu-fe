import { Route, Routes } from "react-router-dom"
import { PATH } from "~/services/constants/navbarList"
import DefaultTemplate from "~/templates/defaultTemplate"
import FormTemplate from "~/templates/formTemplate"
import InfoTemplate from "~/templates/infoTemplate"
import {
    Home,
    Register,
    Admin,
    ListAccount,
    CreateAccount,
    Login,
    ManagerSubject,
    Search,
    Field,
    Detail,
    Info,
    CourseRegister,
    ListReview,
    ListComment,
    FormCourse,
    ManagerCourse,
    ContentCourse,
    ManagerQuestion,
    QuestionResource,
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
    ManagerCategory
} from '~/pages';
import { useGlobalDataContext } from "~/hooks/globalData"
import Loading from "~/components/loading"
import AdminTemplate from "~/templates/adminTemplate"

const AppRouter = () => {
    const { isLoading } = useGlobalDataContext();

    return (
        <>
            <Routes>
                <Route path='/' element={<DefaultTemplate />}>
                    <Route index element={<Home />} />
                    <Route path={PATH.SEARCH} element={<Search />} />
                    <Route path={PATH.SUBJECT} element={<Field />} />
                    <Route path={PATH.DETAIL} element={<Detail />} />
                    <Route path={PATH.CONTENT_COURSE} element={<ContentCourse />} />
                </Route>
                <Route path='/' element={<FormTemplate />}>
                    <Route path={PATH.LOGIN_ADMIN} element={<LoginAdmin />} />
                    <Route path={PATH.LOGIN} element={<Login />} />
                    <Route path={PATH.REGISTER} element={<Register />} />
                    <Route path={PATH.FORGOT} element={<ForgotPassword />} />
                    <Route path={PATH.NEW_PASSWORD} element={<NewPassword />} />
                    <Route path={PATH.UPDATE_COURSE} element={<FormCourse isEdit={true} />} />
                </Route>
                <Route path='/' element={<InfoTemplate />}>
                    <Route path={PATH.INFO} element={<Info />} />
                    <Route path={PATH.COURSE_REGISTER} element={<CourseRegister />} />
                    <Route path={PATH.MANAGER_REVIEW} element={<ListReview />} />
                    <Route path={PATH.LIST_COMMENT} element={<ListComment />} />
                    <Route path={PATH.CREATE_COURSE} element={<FormCourse />} />
                    <Route path={PATH.LIST_COURSE} element={<ManagerCourse />} />
                    <Route path={PATH.MANAGER_QUESTION} element={<ManagerQuestion />} />
                    <Route path={PATH.QUESTION_RESOURCE} element={<QuestionResource />} />
                    <Route path={PATH.MANAGER_LESSON} element={<ManagerLesson />} />
                    <Route path={PATH.MANAGER_EXAM} element={<ManagerExam />} />
                    <Route path={PATH.DETAIL_EXAM} element={<DetailExam />} />
                    <Route path={PATH.CREATE_EXAM} element={<FormExam />} />
                    <Route path={PATH.UPDATE_EXAM} element={<FormExam isEdit={true} />} />
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
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
            {isLoading && <Loading />}
        </>
    )
}

export default AppRouter