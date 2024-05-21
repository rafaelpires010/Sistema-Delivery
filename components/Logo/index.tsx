import { useAppContext } from '../../contexts/app';
import styles from './styles.module.css';

export const Logo = () => {

    const { tenent } = useAppContext();

    return (


        <div className={styles.logo}>

            <img src={tenent?.img} alt="" />

        </div>

    );
}