import { useState } from 'react';
import { useFormater } from '../../libs/useFormater';
import { Complements } from '../../types/Complements';
import { Quantity } from '../Quantity';
import styles from './styles.module.css';

type Props = {
    color?: string;
    onChange: (newCountAd: number, id: number) => void;
    data: Complements;
};

export const AdComponent = ({ color, onChange, data }: Props) => {
    const formatter = useFormater();
    const [count, setCount] = useState(0);

    const handleUpdateCount = (newCount: number) => {
        setCount(newCount);
        onChange(newCount, data.id);
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.leftSide}></div>
                <div className={styles.centerSide}>
                    <div className={styles.title}>{data.nome}</div>
                    <div className={styles.preco}>+{formatter.fomatePrice(data.preco)}</div>
                </div>
                <div className={styles.rightSide}>
                    {!color ? (
                        <input
                            className={styles.checkbox}
                            type="checkbox"
                            aria-label={`Selecionar ${data.nome}`}
                        />
                    ) : (
                        <Quantity
                            color={color}
                            count={count}
                            onUpdateCount={handleUpdateCount}
                            min={0}
                            max={10}
                            small
                        />
                    )}
                </div>
            </div>
            <div style={{
                borderBottom: '0.5px solid rgba(27, 27, 27, .1)',
                width: '100%'
            }}></div>
        </div>
    );
};
