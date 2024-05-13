import { useFormater } from '../../libs/useFormater';
import { Complements } from '../../types/Complements';
import { Product } from '../../types/Product';
import { Quantity } from '../Quantity';
import styles from './styles.module.css';

type Props = {
    color: string;
    quantidade: number;
    product: Product;
    onChange: (newCount: number, id: number) => void;
    noEdit?: boolean;
}
export const CartProductItem = ({ color, quantidade, product, onChange, noEdit }: Props) => {

    const formatter = useFormater();

    return (
        <div className={styles.container}>
            <div className={styles.productImage}>
                <img src={product.image} alt="" />
            </div>
            <div className={styles.productInfo}>
                <div className={styles.productCategory}>{product.categoria}</div>
                <div className={styles.productName}>{product.nome}</div>
                <div className={styles.productPrice}
                    style={{ color: color }}
                >{formatter.fomatePrice(product.preco)}</div>
                <div className={styles.complementArea}>

                </div>
            </div>
            <div className={styles.qtControl}>
                {noEdit &&
                    <div className={styles.qtArea}>
                        <div className={styles.qtTitle} style={{ color }}>Qnt.</div>
                        <div className={styles.qtCount} style={{ color }}>{quantidade}</div>
                    </div>
                }

                {!noEdit &&
                    <Quantity
                        color={color}
                        count={quantidade}
                        min={0}
                        small
                        onUpdateCount={(newCount: number) => onChange(newCount, product.id)}
                    />
                }


            </div>
        </div>
    );
}