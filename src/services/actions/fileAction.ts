import EduAPI from "~/services/actions";
import { APIType } from "~/services/types/dataType";

const url = (path: string = '') => `/file/${path}`

class FileActionService extends EduAPI {
    public async readFileLess(fileName: string): Promise<APIType<{ images: string[] }>> {
        return await this.postAPI(url('read-pdf'), { fileName })
    }
}

const FileActionAPI = new FileActionService()

export default FileActionAPI