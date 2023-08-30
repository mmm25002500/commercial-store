import { auth, db } from "@/config/firebase";
import { CartData } from "@/pages/cart";
import { Unsubscribe, User, onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface Props {
  img: string;
  title: string;
  description: string;
  price: number;
  link: string;
  id: string;
  deleteProduct: (id: string) => void;
}

const Card = (props: Props) => {
  const [user, setUser] = useState<User | undefined>();

  const checkAuth = (): Unsubscribe => onAuthStateChanged(auth, (user) => {
    if (user) {
      // console.log('User is logged in');
      setUser(user);
    } else {
      setUser(undefined);
    }
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const addToCart = async (productId: string) => {
    try {
      if (user) {
        const uid = user.uid;
        const cartRef = collection(db, 'cart');
        const q = query(cartRef, where('uid', '==', uid));
        const querySnapshot = await getDocs(q);
  
        if (!querySnapshot.empty) {
          const cartDoc = querySnapshot.docs[0];
          const cartId = cartDoc.id;
          const cartData = cartDoc.data() as CartData;
  
          if (!cartData.items.some((item) => item.id === productId)) {
            const updatedItems = [...cartData.items, { id: productId }];
  
            await updateDoc(doc(db, 'cart', cartId), {
              items: updatedItems
            });
  
            toast.success('成功加入到購物車！', {
              position: 'top-right'
            });
          } else {
            toast.error('已經在購物車了！', {
              position: 'top-right'
            });
          }
        } else {
          toast.error('找不到購物車！', {
            position: 'top-right'
          });
        }
      } else {
        toast.error('請先登入！', {
          position: 'top-right'
        });
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast.error(`加入到購物車失敗！\n錯誤訊息：\n${error}`, {
        position: 'top-right'
      });
    }
  };
  

  return (
    <div className="sm:w-auto bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <a href="#">
        <img className="rounded-t-lg" src={ props.img } alt="" />
      </a>
      <div className="p-5">
        <a href="#">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{props.title}</h5>
        </a>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{ props.description }</p>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">NT$ { props.price } 元</p>
        <button type="button" onClick={() => addToCart(props.id)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">增加到購物車</button>

        <button type="button" onClick={() => props.deleteProduct(props.id)} className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">刪除</button>

      </div>
    </div>
  )
}

export default Card;