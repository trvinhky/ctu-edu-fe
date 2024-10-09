import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const ViewPDF = ({ pdfUrl, height = '50vh' }: { pdfUrl: string, height?: string | number }) => {

    return (
        <Worker
            workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
        >
            <div style={{ height }}>
                <Viewer fileUrl={pdfUrl} />
            </div>
        </Worker>
    )
}

export default ViewPDF