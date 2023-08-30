import { auth } from "@/config/firebase";
import { Unsubscribe, User, deleteUser, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { deleteCart } from "./cart";

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

  // 刪除帳戶
  const deleteAccount = () => { 
    // 刪除購物車
    if (user) {
      deleteCart(user.uid);
    }
      
    // 刪除帳戶
    auth.currentUser?.delete().then(() => {
      toast.success("刪除成功！", {
        position: "top-right" 
      });
    }).catch((error) => {
      toast.error(`刪除失敗！\n錯誤訊息：\n${error}`, {
        position: "top-right"
      });
    });
  }

  // 一進頁面就驗證，如果沒登入就導回首頁
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div className="container mx-auto pt-8 pl-5 pr-5">
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
        <button type="button" onClick={deleteAccount} className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
          刪除帳戶
        </button>
      </div>
    </div>
  )
}

export default MyPage;