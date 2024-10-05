import { ExclamationCircleFilled, EyeOutlined, FileUnknownOutlined } from "@ant-design/icons"
import { Flex, Modal } from "antd"
import { Link } from "react-router-dom"
import styled from "styled-components"
import { useGlobalDataContext } from "~/hooks/globalData"
import ExamAPI from "~/services/actions/exam"
import { convertDate, DATEFORMAT_FULL } from "~/services/constants"
import { PATH } from "~/services/constants/navbarList"
import { ExamInfo } from "~/services/types/exam"
import ButtonDelete from "~/services/utils/buttonDelete"
import ButtonEdit from "~/services/utils/buttonEdit"
import ButtonLinkCustom from "~/services/utils/buttonLinkCustom"

const Wrapper = styled.div`
    padding: 10px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    overflow: hidden;
`

const Box = styled.div`
    h4 {
        font-size: 18px;
        font-weight: 600;
    }
`

interface ExamProps {
    data: ExamInfo
    id: string
    getAllExams: (page?: number, course?: string, limit?: number) => Promise<void>
}

const ExamBox = ({ data, id, getAllExams }: ExamProps) => {
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const confirmDelete = async (idFind: string) => {
        setIsLoading(true)
        try {
            const { message, status } = await ExamAPI.delete(idFind)
            if (status === 200) await getAllExams(1, id, 6)
            messageApi.open({
                type: status === 200 ? 'success' : 'error',
                content: message,
                duration: 3,
            });
        } catch (e) {
            messageApi.open({
                type: 'error',
                content: 'Có lỗi xảy ra! Vui lòng thử lại sau!',
                duration: 3,
            });
        }
        setIsLoading(false)
    }

    const showPromiseConfirm = (id: string) => {
        Modal.confirm({
            title: 'Bạn có chắc muốn xóa bài thi này?',
            icon: <ExclamationCircleFilled />,
            cancelText: 'Hủy',
            async onOk() {
                await confirmDelete(id)
            },
            onCancel() { },
        });
    };

    return (
        <Wrapper>
            <Flex gap={10} justify="space-between" align="flex-start">
                <FileUnknownOutlined style={{ fontSize: '35px' }} />
                <Box>
                    <h4>{data.exam_title}</h4>
                    <p>
                        {data.exam_description}
                    </p>
                    <Flex gap={10} style={{ marginTop: '8px' }}>
                        {
                            data.exam_start_time &&
                            <span>{convertDate(data.exam_start_time.toString(), DATEFORMAT_FULL)}</span>
                        }
                        <span>Thời gian: {data.exam_limit} phút</span>
                        <span>Tổng điểm: {data.exam_total_score}</span>
                    </Flex>
                    <Flex justify="flex-end" gap={10} style={{ paddingTop: '15px' }}>
                        <ButtonLinkCustom href={PATH.DETAIL_EXAM.replace(':id', data.exam_Id as string)} shape="default">
                            <EyeOutlined />
                        </ButtonLinkCustom>
                        <Link to={PATH.UPDATE_EXAM.replace(':id', data.exam_Id as string)}>
                            <ButtonEdit />
                        </Link>
                        <div onClick={() => showPromiseConfirm(data.exam_Id as string)}>
                            <ButtonDelete />
                        </div>
                    </Flex>
                </Box>
            </Flex>
        </Wrapper>
    )
}

export default ExamBox