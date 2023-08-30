/* eslint-disable @next/next/no-img-element */
import { auth } from "@/config/firebase";
import { signOut } from "firebase/auth";
import {useRouter} from "next/router";
import toast from "react-hot-toast";

interface Props {
  name: string;
  email: string;
  phone: string;
  image: string;
  uid: string;
  deleteAccount: () => void;
}

const PersonalCard = (props: Props) => {
  const router = useRouter();

  const logout_btn = () => {
    signOut(auth).then(() => {
      toast.success('登出成功！', {
        position: "top-right"
      });
    }).catch((error) => {
      toast.success(`登出失敗！\n錯誤訊息：\n${error}`, {
        position: "top-right"
      });
    });
    router.push('/');
  }

  return (
    <>
      <div className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div className="flex flex-col items-center pb-10">
          <div className="relative mb-3 mt-3">
            <img className="w-24 h-24 shadow-lg p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-" src={props.image} alt="Bonnie image" />
            <span className="right-1 bottom-1 absolute  w-5 h-5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
          </div>

          <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{ props.name }</h5>
          <span className="text-sm text-gray-500 dark:text-gray-400">{ props.email }</span>
          <span className="text-sm text-gray-700 dark:text-gray-300">UID: { props.uid }</span>
          <div className="flex mt-4 space-x-3 md:mt-6">
            <button onClick={props.deleteAccount} className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 focus:outline-none dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">刪除帳戶</button>
            <button onClick={logout_btn} className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700">登出帳戶</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default PersonalCard;