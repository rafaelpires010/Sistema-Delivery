import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import styles from './styles.module.css';
import { Category } from '../../types/Category';
import { ProductItem } from '../ProductItem'; // Suponho que você tenha esse componente
import { SectionTitle } from '../section-title'; // Suponho que você tenha esse componente
import { Product } from '../../types/Product';

type Props = {
     categories: Category[];
     products: Product[]; // Exemplo de tipo de produto
};

export const MenuCarrosel = ({ categories, products }: Props) => {
     const categoryRefs = useRef<(HTMLDivElement | null)[]>([]); // Referências para cada categoria

     // Função para rolar até a categoria
     const scrollToCategory = (index: number) => {
          categoryRefs.current[index]?.scrollIntoView({
               behavior: 'smooth',
               block: 'start',
          });
     };

     return (
          <div className={styles.menuCarrosel}>
               {/* Carrossel para selecionar categorias */}
               <Swiper
                    spaceBetween={5}
                    slidesPerView={'auto'}
                    freeMode={true}
               >
                    {categories.map((category, index) => (
                         <SwiperSlide
                              className={styles.buttonCarrosel}
                              key={index}
                              onClick={() => scrollToCategory(index)}
                         >
                              <div className={styles.info}>
                                   <div className={styles.image}>
                                        {category.img ? <img src={category.img} alt={category.nome} /> : ""}
                                   </div>
                                   <div className={styles.text}>{category.nome}</div>
                              </div>
                         </SwiperSlide>
                    ))}
               </Swiper>

               {/* Renderizando as categorias com seus produtos */}
               <div className={styles.grid}>
                    {categories.map((category, categoryIndex) => (
                         <div
                              key={categoryIndex}
                              ref={(el) => (categoryRefs.current[categoryIndex] = el)} // Atribui a referência
                              className={styles.category}
                         >
                              <SectionTitle title={category.nome} />

                              <div className={styles.productGrid}>
                                   {/* Filtra os produtos que pertencem à categoria atual */}
                                   {products
                                        .filter((product) => product.category.id === category.id) // Filtra por categoria
                                        .map((filteredProduct, productIndex) => (
                                             <ProductItem
                                                  onClick={() => {
                                                       /* Função de clique */
                                                  }}
                                                  key={`${categoryIndex}-${productIndex}`} // Chave única combinando o índice da categoria e do produto
                                                  data={filteredProduct} // Passa o produto filtrado
                                             />
                                        ))}
                              </div>
                         </div>
                    ))}
               </div>
          </div>
     );
};
