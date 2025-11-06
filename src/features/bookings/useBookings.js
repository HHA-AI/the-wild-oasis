// 不获取数据后在客户端过滤和排序，而是直接在服务器过滤和排序后传递数据

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getBookings } from "../../services/apiBookings";
import { PAGE_SIZE } from "../../utils/constants";

function useBookings() {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  // 过滤条件
  const filterValue = searchParams.get("status");
  const filter =
    !filterValue || filterValue === "all"
      ? null
      : { filterField: "status", filterValue: filterValue }; //过滤字段不存在或者‘all'时
  //排序
  const sortByParams = searchParams.get("sortBy") || "startDate-desc";
  const [sortField, direction] = sortByParams.split("-");
  const sortBy = { sortField, direction };

  // 分页查询
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));
  const {
    isPending: isLoading,
    data: { data: bookings, count } = {},
    error,
  } = useQuery({
    queryKey: ["bookings", filter, sortBy, page],
    queryFn: () => getBookings({ filter, sortBy, page }),
  });

  // 预获取：前一页+ 后一页
  const pageCount = Math.ceil(count / PAGE_SIZE);
  if (page < pageCount)
    queryClient.prefetchQuery({
      queryKey: ["bookings", filter, sortBy, page + 1],
      queryFn: () => getBookings({ filter, sortBy, page: page + 1 }),
    });
  if (page > 1)
    queryClient.prefetchQuery({
      queryKey: ["bookings", filter, sortBy, page - 1],
      queryFn: () => getBookings({ filter, sortBy, page: page - 1 }),
    });

  return { isLoading, bookings, error, count };
}

export default useBookings;
