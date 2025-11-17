import styled, { css } from "styled-components";

// 创建高度可复用的样式化组件
const Row = styled.div`
  display: flex;
  ${(props) =>
    props.type === "horizontal" &&
    css`
      justify-content: space-between;
      align-items: center;
    `}
  ${(props) =>
    props.type === "vertical" &&
    css`
      flex-direction: column;
      gap: 1.6rem;
    `}
`;

// styled components提供的设置默认属性方式
Row.defaultProps = {
  type: "vertical",
};
export default Row;
