"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { LuChevronRight, LuChevronLeft } from "react-icons/lu";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

import "./HeroSlider.scss";

const SLIDES = [
  {
    id: 1,
    image: `/images/ruong-lua-1.jpg`,
    link: "/khuyen-mai-1",
    alt: "Siêu sale thuốc bảo vệ thực vật",
  },
  {
    id: 2,
    image: `/images/ruong-lua-2.jpg`,
    link: "/khuyen-mai-2",
    alt: "Phân bón mùa vụ mới",
  },
  {
    id: 3,
    image: `/images/ruong-lua-3.jpg`,
    link: "/khuyen-mai-3",
    alt: "Dụng cụ làm vườn cao cấp",
  },
];

const RIGHT_BANNERS = [
  {
    id: 1,
    image: `/images/ruong-lua-1.jpg`,
    link: "/san-pham-moi",
    alt: "Sản phẩm mới về",
  },
  {
    id: 2,
    image: `/images/ruong-lua-2.jpg`,
    link: "/combo-tiet-kiem",
    alt: "Combo tiết kiệm",
  },
];

const ImageWithPlaceholder = ({ src, alt, priority, sizes }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="image-placeholder">
      <div className="rethink-hero__art-placeholder">
        <span>VTNN Tư Hồ</span>
      </div>
      <Image
        src={src}
        alt={alt}
        fill
        priority={true}
        sizes={sizes}
        style={{ objectFit: "cover" }}
        className={`mock-img ${isLoaded ? "loaded" : ""}`}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
};

const HeroSlider = () => {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-grid">
          <div className="hero-slider-wrapper">
            <Swiper
              modules={[Autoplay, Pagination, Navigation, EffectFade]}
              spaceBetween={0}
              slidesPerView={1}
              effect="fade"
              loop={true}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
                bulletActiveClass: "swiper-pagination-bullet-active",
              }}
              navigation={{
                nextEl: ".custom-next",
                prevEl: ".custom-prev",
              }}
              className="main-swiper"
            >
              {SLIDES.map((slide, index) => (
                <SwiperSlide key={slide.id}>
                  <Link href={slide.link} className="slide-link">
                    <ImageWithPlaceholder
                      src={slide.image}
                      alt={slide.alt}
                      priority={index === 0}
                      sizes="(max-width: 1023px) 100vw, 70vw"
                    />
                  </Link>
                </SwiperSlide>
              ))}

              <button className="nav-btn custom-prev" aria-label="Previous">
                <LuChevronLeft size={24} />
              </button>
              <button className="nav-btn custom-next" aria-label="Next">
                <LuChevronRight size={24} />
              </button>
            </Swiper>
          </div>

          <div className="hero-banners">
            {RIGHT_BANNERS.map((banner, index) => (
              <Link href={banner.link} key={banner.id} className="sub-banner">
                <ImageWithPlaceholder
                  src={banner.image}
                  alt={banner.alt}
                  priority={index === 0}
                  sizes="(max-width: 1023px) 50vw, 30vw"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
