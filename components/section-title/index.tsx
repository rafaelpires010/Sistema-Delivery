import { motion } from 'framer-motion';
import styles from './styles.module.css';

type SectionTitleProps = {
  title: string
}

export const SectionTitle = ({

  title,

}: SectionTitleProps) => {
  const animProps = {
    initial: { opacity: 0, x: -100 },
    whileInView: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  }

  return (
    <div className={styles.container}>
      <motion.h3
        className={styles.title}
        {...animProps}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {title}
      </motion.h3>
    </div>
  )
}
