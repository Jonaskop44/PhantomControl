import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export const useHandleLogout = () => {
  const router = useRouter();

  const handleLogout = async () => {
    const accessToken = Cookies.get("accessToken");
    const refreshToken = Cookies.get("refreshToken");

    if (accessToken) Cookies.remove("accessToken");
    if (refreshToken) Cookies.remove("refreshToken");

    if (typeof window !== "undefined") {
      window.location.href = "/";
    } else {
      router.push("/");
    }
  };

  return handleLogout;
};
