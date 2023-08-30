import { auth } from "@/config/firebase";
import { Unsubscribe, User, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const MyPage = () => {
  const [user, setUser] = useState<User>();
  const router = useRouter();

  // 驗證是否登入
  const checkAuth = (): Unsubscribe => onAuthStateChanged(auth, (user) => {
    if (user) {
      // console.log('User is logged in');
      setUser(user);

    } else {
      setUser(undefined);
      router.push('/');
      toast.error("驗證失敗！請先登入！", {
        position: "top-right"
      });
    }
  });
  

  // 一進頁面就驗證，如果沒登入就導回首頁
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div className="text-left text-gray-500 dark:text-gray-400 text-2xl">
      <p>
        個人頁面
      </p>
      <p>
        你的名字：{user?.displayName} <br />
        你的信箱：{user?.email} <br />
        你的手機：{user?.phoneNumber} <br />
        {
          user?.photoURL ? (
            <>
              你的照片：<img src={user?.photoURL} alt="user photo" className="inline" /> <br />
            </>
          )
           : <></>
        }
        你的uid：{user?.uid} <br />
      </p>
    </div>
  )
}

export default MyPage;