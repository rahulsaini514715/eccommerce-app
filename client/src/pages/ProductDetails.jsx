import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [cart, setCart] = useCart();

  //initalp details
  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);
  //getProduct
  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:8080/api/v1/product/get-product/${params.slug}`
      );
      setProduct(data?.product);
      getSimilarProduct(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.log(error);
    }
  };

  //get similar product
  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `http://localhost:8080/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      {/* {JSON.stringify(product,null,4)} */}

      <div className="row container mt-2">
        <div className="col-md-6">
          <img
            src={`http://localhost:8080/api/v1/product/product-photo/${product._id}`}
            className="card-img-top"
            alt={product.name}
            style={{ height: "400px", objectFit: "contain" }}
          />
        </div>
        <div className="col-md-6 ">
          <h1 className="text-center">Product Details</h1>
          <h6>Name : {product.name}</h6>
          <h6>Description : {product.description}</h6>
          <h6>Price : ${product.price}</h6>
          <h6>Category : {product?.category?.name}</h6>
          <button
            className="btn btn-secondary ms-1"
            onClick={() => {
              setCart([...cart, product]);
              localStorage.setItem("cart", JSON.stringify([...cart, product]));
              toast.success("Item Added to Cart");
            }}
          >
            ADD TO CART
          </button>
        </div>
      </div>
      <hr />
      <div className="container mt-4">
  <h4 className="mb-4 text-primary fw-bold">🛍️ Similar Products</h4>

  {relatedProducts.length < 1 && (
    <p className="text-center text-danger">No Similar Products Found</p>
  )}

  <div className="row">
    {relatedProducts?.map((p) => (
      <div className="col-md-4 mb-4" key={p._id}>
        <div className="card h-100 shadow-sm border-0">
          <img
            src={`http://localhost:8080/api/v1/product/product-photo/${p?._id}`}
            className="card-img-top"
            alt={p.name}
            style={{ height: "200px", objectFit: "contain" }}
          />
          <div className="card-body d-flex flex-column">
            <h5 className="card-title">{p.name}</h5>
            <p className="card-text text-muted">
              {p.description.substring(0, 30)}...
            </p>
            <p className="card-text fw-semibold">₹ {p.price}</p>

            <div className="mt-auto d-flex gap-2">
              <button
                className="btn btn-primary btn-sm w-50"
                onClick={() => navigate(`/product/${p.slug}`)}
              >
                More Details
              </button>

              <button
                className="btn btn-outline-secondary btn-sm w-50"
                onClick={() => {
                  setCart([...cart, p]);
                  localStorage.setItem("cart", JSON.stringify([...cart, p]));
                  toast.success("Item Added to Cart");
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

    </Layout>
  );
};

export default ProductDetails;
