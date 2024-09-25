import DOMPurify from "dompurify"

const HtmlContent = ({ htmlContent }: { htmlContent: string }) => {
    return (
        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlContent) }} />
    )
}

export default HtmlContent