import { auth, db } from "@/config/firebase";
import { Unsubscribe, User, onAuthStateChanged } from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface Props {
  img: string;
  title: string;
  description: string;
  link: string;
  id: string;
  deleteProduct: (id: string) => void;
}

const Card = (props: Props) => {
  const [user, setUser] = useState<User | undefined>();
  const router = useRouter();

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

  const addToCart = () => {
    if (user) {
      console.log('add to cart');
    } else {
      toast.error("請先登入！才可以增加到購物車！", {
        position: "top-right"
      })
    }
  }

  return (
    <div className="w-1/2 sm:w-auto bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <a href="#">
        <img className="rounded-t-lg" src={ props.img } alt="" />
      </a>
      <div className="p-5">
        <a href="#">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{ props.title }</h5>
        </a>

        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{ props.description }</p>
        <button type="button" onClick={addToCart} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">增加到購物車</button>

        <button type="button" onClick={() => props.deleteProduct(props.id)} className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">刪除</button>

      </div>
    </div>
  )
}

export default Card;