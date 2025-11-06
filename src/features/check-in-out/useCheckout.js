import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";

export function useCheckout() {
  const queryClient = useQueryClient();

  const { isPending: isCheckingout, mutate: checkout } = useMutation({
    mutationFn: (bookingId) =>
      updateBooking(bookingId, {
        status: "checked-out",
      }),
    onSuccess: (data) => {
      toast.success(`🎉Booking #${data.id} sucessfully checked out`);
      queryClient.invalidateQueries({ active: true });

      // 当前页面活跃的查询失效
    },
    onError: () => toast.error(" there was an error while checking out"),
  });
  return { isCheckingout, checkout };
}
