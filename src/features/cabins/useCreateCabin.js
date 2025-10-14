import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditCabin } from "../../services/apiCabins";

export function useCreateCabin() {
  const queryClient = useQueryClient();
  //A)创建cabin
  const { mutate: createMutate, isPending: isCreating } = useMutation({
    mutationFn: (newCabin) => createEditCabin(newCabin), //指明传递的参数
    onSuccess: () => {
      console.log();
      queryClient.invalidateQueries({ queryKey: ["cabins"] });
    },
  });
  return { createMutate, isCreating };
}
