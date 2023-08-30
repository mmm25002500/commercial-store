import Card from "@/components/Card";
import { db } from "@/config/firebase";
import { collection, getDocs, DocumentData, deleteDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface ProductData {
  data: DocumentData;
  id: string;
}

const Store = () => {
  const [products, setProducts] = useState<ProductData[]>([]);

  // get all users when component is mounted
  useEffect(() => {
    getProducts()
  }, []);

  // get all products
  const getProducts = () => {
    const productsRef = collection(db, 'products');
    getDocs(productsRef)
      .then(res => {
        const productData = res.docs.map(
          doc => ({
            data: doc.data(),
            id: doc.id
          })
        );
        setProducts(productData);
      })
      .catch(err => {
        console.log(err);
      })
  }

  const deleteProduct = (id: string) => {
    const productDocRef = doc(db, 'products', id);
    deleteDoc(productDocRef)
      .then(() => {
        toast.success("刪除成功！", {
          position: "top-right"
        })
        getProducts()
      })
      .catch((error) => {
        toast.error(`刪除失敗！\n錯誤訊息：\n${error}`, {
          position: "top-right"
        })
      });
  }

  return (
    <div className="container mx-auto pt-8 pl-5 pr-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product.id}>
            <Card
              title={product.data.title}
              description={product.data.description}
              link="/"
              price={product.data.price}
              img={product.data.img_addr}
              id={product.id}
              deleteProduct={deleteProduct}
            />
          </div>
        ))}
      </div>
    </div>
  );
};


export default Store;