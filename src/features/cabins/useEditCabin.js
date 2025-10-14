import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditCabin } from "../../services/apiCabins";

export function useEditCabin() {
  const queryClient = useQueryClient();

  // B)更新cabin  mutationFn只能接收一个参数，需要处理
  const { mutate: editMutate, isPending: isEditing } = useMutation({
    mutationFn: ({ newCabin, id }) => createEditCabin(newCabin, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cabins"] });
      // 使用服务器返回的数据更新表单 reset()是重置为初始数据，可以传入更新后的数据
    },
  });
  return { editMutate, isEditing };
}
