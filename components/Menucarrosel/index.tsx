import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import styles from './styles.module.css';
import { useAppContext } from '../../contexts/app';

export const MenuCarrosel = () => {

     const { tenent } = useAppContext();


     return (



          <div className={styles.menuCarrosel}>

               <Swiper
                    spaceBetween={5}
                    slidesPerView={3}
                    onSlideChange={() => console.log('slide change')}
                    onSwiper={(swiper) => console.log(swiper)}>


                    <SwiperSlide className={styles.buttonCarrosel}>
                         <div className={styles.info}>
                              <div className={styles.image}>
                                   <img src="/temp/bebidas.png" alt="" width={45} height={45} />
                              </div>
                              <div className={styles.text}>
                                   Bebidas
                              </div>
                         </div>
                    </SwiperSlide>
                    <SwiperSlide className={styles.buttonCarrosel}>
                         <div className={styles.info}>
                              <div className={styles.image}>
                                   <img src="/temp/bebidas.png" alt="" width={45} height={45} />
                              </div>
                              <div className={styles.text}>
                                   Bebidas
                              </div>
                         </div>
                    </SwiperSlide>
                    <SwiperSlide className={styles.buttonCarrosel}>
                         <div className={styles.info}>
                              <div className={styles.image}>
                                   <img src="/temp/bebidas.png" alt="" width={45} height={45} />
                              </div>
                              <div className={styles.text}>
                                   Bebidas
                              </div>
                         </div>
                    </SwiperSlide>
                    <SwiperSlide className={styles.buttonCarrosel}>
                         <div className={styles.info}>
                              <div className={styles.image}>
                                   <img src="/temp/bebidas.png" alt="" width={45} height={45} />
                              </div>
                              <div className={styles.text}>
                                   Bebidas
                              </div>
                         </div>
                    </SwiperSlide>
                    <SwiperSlide className={styles.buttonCarrosel}>
                         <div className={styles.info}>
                              <div className={styles.image}>
                                   <img src="/temp/bebidas.png" alt="" width={45} height={45} />
                              </div>
                              <div className={styles.text}>
                                   Bebidas
                              </div>
                         </div>
                    </SwiperSlide>

               </Swiper>

          </div>

     );
}