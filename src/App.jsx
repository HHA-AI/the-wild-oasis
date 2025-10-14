import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GlobalStyle from "./styles/GlobalStyle";
import Dashboard from "./pages/Dashboard";
import Account from "./pages/Account";
import Bookings from "./pages/Bookings";
import Cabins from "./pages/Cabins";
import Login from "./pages/Dashboard";
import PageNotFound from "./pages/PageNotFound";
import Settings from "./pages/Settings";
import Users from "./pages/Users";
import AppLayout from "./ui/AppLayout";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";

// react-query使用：
// 1. 创建一个查询和缓存的客户端new QueryClient
//    1.1 传入参数中可以设置默认选项--query查询--staleTime数据保鲜时间
const queryClient = new QueryClient({
  defaultOptions: {
    query: {
      staleTime: 60 * 1000,
    },
  },
});

// This code is for all users
window.__TANSTACK_QUERY_CLIENT__ = queryClient;

function App() {
  return (
    // react-query使用： 2 将数据提供给app
    <QueryClientProvider client={queryClient}>
      {/* react-query使用： 3 reactquery开发工具 */}
      <ReactQueryDevtools initialIsOpen={false} />
      {/* 3. 全局样式 */}
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          {/* 4.设置页面布局AppLayout */}
          <Route element={<AppLayout />}>
            {/* 2. 配置index页面路由 */}
            {/* <Route index repalce redirect={"/dashboard"} />   错误代码：redirect只能在action中用*/}
            <Route index element={<Navigate replace to="dashboard" />} />
            {/* 1. 配置每个页面和对应路由 */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/cabins" element={<Cabins />} />
            <Route path="/users" element={<Users />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/account" element={<Account />} />
          </Route>
          <Route path="/Login" element={<Login />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: { duration: 3000 },
          error: { duration: 5000 },
          style: {
            fontSize: "16px",
            maxWidth: "500px",
            padding: "16px 24px",
            backgroundColor: "var(--color-grey-0)",
            color: "var(--color-grey-700)",
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
