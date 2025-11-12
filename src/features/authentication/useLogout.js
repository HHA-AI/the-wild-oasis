import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout as logoutAPi } from "../../services/apiAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isPending: isLoading, mutate: logout } = useMutation({
    mutationFn: logoutAPi,
    onSuccess: () => {
      // 从本地存储和服务器上移除存储
      toast.success("log out successful");
      queryClient.removeQueries();
      navigate("/login", { replace: true });
    },
    onError: (err) => toast.error(err),
  });
  return { logout, isLoading };
}
