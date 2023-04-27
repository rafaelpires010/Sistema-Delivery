import styles from './styles.module.css';
import CardapioIcon from './cardapio.svg';
import ConfigIcon from './config.svg';
import FavoritoIcon from './favorito.svg';
import PedidosIcon from './pedidos.svg';
import SacolaIcon from './sacola.svg';
import SairIcon from './sair.svg';


type Props = {
    label: string;
    icon: 'cardapio' | 'config' | 'favorito' | 'pedidos' | 'sacola' | 'sair'
    onClick: () => void;
    disabled?: boolean;
 }
export const SidebarMenuitem = ({label, icon, onClick, disabled}: Props) => {
    return (
        <div>
            {!disabled && 
                
                <div className={styles.container} onClick={onClick}>
            
                {icon === 'cardapio' && <CardapioIcon />}
                {icon === 'config' && <ConfigIcon />}
                {icon === 'favorito' && <FavoritoIcon />}
                {icon === 'pedidos' && <PedidosIcon />}
                {icon === 'sacola' && <SacolaIcon />}
                {icon === 'sair' && <SairIcon />}
                
                <span className={disabled ? styles.disabled : ''}>{label}</span>
                
                </div>
            
            }

        </div>
        
        
    );
};