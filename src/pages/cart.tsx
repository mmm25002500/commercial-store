import React, { useEffect, useState } from 'react';
import { getDocs, collection, doc, getDoc, query, where, updateDoc } from 'firebase/firestore';
import { User, Unsubscribe, onAuthStateChanged } from 'firebase/auth';
import toast from 'react-hot-toast';
import { auth, db } from '@/config/firebase';
import CartCard from '@/components/CartCard';
import { useRouter } from 'next/router';
import { ProductData } from './addItem';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

interface CartItem extends ProductData{
  id: string;
}

export interface CartData {
  uid: string;
  items: CartItem[];
}

const Cart = () => {
  const [cartProducts, setCartProducts] = useState<CartItem[]>([]);
  const [cart, setCart] = useState<CartData | undefined>();
  const [user, setUser] = useState<User | undefined>();
  const router = useRouter();

  // 驗證是否登入
  const checkAuth = (): Unsubscribe =>
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        loadCartItems(user.uid);
      } else {
        setUser(undefined);
        router.push('/');
        toast.error('請先登入！', {
          position: 'top-right',
        });
      }
    });

    const loadCartItems = async (uid: string) => {
      try {
        const cartRef = collection(db, "cart");

        const q = query(cartRef, where("uid", "==", uid));
        
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data());
          setCart(doc.data() as CartData);
        });
    
      } catch (error) {
        console.error('Error loading cart items:', error);
      }
    };
  
    // 使用 id 取得資訊
    const getProduct = async (id: string) => {
      try {
        const productRef = doc(db, 'products', id);
        const productSnap = await getDoc(productRef);
        if (productSnap.exists()) {
          // console.log('Document data:', productSnap.data());
          return productSnap.data() as ProductData;
        } else {
          // doc.data() will be undefined in this case
          console.log('No such document!');
          return undefined;
        }
      } catch (error) {
        console.error('Error getting document:', error);
        return undefined;
      }
    };
  
    // 刪除購物車商品
    const deleteProduct = async (productId: string) => {
      try {
        const uid = user?.uid;
        if (!uid) return;
    
        const cartRef = collection(db, 'cart');
        const q = query(cartRef, where('uid', '==', uid));
        const querySnapshot = await getDocs(q);
    
        if (!querySnapshot.empty) {
          const cartDoc = querySnapshot.docs[0];
          const cartId = cartDoc.id;
          const cartData = cartDoc.data() as CartData;
    
          const updatedItems = cartData.items.filter((item) => item.id !== productId);
    
          await updateDoc(doc(db, 'cart', cartId), {
            items: updatedItems
          });
    
          loadCartItems(uid);
    
          toast.success('刪除成功！', {
            position: 'top-right',
          });
        }
      } catch (error) {
        console.error('Error removing item from cart:', error);
        toast.error(`刪除失敗！\n錯誤訊息:\n${error}`, {
          position: 'top-right',
        });
      }
    
    };
  
    // 清空垃圾桶
    const clearCart = async () => {
      try {
        if (user) {
          const uid = user.uid;
          const cartRef = collection(db, 'cart');
          const q = query(cartRef, where('uid', '==', uid));
          const querySnapshot = await getDocs(q);
    
          if (!querySnapshot.empty) {
            const cartDoc = querySnapshot.docs[0];
            const cartId = cartDoc.id;
    
            await updateDoc(doc(db, 'cart', cartId), {
              items: []
            });
    
            loadCartItems(uid);
    
            toast.success('已成功清空購物車！', {
              position: 'top-right'
            });
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
        toast.error(`清空購物車失敗！\n錯誤訊息：\n${error}`, {
          position: 'top-right'
        });
      }
    };
    
   // 加載購物車商品資訊
    useEffect(() => {
      if (cart?.items) {
        const fetchCartProducts = async () => {
          const fetchedProducts: CartItem[] = [];
          for (const item of cart.items) {
            const product = await getProduct(item.id);
            if (product) {
              fetchedProducts.push({
                ...product,
                id: item.id,
              });
            }
          }
          setCartProducts(fetchedProducts);
        };
    
        fetchCartProducts();
        console.log(cartProducts);
      }

    }, [cart]);
    
    useEffect(() => {
      checkAuth();
    }, []);
  
  return (
    <div className="container mx-auto pt-8 pl-5 pr-5">
      {
        cartProducts.length === 0 ? (
          <div className="flex items-center p-4 mb-4 text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800 text-lg" role="alert">
            <FontAwesomeIcon icon={faTriangleExclamation} className="inline w-4 h-4 mr-3" />
            <span className="sr-only">Info</span>
            <div>
              <span className="font-bold">喔不!</span> 購物車是空的！！！
              <button className="underline underline-offset-4 text-cyan-300" onClick={() => router.push('/store')}>點我立刻去消費？</button>
            </div>
          </div>
        ) : (
            <button onClick={clearCart} className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                點我清空所有垃圾桶
            </span>
          </button>
        )
      }
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {
          cartProducts.map((product) => (
            <div key={product.id}>
              <CartCard
                title={product.title!}
                description={product.description}
                link="/"
                img={product.img_addr}
                price={product.price}
                id={product.id}
                deleteProduct={deleteProduct}
              />
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default Cart;
