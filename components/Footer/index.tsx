import { useAppContext } from '../../contexts/app';
import styles from './styles.module.css';

export const Footer = () => {
    const { tenent } = useAppContext();

    return (
        <footer className={styles.container}>
            <div className={styles.content}>
                <div className={styles.left}>
                    <div className={styles.logo}>
                        <img src={tenent?.img} alt={tenent?.nome} />
                    </div>
                </div>

                <div className={styles.centerTop}>
                    <p>{tenent?.nome} - 2025. Todos os direitos reservados</p>
                </div>

                <div className={styles.centerBottom}>
                    <p>
                        <span>CNPJ: {tenent?.tenantInfo.cnpj}</span> |
                        <span>{tenent?.tenantInfo.rua}, {tenent?.tenantInfo.numero} - {tenent?.tenantInfo.cidade}</span> |
                        <span>{tenent?.tenantInfo.telefone}</span>
                    </p>
                </div>
            </div>
        </footer>
    );
} 