import Link from 'next/link';
import { useAppContext } from '../../contexts/app';
import { useFormater } from '../../libs/useFormater';
import { Product } from '../../types/Product';
import styles from './styles.module.css';

type Props = {

    data: Product;
}

export const ProductItem = ({ data }: Props) => {

    const { tenent } = useAppContext();

    const formatter = useFormater();

    return (

        

            <a href = {`/${tenent?.slug}/product/${data.id}`}className={styles.container}>

                <div className={styles.head} style={{ backgroundColor: tenent?.secondColor }}></div>

                <div className={styles.info}>

                    <div className={styles.img}>
                        <img src={data.image} alt="" />
                    </div>

                    <div className={styles.categoria}>{data.categoria}</div>
                    <div className={styles.nome}>{data.nome}</div>
                    <div className={styles.preco} style={{ color: tenent?.mainColor }}>{formatter.fomatePrice(data.preco)}</div>

                </div>
            </a>

        

    );
}