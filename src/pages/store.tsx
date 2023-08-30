import Card from "@/components/Card";
import { db } from "@/config/firebase";
import { getFirestore, collection, getDocs, DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";

interface ProductData {
  data: DocumentData;
  id: string;
}

const Store = () => {
  const [products, setProducts] = useState<ProductData[]>([]);

  // get all users when component is mounted
  useEffect(() => {
    getUsers()
  }, []);

  // get all users
  const getUsers = () => {
    const usersRef = collection(db, 'products');
    getDocs(usersRef)
      .then(res => {
        const usersData = res.docs.map(
          doc => ({
            data: doc.data(),
            id: doc.id
          })
        );
        setProducts(usersData);
      })
      .catch(err => {
        console.log(err);
      })
  }

  return (
    <div className="container mx-auto pt-8 pl-5 pr-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product.data.title}>
            <Card
              title={product.data.title}
              description={product.data.description}
              link="/"
              img={product.data.img}
            />
          </div>
        ))}
      </div>
    </div>
  );
};


export default Store;