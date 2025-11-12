import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../services/apiAuth";

export function useUser() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    retry: false, // 避免重复尝试
  });

  const isAuthenticated = user?.role === "authenticated";

  return { user, isAuthenticated, isLoading };
}
