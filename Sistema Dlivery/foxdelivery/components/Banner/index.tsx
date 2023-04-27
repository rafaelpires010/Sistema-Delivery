import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import styles from './styles.module.css';
import {Autoplay} from 'swiper';


export const Banner = () => {


    return (

        <div className={styles.container}>

    <Swiper
      spaceBetween={50}
      slidesPerView={1}
      className={styles.swiper}
      
      loop = {true}
      autoplay={{
        
        delay: 4000,
        disableOnInteraction: false,

      }}

      modules={[Autoplay]}

      onSlideChange={() => console.log('slide change')}
      onSwiper={(swiper) => console.log(swiper)}
    >
     
        <SwiperSlide className={styles.slide}><img src="/temp/banner1.png" alt="" /></SwiperSlide>
        <SwiperSlide className={styles.slide}><img src="/temp/banner1.png" alt="" /></SwiperSlide>

    </Swiper>
        </div>

    );
}