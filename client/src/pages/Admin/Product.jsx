import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
const Products = () => {
  const [products, setProducts] = useState([]);

  //getall products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get("http://localhost:8080/api/v1/product/get-product");
      setProducts(data.products);
    } catch (error) {
      console.log(error);
      toast.error("Someething Went Wrong");
    }
  };

  //lifecycle method
  useEffect(() => {
    getAllProducts();
  }, []);
  return (
   <Layout>
  <div className="container-fluid py-4">
    <div className="row">
      <div className="col-md-3">
        <AdminMenu />
      </div>
      <div className="col-md-9">
        <h2 className="text-center mb-4 text-primary fw-bold">🛍️ All Products</h2>
        <div className="row">
          {products?.map((p) => (
            <div className="col-md-4 mb-4" key={p._id}>
              <Link
                to={`/dashboard/admin/product/${p.slug}`}
                className="text-decoration-none text-dark"
              >
                <div className="card h-100 shadow-sm border-0 hover-shadow transition">
                  <img
                    src={`http://localhost:8080/api/v1/product/product-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.name}
                    style={{ height: "200px", objectFit: "contain" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title fw-semibold">{p.name}</h5>
                    <p className="card-text" style={{ fontSize: "14px", color: "#555" }}>
                      {p.description.length > 80
                        ? `${p.description.substring(0, 80)}...`
                        : p.description}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</Layout>

  );
};

export default Products;
