import { FileExcelOutlined, FileExclamationOutlined, FileImageOutlined, FileOutlined, FilePdfOutlined, FilePptOutlined, FileTextOutlined, FileWordOutlined } from "@ant-design/icons"
import { Image } from "antd"

const ViewIcon = ({ category, url, isShowImg }: { category: string, url: string, isShowImg?: boolean }) => {
    switch (category) {
        case 'image':
            return !isShowImg ? <FileImageOutlined /> : <Image
                width="100%"
                src={url}
            />
        case 'document':
            if (url.includes('pdf')) {
                return <FilePdfOutlined />
            }
            if (url.includes('doc')) {
                return <FileWordOutlined />
            }
            return <FileTextOutlined />
        case 'Presentations and spreadsheets':
            if (url.includes('pptx')) {
                return <FilePptOutlined />
            }
            if (url.includes('xlsx')) {
                return <FileExcelOutlined />
            }
            return <FileExclamationOutlined />
        default:
            return <FileOutlined />
    }
}

export default ViewIcon