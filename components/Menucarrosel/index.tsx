import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import styles from './styles.module.css';
import { useAppContext } from '../../contexts/app';
import Bebida from './icons/bebida.svg';

export const MenuCarrosel = () => {

    const { tenent } = useAppContext();


    return (

        

        <div className={styles.menuCarrosel}>
            
            <Swiper
                spaceBetween={20}
                slidesPerView={3}
                onSlideChange={() => console.log('slide change')}
                onSwiper={(swiper) => console.log(swiper)}>

                
                <SwiperSlide className={styles.buttonCarrosel}>
                     <Bebida color={tenent?.mainColor}></Bebida> Bebidas
                </SwiperSlide>
                <SwiperSlide className={styles.buttonCarrosel}>
                     <Bebida color={tenent?.mainColor}></Bebida> Bebidas
                </SwiperSlide>
                <SwiperSlide className={styles.buttonCarrosel}>
                     <Bebida color={tenent?.mainColor}></Bebida> Bebidas
                </SwiperSlide>
                <SwiperSlide className={styles.buttonCarrosel}>
                     <Bebida color={tenent?.mainColor}></Bebida> Bebidas
                </SwiperSlide>
                <SwiperSlide className={styles.buttonCarrosel}>
                     <Bebida color={tenent?.mainColor}></Bebida> Bebidas
                </SwiperSlide>
                

            </Swiper>

        </div>

    );
}