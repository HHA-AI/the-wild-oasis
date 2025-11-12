import { useMutation } from "@tanstack/react-query";
import { signup as SignupApi } from "../../services/apiAuth";
import toast from "react-hot-toast";

export function useSignup() {
  const { mutate: signup, isLoading } = useMutation({
    mutationFn: SignupApi,
    onSuccess: (user) => {
      toast.success(
        " account successful created please verified new account from the users email address"
      );
    },
    onError: (err) => toast.error(err.message),
  });
  return { isLoading, signup };
}
