import { subtle } from 'crypto';
import { title } from 'process';
import styles from './styles.module.css'

type Props = {
    title: string;
    subtitle?: string
}

export const  AreaTitleCA = ({title, subtitle}: Props) => {
    return (
        
        <div className={styles.container}>
            <div className={styles.title}>{title}</div>
            <div className={styles.subTitle}>{subtitle}</div>
        </div>
    );
}