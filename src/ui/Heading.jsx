import styled, { css } from "styled-components";

// 1. 在style引入外部CSS变量
const text = css`
  text-align: center;
`;
const Heading = styled.h1`
  font-size: 20px;
  font-weight: 600, ${text};
  /* 2.加入条件表达式*/
  /* background-color: ${text ? "yellow" : "red"}; */
  /* 3. 接收props参数:可以是自定义属性参数；也可以是style components提供的as属性  */
  ${(props) =>
    props.as === "h1" &&
    css`
      font-size: 3rem;
      font-weight: 600;
    `}
  ${(props) =>
    props.as === "h2" &&
    css`
      font-size: 2rem;
      font-weight: 600;
    `}
${(props) =>
    props.as === "h3" &&
    css`
      font-size: 2rem;
      font-weight: 500;
    `}
    ${(props) =>
    props.as === "h4" &&
    css`
      font-size: 3rem;
      font-weight: 600;
      text-align: center;
    `}
`;
export default Heading;

// 对比常规设置组件默认属性的方式
// function Row({ type = "vertical" }) {
//...
// }
