import { Flex } from "antd"
import { Outlet } from "react-router-dom"
import HeaderShort from "~/layouts/HeaderShort"

const FormTemplate = () => {
    return (
        <>
            <HeaderShort />
            <Flex
                align="center"
                justify="center"
            >
                <main className="content-form">
                    <Outlet />
                </main>
            </Flex>
        </>
    )
}

export default FormTemplate