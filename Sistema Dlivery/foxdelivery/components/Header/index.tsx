import Link from 'next/link';
import styles from './styles.module.css'
import BackIcon from './backIcon.svg'

type Props = {
    backHref: string;
    color: string;
    title?: string;
    subtitle?: string;
    invert?: boolean;
}

export const Header = ({backHref, color, title, subtitle, invert}: Props) => {
    return (
        <div className={styles.container}>
            <div className={styles.leftSide}>
                
                <Link href={backHref}>
                    <BackIcon color={invert? '#fff' : color}></BackIcon>
                </Link>
            
            </div>
            <div className={styles.centerSide}>
                
                {title && <div 
                className={styles.title}
                style={{color: invert ? '#fff' : '#1b1b1b'}}                

                >{title}</div>}

                {subtitle && <div className={styles.subTitle}>{subtitle}</div>}

            </div>
            <div className={styles.rightSide}></div>
        </div>
    );
}