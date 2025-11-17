// 获取最近几天的订单
//  1）获取url中的天数
//  2）请求返回最近几天的订单

import { useQuery } from "@tanstack/react-query";
import { subDays } from "date-fns";
import { useSearchParams } from "react-router-dom";
import { getBookingsAfterDate } from "../../services/apiBookings";
import toast from "react-hot-toast";

export function useRecentBookings() {
  const [searchParams] = useSearchParams();
  const numDays = searchParams.get("last")
    ? Number(searchParams.get("last"))
    : 7;
  const queryDay = subDays(new Date(), numDays).toISOString();
  console.log(queryDay);
  const { isLoading, data: bookings } = useQuery({
    queryKey: ["bookings", `last-${numDays}`],
    queryFn: () => getBookingsAfterDate(queryDay),
    onError: (err) => toast.error(err.message),
  });
  return { isLoading, bookings };
}
