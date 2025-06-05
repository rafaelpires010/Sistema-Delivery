import { useEffect, useState } from 'react';
import { useFormater } from '../../libs/useFormater';
import styles from './styles.module.css';

type Props = {
    color: string;
    count: number;
    onUpdateCount: (newCount: number) => void;
    min?: number;
    max?: number;
    small?: boolean;
}

export const Quantity = ({ color, count, onUpdateCount, min = 1, max, small }: Props) => {
    const formatter = useFormater();

    const [canRemove, setCanRemove] = useState(false);
    const [canAdd, setCanAdd] = useState(false);

    useEffect(() => {
        setCanRemove(count > min);
        setCanAdd(!max || count < max);
    }, [count, min, max]);

    const handleRemove = () => {
        if (canRemove) onUpdateCount(count - 1);
    };

    const handleAdd = () => {
        if (canAdd) onUpdateCount(count + 1);
    };

    return (
        <div className={styles.container}>
            <div
                className={styles.button}
                onClick={handleRemove}
                style={{
                    color: canRemove ? '#FFF' : '#96A3AB',
                    backgroundColor: canRemove ? color : '#F2F4F5',
                    width: small ? 42 : 48,
                    height: small ? 42 : 48
                }}
            >
                -
            </div>

            <div className={styles.qt} style={{ fontSize: small ? 16 : 18 }}>
                {formatter.formatQuantidade(count, 2)}
            </div>

            <div
                className={styles.button}
                onClick={handleAdd}
                style={{
                    color: canAdd ? '#FFF' : '#96A3AB',
                    backgroundColor: canAdd ? color : '#F2F4F5',
                    width: small ? 42 : 48,
                    height: small ? 42 : 48
                }}
            >
                +
            </div>
        </div>
    );
};
