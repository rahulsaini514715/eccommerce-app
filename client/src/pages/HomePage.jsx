import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";

import axios from "axios";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
import Carousel from "./Carousel";

const HomePage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useCart();
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  //get all cat
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8080/api/v1/category/get-category"
      );
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);
  //get products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:8080/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  //getTOtal COunt
  const getTotal = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8080/api/v1/product/product-count"
      );
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);
  //load more
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:8080/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // filter by cat
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };
  useEffect(() => {
    if (!checked.length || !radio.length) getAllProducts();
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio]);

  //get filterd product
  const filterProduct = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/v1/product/product-filters",
        {
          checked,
          radio,
        }
      );
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Layout title={"All Products - Best Offers"}>
      <div className="container-fluid py-4">
        <div className="row g-4 ">
          {/* Sidebar */}
          {/* Sidebar */}
          <div className="col-md-3">
            <div className="p-3 bg-light rounded shadow-sm h-100 d-flex flex-column justify-content-between">
              <div>
                <h5 className="text-center text-uppercase fw-bold mb-3">
                  Filter By Category
                </h5>
                <div className="d-flex flex-column gap-2 mb-4">
                  {categories?.map((c) => (
                    <Checkbox
                      key={c._id}
                      onChange={(e) => handleFilter(e.target.checked, c._id)}
                    >
                      {c.name}
                    </Checkbox>
                  ))}
                </div>

                <h5 className="text-center text-uppercase fw-bold mb-3">
                  Filter By Price
                </h5>
                <div className="d-flex flex-column gap-2 mb-4">
                  <Radio.Group onChange={(e) => setRadio(e.target.value)}>
                    {Prices?.map((p) => (
                      <div key={p._id}>
                        <Radio value={p.array}>{p.name}</Radio>
                      </div>
                    ))}
                  </Radio.Group>
                </div>
                <div className="d-grid mt-8">
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => window.location.reload()}
                  >
                    Reset Filters
                  </button>
                </div>
              </div>

              {/* Button pinned to bottom */}
            </div>
          </div>



          {/* Products */}
          <div className="col-md-9">
            <div className="w-100">
             <Carousel></Carousel>
            </div>

            <hr />

            <h2 className="text-center mb-4 fw-bold">All Products</h2>

            <div className="row g-4">
              {products?.map((p) => (
                <div className="col-12 col-sm-6 col-md-4" key={p._id}>
                  <div className="card h-100 shadow-sm border-0">
                    <img
                      src={`http://localhost:8080/api/v1/product/product-photo/${p._id}`}
                      className="card-img-top"
                      alt={p.name}
                      style={{ height: "200px", objectFit: "contain" }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{p.name}</h5>
                      <p className="card-text text-muted">
                        {p.description.substring(0, 40)}...
                      </p>
                      <h6 className="text-primary">$ {p.price}</h6>
                      <div className="mt-auto d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary w-50"
                          onClick={() => navigate(`/product/${p.slug}`)}
                        >
                          Details
                        </button>
                        <button
                          className="btn btn-sm btn-primary w-50"
                          onClick={() => {
                            setCart([...cart, p]);
                            localStorage.setItem(
                              "cart",
                              JSON.stringify([...cart, p])
                            );
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

            {/* Load More */}
            <div className="text-center mt-4">
              {products && products.length < total && (
                <button
                  className="btn btn-warning btn-lg"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(page + 1);
                  }}
                >
                  {loading ? "Loading..." : "Load More"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
