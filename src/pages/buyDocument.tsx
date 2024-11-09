import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGlobalDataContext } from "~/hooks/globalData";
import { DocumentInfo } from "~/services/types/document";
import { Title } from '~/services/constants/styled';
import { Button, Col, Flex, Modal, Row, Typography } from "antd";
import ButtonBack from "~/services/utils/buttonBack";
import styled from "styled-components";
import ViewIcon from "~/components/viewIcon";
import { DollarOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { accountInfoSelector } from "~/services/reducers/selectors";
import BuyAPI from "~/services/actions/buy";
import DocumentAPI from "~/services/actions/document";

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
  const [documentInfo, setDocumentInfo] = useState<DocumentInfo>()
  const account = useSelector(accountInfoSelector)
  const [accountId, setAccountId] = useState<string>()

  useEffect(() => {
    document.title = "Thanh toán"
    if (id) {
      if (account) {
        setAccountId(account.account_Id)
      } else navigate(-1)
      getOneDocument(id)
    } else navigate(-1)
  }, [id, account, setAccountId])

  const getOneDocument = async (id: string) => {
    setIsLoading(true)
    try {
      const { status, message, data } = await DocumentAPI.getOne(id)
      if (status === 201 && !Array.isArray(data)) {
        setDocumentInfo(data)
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

  const payDocument = async (account_Id: string, document_Id: string) => {
    setIsLoading(true)
    try {
      const { status, message } = await BuyAPI.create({
        document_Id,
        account_Id
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
      title: 'Bạn có chắc muốn mua tài liệu này?',
      icon: <ExclamationCircleFilled />,
      cancelText: 'Hủy',
      async onOk() {
        if (id && accountId) {
          await payDocument(accountId, id)
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
        documentInfo &&
        <Row gutter={[16, 16]}>
          <Col span={10}>
            <WrapperIcon>
              <ViewIcon
                url={documentInfo.document_url}
                format={documentInfo.format.format_name}
              />
            </WrapperIcon>
            <SubTitle>{documentInfo.document_title}</SubTitle>
          </Col>
          <Col span={14}>
            <Typography.Paragraph
              ellipsis={{ rows: 4, expandable: false }}
              style={{
                textAlign: 'left'
              }}
            >
              {documentInfo.document_content}
            </Typography.Paragraph>
            <Flex justify="flex-end" gap={10}>
              <Button
                icon={<DollarOutlined />}
                style={{
                  cursor: 'default'
                }}
              >
                {"" + documentInfo.document_score}
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