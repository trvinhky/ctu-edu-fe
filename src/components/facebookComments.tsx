import { FacebookProvider, Comments } from 'react-facebook';

const FacebookComments = ({ path }: { path: string }) => {
    const url = import.meta.env.VITE_BASE_URL; // URL của bài viết

    return (
        <FacebookProvider
            appId="401855226328533"
        >
            <Comments
                href={`${url}/${path}`}
                width="100%"
            />
        </FacebookProvider>
    );
};

export default FacebookComments;
