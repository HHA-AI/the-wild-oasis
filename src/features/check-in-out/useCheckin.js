import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export function useCheckin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { isPending: isCheckingin, mutate: checkin } = useMutation({
    mutationFn: ({ bookingId, breakfast }) =>
      updateBooking(bookingId, {
        status: "check-in",
        isPaid: true,
        ...breakfast,
      }),
    onSuccess: (data) => {
      toast.success(`🎉Booking #${data.id} sucessfully checked in`);
      queryClient.invalidateQueries({ active: true });
      navigate(`/dashboard`);
      // 当前页面活跃的查询失效
    },
    onError: () => toast.error(" there was an error while checking in"),
  });
  return { isCheckingin, checkin };
}
