import { Address } from '../../types/Address';
import { Icon } from '../icons';
import styles from './styles.module.css';

type Props = {
    color: string;
    address: Address;
    onSelect: (address: Address) => void;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    menuOpened: number;
    setMenuOpened: (id: number) => void;
}

export const AddressItem = ({ color, address, onSelect, onEdit, onDelete, menuOpened, setMenuOpened }: Props) => {
    return (
        <div className={styles.container}>
            <div className={styles.addressArea} onClick={() => onSelect(address)}>
                <div className={styles.addressIcon}>
                    <Icon
                        color={color}
                        icon='location'
                        altura={24}
                        largura={24}
                    />

                </div>
                <div className={styles.addressText}>{`${address.rua}, ${address.numero} - ${address.bairro}`}</div>
            </div>
            <div className={styles.btnArea}>
                <div className={styles.menuIcon} onClick={() => setMenuOpened(address.id ? address.id : 0)}>
                    <Icon
                        color={color}
                        icon='dots'
                        altura={24}
                        largura={24}
                    />
                </div>
                {menuOpened === address.id &&
                    <div className={styles.popup}>
                        <div className={styles.popupItem} onClick={() => onEdit(address.id ? address.id : 0)}>
                            <div className={styles.popupIcon}>
                                <Icon icon='edit' color='' altura={24} largura={24} />
                            </div>
                            <div className={styles.popupText}>Editar</div>
                        </div>
                        <div className={styles.popupItem} onClick={() => onDelete(address.id ? address.id : 0)}>
                            <div className={styles.popupIcon}>
                                <Icon icon='delete' color='' altura={24} largura={24} />
                            </div>
                            <div className={styles.popupText}>Deletar</div>
                        </div>
                    </div>
                }

            </div>

        </div>
    )
}