import { useFormater } from '../../libs/useFormater';
import { Complements } from '../../types/Complements';
import { Quantity } from '../Quantity';
import styles from './styles.module.css'

type Props = {
    color: string;
    onChange: (newCountAd: number, id: number) => void;
    data: Complements;
}




export const AdComponent = ({color, onChange, data }: Props) => {
    
    return (
        
        <div className={styles.container}>
            <div className={styles.leftSide}>

            <input className={styles.checkbox} type="checkbox"/>

            </div>
            <div className={styles.centerSide}>

                <div className={styles.title}>{data.nome}</div>
                <div className={styles.preco}>{(data.preco)}</div>
            </div>
            <div className={styles.rightSide}>
            
                
            </div>
            
        </div>
        
    );
    
}

