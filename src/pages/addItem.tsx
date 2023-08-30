import { auth, db } from "@/config/firebase";
import { Unsubscribe, User, onAuthStateChanged } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export interface ProductData {
  title: string;
  description: string;
  price: number;
  img_addr: string;
}

const AddItem = () => {
  const [product, setProduct] = useState<ProductData>({ title: '', description: '', price: 0, img_addr: '' });
  const [user, setUser] = useState<User>();
  const router = useRouter();

  // 驗證是否登入
  const checkAuth = (): Unsubscribe => onAuthStateChanged(auth, (user) => {
    if (user) {
      // console.log('User is logged in');
      setUser(user);
    } else {
      setUser(undefined);
      toast.error("請先登入！", {
        position: "top-right"
      });
      router.push('/');
    }
  });

  // 一進頁面就驗證，如果沒登入就導回首頁
  useEffect(() => {
    checkAuth();
  }, []);

  // 新增商品
  const addProduct = async () => {
    checkAuth();
    if (user) {
      try {
        const docRef = await addDoc(collection(db, 'products'), product);
        toast.success('商品新增成功!', {
          position: "top-right"
        });
        console.log('Product added with ID: ', docRef.id);
      } catch (error) {
        toast.error(`商品新增失敗!\n錯誤訊息：\n${error}`, {
          position: "top-right"
        });
        console.error('Error adding product: ', error);
      }
    } else { 
      toast.error(`商品新增失敗！請先登入！`, {
        position: "top-right"
      });
    }
  };

  return (
    <div className="container mx-auto pt-8 pl-5 pr-5">
      <form onSubmit={e => e.preventDefault()}>
        <div className="relative z-0 w-full mb-6 group">
            <input type="text" onChange={e => setProduct({...product, title : e.target.value})} name="title" id="title" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
            <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">商品名稱</label>
        </div>
        <div className="relative z-0 w-full mb-6 group">
            <input type="text" onChange={e => setProduct({...product, description : e.target.value})} name="description" id="description" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
            <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">商品描述</label>
        </div>
        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="relative z-0 w-full mb-6 group">
              <input type="number" onChange={e => setProduct({...product, price : parseInt(e.target.value)})} name="price" id="price" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
              <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">商品價格</label>
          </div>
          <div className="relative z-0 w-full mb-6 group">
              <input type="text" onChange={e => setProduct({...product, img_addr : e.target.value})} name="img_addr" id="img_addr" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
              <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">商品圖片網址</label>
          </div>
        </div>
        <button onClick={addProduct} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">新增商品</button>
      </form>
    </div>
  )
}

export default AddItem;