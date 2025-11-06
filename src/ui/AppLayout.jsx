import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import styled from "styled-components";

const StyledAppLayout = styled.div`
  display: grid;
  grid-template-columns: 26rem 1fr;
  grid-template-rows: auto 1fr;
  height: 100vh;
  /* 修复滚动时整个页面一起滚动的问题，修改后：只有main模块滚动，其他模块保持不变 */
  /* overflow: scroll; */
`;
const Main = styled.main`
  background-color: var(--color-grey-50);
  padding: 4rem 4.8rem 6.4rem;
  overflow-y: auto;
  max-height: calc(100vh - var(--header-height, 6rem)); /*根据Header高度调整 */
`;

const Container = styled.div`
  max-width: 120rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
`;

function AppLayout() {
  return (
    <StyledAppLayout>
      <Sidebar />
      <div>
        <Header />
        <Main>
          <Container>
            {/* 子路由中返回<></>Fragment ,而不是div，因为div在main下可能会影响期望设置样式 */}
            <Outlet />
          </Container>
        </Main>
      </div>
    </StyledAppLayout>
  );
}

export default AppLayout;
