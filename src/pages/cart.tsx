import React, { useEffect, useState } from 'react';
import { DocumentData, getDocs, collection, doc, deleteDoc, getDoc, query, where, updateDoc } from 'firebase/firestore';
import { User, Unsubscribe, onAuthStateChanged } from 'firebase/auth';
import toast from 'react-hot-toast';
import { auth, db } from '@/config/firebase';
import CartCard from '@/components/CartCard';
import { useRouter } from 'next/router';
import { ProductData } from './addItem';

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
        toast.error('請先登入！', {
          position: 'top-right',
        });
        router.push('/');
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cartProducts.map((product) => (
          <div key={product.id}>
            <CartCard
              title={product.title!}
              description={product.description}
              link="/"
              img={product.img_addr}
              id={product.id}
              deleteProduct={deleteProduct}
            />
        </div>
        ))}
      </div>
    </div>
  );
};

export default Cart;
