import styled from "styled-components"

const Wrapper = styled.div`
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: rgba(25, 42, 86, 0.8);
    top: 0;
    left: 0;
    z-index: 9999999;
    display: flex;
    align-items: center;
    justify-content: center;
`

const Icon = styled.span`
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: inline-block;
    border-top: 4px solid #fff;
    border-right: 4px solid transparent;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;

    &::after {
        content: '';  
        box-sizing: border-box;
        position: absolute;
        left: 0;
        top: 0;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        border-left: 4px solid #1677ff;
        border-bottom: 4px solid transparent;
        animation: rotation 0.5s linear infinite reverse;
    }

    @keyframes rotation {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    } 
`

const Loading = () => {
    return (
        <Wrapper>
            <Icon />
        </Wrapper>
    )
}

export default Loading