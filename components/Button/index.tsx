import styles from './styles.module.css';

type Props = {
    color: string;
    label: string;
    onClick: () => void;
    fill?: boolean;
    disable?: boolean;
}

export const Button = ({ color, label, onClick, fill, disable }: Props) => {
    return (
        <div
            className={styles.container}
            onClick={!disable ? onClick : () => { }}
            style={{
                color: fill ? '#fff' : color,
                borderColor: color,
                backgroundColor: fill ? color : 'transparent',
                opacity: disable ? .4 : 1
            }}

        >
            {label}
        </div>
    );
}