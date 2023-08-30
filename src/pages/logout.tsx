import { auth } from "@/config/firebase";
import { Unsubscribe, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { useEffect } from "react";
import toast from "react-hot-toast";

const LogoutPage = () => { 
  const router = useRouter();

  // 驗證是否登入
  const checkAuth = (): Unsubscribe => onAuthStateChanged(auth, (user) => {
    if (user) {
      // console.log('User is logged in');

      const handleLogout = async () => {
        try {
          await signOut(auth);
          toast.success("登出成功！", {
            position: "top-right"
          });
          router.push('/');
        } catch (error) {
          toast.error(`登出失敗！\n錯誤訊息：\n${error}`, {
            position: "top-right"
          });
        }
      };

      handleLogout();
    } else {
      toast.error("登出失敗！您未登入，請先登入！", {
        position: "top-right"
      });
      router.push('/');
    }
  });
  

  // 一進頁面就驗證，如果沒登入就導回首頁
  useEffect(() => {
    checkAuth();
  }, []);

}

export default LogoutPage;