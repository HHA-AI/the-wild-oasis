import { useNavigate } from "react-router-dom";
import { useUser } from "../features/authentication/useUser";
import Spinner from "./Spinner";
import styled from "styled-components";
import { useEffect } from "react";

const FullPage = styled.div`
  height: 100vh;
  background-color: var(--color-grey-50);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  // 1. 获取user信息
  const { isAuthenticated, isLoading } = useUser();

  // 3. 如果没有认证，转到登录界面(不仅初始加载时认证，变化时也要重新获取)

  // 缺点：在渲染阶段就导航，混乱，每次渲染组件都要比较，useEffect只有在依赖项变化时执行
  // if (!isAuthenticated) return <Navigate to="/login" replace />;
  // 在Effect条件判断中没有isLoading时导致在 useEffect 执行前就返回了加载状态，可能导致导航逻辑混乱。
  useEffect(() => {
    if (!isAuthenticated && !isLoading) navigate("/login", { replace: true });
  }, [isAuthenticated, navigate, isLoading]);
  // // 2. 加载显示
  if (isLoading) {
    return (
      <FullPage>
        <Spinner />
      </FullPage>
    );
  }
  // // 4认证成功，进入主假面
  if (isAuthenticated && !isLoading) {
    return children;
  }
}
