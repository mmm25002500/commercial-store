import { auth, db } from "@/config/firebase";
import { GoogleAuthProvider, Unsubscribe, User, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { addDoc, collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { toast } from 'react-hot-toast';

// 查看是否有 cart 文檔，沒有的話就建立一個
const handleUserCart = async (user: User) => {
  const uid = user.uid;

  // 查詢 cart 文檔，以 uid 為條件
  const cartQuery = query(collection(db, 'cart'), where('uid', '==', uid));
  const cartQuerySnapshot = await getDocs(cartQuery);

  if (cartQuerySnapshot.empty) {
    // 如果沒有 cart 文檔，就建立一個
    const newCartData = {
      uid: uid,
      items: []
    };
    
    try {
      const cartRef = collection(db, 'cart');
      await addDoc(cartRef, newCartData);
      toast.success('建立購物車成功！', {
        position: "top-right"
      });
    } catch (error) {
      console.error('Error creating cart document:', error);
      toast.success(`建立購物車失敗！\n錯誤訊息：\n${error}`, {
        position: "top-right"
      });
    }
  } else {
    toast.success('購物車載入成功！', {
      position: "top-right"
    });
  }
};

// 登入，會跳出 Google 登入視窗
export const handleGoogleLogin = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    // 登入成功的處理

    toast.success('登入成功！', {
      position: "top-right"
    });

    handleUserCart(result.user as User);

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
