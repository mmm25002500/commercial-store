import { auth } from "@/config/firebase";
import { GoogleAuthProvider, Unsubscribe, User, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { toast } from 'react-hot-toast';

// 登入，會跳出 Google 登入視窗
export const handleGoogleLogin = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    // 登入成功的處理

    toast.success('登入成功！', {
      position: "top-right"
    });

    return result.user as User;
  } catch (error) {
    // 登入失敗的處理
    console.error('Google 登入錯誤:', error);

    toast.error(`登入失敗！\n失敗原因:\n${error}`, {
      position: "top-right"
    });

    return error;
  }
};

// 檢查登入
export const checkAuth = (): Unsubscribe => onAuthStateChanged(auth, (user) => {
  if (user) {
    // if user logged in, set loading to false and navigate to home page
    console.log('User is logged in');
  } else {
    // if user not logged in, set loading to false and navigate to login page
    console.log('User is not logged in');
  }
});

// 登出
export const logout = () => signOut(auth).then(() => {
  // Sign-out successful.
}).catch((error) => {
  // An error happened.
});