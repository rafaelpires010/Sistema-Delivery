import { useFormater } from '../../libs/useFormater';
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

    if (!product) return null;

    return (
        <div className={styles.container}>
            <div className={styles.productImage}>
                <img src={product.img} alt={product.nome} />
            </div>

            <div className={styles.productInfo}>
                <div className={styles.productCategory}>
                    {product.category?.nome}
                </div>
                <div className={styles.productName}>
                    {product.nome}
                </div>
                <div
                    className={styles.productPrice}
                    style={{ color: color }}
                >
                    {formatter.fomatePrice(product.preco)}
                </div>

                {product.selectedComplements && product.selectedComplements.length > 0 && (
                    <div className={styles.complementArea}>
                        {product.selectedComplements.map((complement, index) => (
                            <div key={index} className={styles.complementItem}>
                                {complement.nome} ({complement.qt}x)
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className={styles.qtControl}>
                {noEdit ? (
                    <div className={styles.qtArea}>
                        <div className={styles.qtTitle} style={{ color }}>
                            Qnt.
                        </div>
                        <div className={styles.qtCount} style={{ color }}>
                            {quantidade}
                        </div>
                    </div>
                ) : (
                    <Quantity
                        color={color}
                        count={quantidade}
                        min={0}
                        small
                        onUpdateCount={(newCount: number) => onChange(newCount, product.id)}
                    />
                )}
            </div>
        </div>
    );
}