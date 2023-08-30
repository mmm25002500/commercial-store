import { auth } from "@/config/firebase";
import { Unsubscribe, User, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Cart = () => {
  const [user, setUser] = useState<User>();
  const router = useRouter();

  // 驗證是否登入
  const checkAuth = (): Unsubscribe => onAuthStateChanged(auth, (user) => {
    if (user) {
      // console.log('User is logged in');
      setUser(user);
    } else {
      setUser(undefined);
    }
  });

  // 一進頁面就驗證，如果沒登入就導回首頁
  useEffect(() => {
    checkAuth();
    if (!user) {
      router.push('/');
      toast.error("驗證失敗！請先登入！", {
        position: "top-right"
      });
    }
  }, []);
  
  return (
    <>
      <h2 className="text-3xl text-center text-black dark:text-white">cart</h2>
    </>
  )
}

export default Cart;