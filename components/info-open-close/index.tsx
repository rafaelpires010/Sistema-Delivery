import { Icon } from '../icons'
import styles from './styles.module.css'
import { motion } from 'framer-motion';

type Props = {
    itsOpen: boolean
}

export const InfoOpenClose = ({ itsOpen }: Props) => {
    if (itsOpen) {
        return (

            <motion.div
                className={styles.container}
                animate={{ scale: [1, 2, 1, 1] }}
                transition={{ duration: 0.5, delay: 0.2 }}

            >
                <div className={styles.conteudo}
                    style={{
                        backgroundColor: '#D5EEE6',
                        color: '#6AB70A',
                        border: '3px solid #6AB70A',
                        borderRadius: '8px'
                    }}
                >
                    <div className={styles.icon}>
                        <Icon icon={'storeOpen'} color={''} largura={0} altura={0} />
                    </div>

                    <div className={styles.text}>
                        Aberto
                    </div>
                </div>
            </motion.div>
        )
    } else {
        return (
            <motion.div
                className={styles.container}
                animate={{ scale: [1, 1.1, 1, 1] }}
                transition={{ duration: 1, delay: 0.2, repeat: Infinity }}

            >
                <div className={styles.conteudo}
                    style={{
                        backgroundColor: '#F7E2E5',
                        color: '#B70A2E',
                        border: '3px solid #B70A2E',
                        borderRadius: '8px'
                    }}
                >
                    <div className={styles.icon}>
                        <Icon icon={'storeClose'} color={''} largura={0} altura={0} />
                    </div>

                    <div className={styles.text}>
                        Fechado
                    </div>
                </div>
            </motion.div>
        )
    }

}