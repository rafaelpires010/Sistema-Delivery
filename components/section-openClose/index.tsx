import { InfoOpenClose } from '../info-open-close'
import styles from './styles.module.css'

export const SectionOpenClose = () => {
    return (
        <div className={styles.container}>

            <div className={styles.cima}>
                <div className={styles.title}>
                    Faustino Pizzaria
                </div>
                <div>
                    <InfoOpenClose itsOpen={false} />
                </div>

            </div>

            <div className={styles.baixo}>
                <div className={styles.funcionamento}>
                    Fecha às 00:00h
                </div>
            </div>

            <div className={styles.infoArea}>
                Taxa de entrega • R$ 3,00
            </div>
        </div>
    )
}