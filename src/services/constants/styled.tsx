import styled from "styled-components";

const Title = styled.h1`
    font-weight: 600;
    font-size: 24px;
    padding-bottom: 15px;
`

const FormTitle = styled.h1`
    font-size: 30px;
    text-align: center;
    font-weight: 600;
    text-transform: uppercase;
    padding-bottom: 30px;
`

const FormLink = styled.span`
    text-align: right;
    display: block;
`

const BoxTitle = styled.h3`
    font-weight: 600;
    text-align: center;
    font-size: 25px;
    text-transform: capitalize;
    padding-bottom: 15px;
`

const ImgCaptCha = styled.img`
    height: 100%;
    max-height: 40px;
    object-fit: cover;
`

export {
    Title,
    FormTitle,
    FormLink,
    BoxTitle,
    ImgCaptCha
}