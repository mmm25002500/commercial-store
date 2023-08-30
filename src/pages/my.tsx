import { auth } from "@/config/firebase";
import { Unsubscribe, User, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

const MyPage = () => {
  const [user, setUser] = useState<User | undefined>();

  const checkAuth = (): Unsubscribe => onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('User is logged in');
      setUser(user);
    } else {
      console.log('User is not logged in');
    }
  });

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