import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import styles from './styles.module.css';
import { Autoplay } from 'swiper';
import { useEffect, useState } from 'react';
import { Banner as Baner } from '../../types/Banner';

type Props = {
  data: Baner[]
}
export const Banner = ({ data }: Props) => {
  const [slidesPerView, setSlidesPerView] = useState(1);

  useEffect(() => {
    const updateSlidesPerView = () => {
      const totalBanners = data.length;
      if (window.innerWidth >= 1600) {
        setSlidesPerView(Math.min(3, totalBanners));
      } else if (window.innerWidth >= 1024) {
        setSlidesPerView(Math.min(2, totalBanners));
      } else {
        setSlidesPerView(1);
      }
    };

    updateSlidesPerView();
    window.addEventListener('resize', updateSlidesPerView);

    return () => {
      window.removeEventListener('resize', updateSlidesPerView);
    };
  }, []);

  return (
    <div className={styles.container}>
      <Swiper
        spaceBetween={20}
        slidesPerView={slidesPerView}
        className={styles.swiper}
        loop={false}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        modules={[Autoplay]}
        breakpoints={{
          0: {
            slidesPerView: 1,
            spaceBetween: 10
          },
          768: {
            slidesPerView: Math.min(2, data.length),
            spaceBetween: 15
          },
          1024: {
            slidesPerView: Math.min(2, data.length),
            spaceBetween: 20
          },
          1600: {
            slidesPerView: Math.min(3, data.length),
            spaceBetween: 20
          }
        }}
      >
        {data.map(banner => (
          <SwiperSlide key={banner.id} className={styles.slide}>
            <img src={banner.img} alt={banner.id} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}