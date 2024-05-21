import { motion } from 'framer-motion'
import styles from './styles.module.css'
import { Icon } from '../icons';
import { CartItem } from '../../types/CartItem';
import { useFormater } from '../../libs/useFormater';
import React from 'react';

type Props = {
  color: string;
  onClick: () => void;
  cart: CartItem[];
  subtotal: number;
}

export const CartButton = ({ color, onClick, cart, subtotal }: Props) => {
  const formatter = useFormater();
  return (

    <motion.div
      className={styles.container}
      initial={{ opacity: 0, right: -10 }}
      animate={{ opacity: 1, right: 16 }}
      exit={{ opacity: 0, right: -10 }}

      onClick={onClick}
    >

      <div className={styles.conteudo}>
        <div className={styles.left}>
          <div className={styles.icon}>
            <Icon icon='cart' altura={2} largura={2} color={'#FFFFFF'} />
          </div>
          <div className={styles.qtCart}
            style={{ backgroundColor: color }}
          >
            {cart.length}

          </div>
        </div>

        <div className={styles.center}>
          Ver Sacola
        </div>

        <div className={styles.right}>
          {formatter.fomatePrice(subtotal)}
        </div>

      </div>
    </motion.div>
  )
}
