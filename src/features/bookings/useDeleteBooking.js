import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteBookingById } from "../../services/apiBookings";

export function useDeleteBooking() {
  const queryClient = useQueryClient();
  const { isPending: isDeletingBooking, mutate: deleteBooking } = useMutation({
    mutationFn: (bookingId) => deleteBookingById(bookingId),
    //代码期望返回包含被删除数据的信息data，但是实际上删除函数没有返回任何信息，以为删除失败了
    onSuccess: (bookingId) => {
      toast.success(`🎉Booking #${bookingId} sucessfully deleted`);
      // 所有包含booking的查询都失效了，包括：["bookings",null,{"direction":"desc","sortField":"startDate"},4]
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["booking", bookingId] });
    },
    onError: () => toast.error(" there was an error while deleting"),
  });

  return { isDeletingBooking, deleteBooking };
}
