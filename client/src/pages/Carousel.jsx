import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
const Carousel = () => {
  return (
    <div id="carouselExample" className="carousel slide" data-bs-ride="carousel">
      {/* Indicators */}
      <div className="carousel-indicators">
        <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="1" aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="2" aria-label="Slide 3"></button>
      </div>

      {/* Carousel Slides */}
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img src="/images/Ecommerce_banner.jpg" className="d-block w-100" alt="Los Angeles" />
        </div>
        <div className="carousel-item">
          <img src="/images/banner2.jpg" className="d-block w-100" alt="Chicago" />
        </div>
        <div className="carousel-item">
          <img src="/images/Banner3.jpg" className="d-block w-100" alt="New York" />
        </div>
      </div>

      {/* Controls */}
      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default Carousel;
