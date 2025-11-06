import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useDeleteBooking() {
  const queryClient = useQueryClient();
  const { isPending: isDeleting, mutate: deleteBooking } = useMutation({
    mutationFn: (bookingId) => deleteBooking(bookingId),
    onSuccess: (data) => {
      toast.success(`🎉Booking #${data.id} sucessfully deleted`);
      queryClient.invalidateQueries({ active: true });
    },
    onError: () => toast.error(" there was an error while deleting"),
  });
  return { isDeleting, deleteBooking };
}

export default useDeleteBooking;
