import Link from 'next/link';
import { useAppContext } from '../../contexts/app';
import { useFormater } from '../../libs/useFormater';
import { Product } from '../../types/Product';
import styles from './styles.module.css';

type Props = {

    data: Product;
    onClick: () => void;
}

export const ProductItem = ({ data, onClick }: Props) => {

    const { tenent } = useAppContext();

    const formatter = useFormater();

    return (
        <a href={`/${tenent?.slug}/product/${data.id}`} className={styles.container}>


            <div className={styles.info}>
                <div className={styles.categoria}>{data.category.nome}</div>
                <div className={styles.nome}>
                    {data.nome}
                </div>
                <div className={styles.desc}>
                    {data.descricao}
                </div>
                <div className={styles.preco} style={{ color: tenent?.main_color }}>
                    {formatter.fomatePrice(data.preco)}
                </div>

            </div>

            <div className={styles.img}>
                <img src={data.img} alt={data.nome} />
            </div>
        </a>



    );
}