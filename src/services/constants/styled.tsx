import { Link } from "react-router-dom";
import styled from "styled-components";

const Title = styled.h1`
    font-weight: 600;
    font-size: 24px;
    padding-bottom: 15px;
    text-transform: capitalize;
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

const TitleLink = styled(Link)`
    font-weight: 600;
    border-left: 2px solid #f1c40f;
    padding-left: 10px;
    font-size: 20px;
    color: #000;
    display: inline-block;
    margin: 30px 0 20px;
`

export {
    Title,
    FormTitle,
    FormLink,
    BoxTitle,
    ImgCaptCha,
    TitleLink
}