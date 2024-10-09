import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGlobalDataContext } from "~/hooks/globalData";
import LessonAPI from "~/services/actions/lesson";
import { LessonInfo } from "~/services/types/lesson";
import { Title } from '~/services/constants/styled';
import { Button, Col, Flex, Modal, Row, Typography } from "antd";
import ButtonBack from "~/services/utils/buttonBack";
import styled from "styled-components";
import ViewIcon from "~/components/viewIcon";
import { DollarOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { accountInfoSelector } from "~/services/reducers/selectors";
import BuyAPI from "~/services/actions/buy";

const WrapperIcon = styled.div`
  width: 100%;
  font-size: 40vh;
  padding: 15px 0;
  text-align: center;
`
const SubTitle = styled.h4`
  font-weight: 600;
  font-size: 18px;
`

const BuyLesson = () => {
  const { id } = useParams();
  const navigate = useNavigate()
  const { setIsLoading, messageApi } = useGlobalDataContext();
  const [lessonInfo, setLessonInfo] = useState<LessonInfo>()
  const account = useSelector(accountInfoSelector)
  const [accountId, setAccountId] = useState<string>()

  useEffect(() => {
    document.title = "Thanh toán"
    if (id) {
      if (account) {
        setAccountId(account.account_Id)
      } else navigate(-1)
      getOneLesson(id)
    } else navigate(-1)
  }, [id, account, setAccountId])

  const getOneLesson = async (id: string) => {
    setIsLoading(true)
    try {
      const { status, message, data } = await LessonAPI.getOne(id)
      if (status === 201 && !Array.isArray(data)) {
        setLessonInfo(data)
      } else {
        messageApi.open({
          type: 'error',
          content: message,
          duration: 3,
        });
      }
    } catch (e) {
      messageApi.open({
        type: 'error',
        content: 'Có lỗi xảy ra! Vui lòng thử lại sau!',
        duration: 3,
      });
    }
    setIsLoading(false)
  }

  const payLesson = async (student_Id: string, lesson_Id: string) => {
    setIsLoading(true)
    try {
      const { status, message } = await BuyAPI.create({
        lesson_Id,
        student_Id
      })
      if (status === 200) {
        messageApi.open({
          type: 'success',
          content: message,
          duration: 3,
        });
        setIsLoading(false)
        navigate(-1)
      } else {
        messageApi.open({
          type: 'error',
          content: message,
          duration: 3,
        });
      }
    } catch (e) {
      messageApi.open({
        type: 'error',
        content: 'Có lỗi xảy ra! Vui lòng thử lại sau!',
        duration: 3,
      });
    }
    setIsLoading(false)
  }

  const showPromiseConfirm = () => {
    Modal.confirm({
      title: 'Bạn có chắc muốn mua bài học này?',
      icon: <ExclamationCircleFilled />,
      cancelText: 'Hủy',
      async onOk() {
        if (id && accountId) {
          await payLesson(accountId, id)
        }
      },
      onCancel() { },
    });
  };

  return (
    <section>
      <Title>Thanh toán</Title>
      <Flex justify="flex-start">
        <ButtonBack />
      </Flex>
      {
        lessonInfo &&
        <Row gutter={[16, 16]}>
          <Col span={10}>
            <WrapperIcon>
              <ViewIcon
                url={lessonInfo.lesson_url}
                category={lessonInfo.category.category_name}
              />
            </WrapperIcon>
            <SubTitle>{lessonInfo.lesson_title}</SubTitle>
          </Col>
          <Col span={14}>
            <Typography.Paragraph
              ellipsis={{ rows: 4, expandable: false }}
              style={{
                textAlign: 'left'
              }}
            >
              {lessonInfo.lesson_content}
            </Typography.Paragraph>
            <Flex justify="flex-end" gap={10}>
              <Button
                icon={<DollarOutlined />}
                style={{
                  cursor: 'default'
                }}
              >
                {"" + lessonInfo.lesson_score}
              </Button>
              <Button type="primary" onClick={showPromiseConfirm}>
                Mua
              </Button>
            </Flex>
          </Col>
        </Row>
      }
    </section>
  )
}

export default BuyLesson