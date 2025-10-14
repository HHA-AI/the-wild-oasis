import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSetting as updateSettingApi } from "../../services/apiSettings";

export function useUpdateSetting() {
  const queryClient = useQueryClient();
  //A)创建cabin
  const { mutate: updateSetting, isPending: isUpdatingSetting } = useMutation({
    mutationFn: updateSettingApi, //指明传递的参数
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
  return { updateSetting, isUpdatingSetting };
}
