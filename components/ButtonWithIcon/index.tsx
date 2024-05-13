import { Icon } from '../icons';
import styles from './styles.module.css';

type Props = {
    color: string;
    leftIcon?: string;
    rightIcon?: string;
    value: string;
    onClick?: () => void;
    fill?: boolean;

}
export const ButtonWithIcon = ({ color, leftIcon, rightIcon, value, onClick, fill }: Props) => {
    return (
        <div
            className={styles.container}
            style={{ backgroundColor: fill ? color : '#F9F9Fb' }}
            onClick={onClick}
        >
            {leftIcon &&
                <div
                    className={styles.leftSide}
                    style={{ backgroundColor: fill ? 'rgba(0, 0, 0, .05)' : '#FFF' }}
                >
                    <Icon
                        color={fill ? '#FFF' : color}
                        icon={leftIcon}
                        largura={24}
                        altura={24} />
                </div>
            }
            <div className={styles.center}
                style={{ color: fill ? '#FFF' : 'black' }}
            >{value}
            </div>
            {rightIcon &&
                <div className={styles.rightSide}>
                    <Icon
                        color={fill ? '#FFF' : color}
                        icon={rightIcon}
                        largura={24}
                        altura={24}

                    />
                </div>
            }


        </div>
    )
}