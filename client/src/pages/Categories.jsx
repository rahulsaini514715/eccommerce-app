import React from "react";
import { Link } from "react-router-dom";
import useCategory from "../hooks/useCategory";
import Layout from "../components/Layout/Layout";

const bgColors = [
  "bg-primary",
  "bg-danger",
  "bg-success",
  "bg-warning",
  "bg-info",
  "bg-secondary",
  "bg-dark",
  "bg-success-subtle",
  "bg-warning-subtle",
  "bg-info-subtle",
];

const Categories = () => {
  const categories = useCategory();

  return (
    <Layout title={"All Categories"}>
      <div className="container py-4">
        <h2 className="text-center mb-4 fw-bold text-uppercase">All Categories</h2>
        <div className="row g-4">
          {categories.map((c, index) => (
            <div className="col-6 col-md-3" key={c._id}>
              <Link
                to={`/category/${c.slug}`}
                className={`d-block text-white text-center text-decoration-none rounded-4 shadow-sm p-4 transition ${
                  bgColors[index % bgColors.length]
                }`}
                style={{ minHeight: "130px" }}
              >
                <div className="mb-2">
                  <i className="bi bi-grid-3x3-gap-fill fs-3" /> {/* Optional Bootstrap Icon */}
                </div>
                <h5 className="fw-semibold mb-1">{c.name}</h5>
                <small className="text-light">View Products</small>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
