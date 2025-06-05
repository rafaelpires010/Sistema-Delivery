import router from 'next/router';
import { useAuthContext } from '../../contexts/auth';
import { Tenent } from '../../types/Tenent';
import { Button } from '../Button';
import { SidebarMenuitem } from '../SidebarMenuitem';
import styles from './styles.module.css';

type Props = {
    tenent: Tenent;
    open: boolean;
    onclose: () => void;
}

export const Sidebar = ({ tenent, open, onclose }: Props) => {
    const { user, setToken } = useAuthContext();

    return (
        <aside
            className={styles.container}
            style={{
                width: open ? '100vw' : '0'
            }}
            aria-hidden={!open}
        >
            <div className={styles.area}>
                <div className={styles.header}>
                    <div
                        className={styles.loginArea}
                        style={{ borderBottomColor: tenent.main_color }}
                    >
                        {user ? (
                            <div className={styles.userinfo}>
                                <strong>{user.nome}</strong>
                                Último pedido há x semanas
                            </div>
                        ) : (
                            <Button
                                color={tenent.main_color}
                                label="Fazer login"
                                onClick={() => router.push(`/${tenent.slug}/login`)}
                                fill
                            />
                        )}
                    </div>
                    <button
                        className={styles.closeBtn}
                        style={{ color: tenent.main_color }}
                        onClick={onclose}
                        aria-label="Fechar menu"
                    >
                        ×
                    </button>
                </div>

                <div className={styles.line} />

                <nav className={styles.menu}>
                    <SidebarMenuitem
                        icon='cardapio'
                        label='Cardápio'
                        onClick={onclose}
                    />
                    <SidebarMenuitem
                        icon='favorito'
                        label='Favoritos'
                        onClick={() => { }}
                    />
                    <SidebarMenuitem
                        icon='sacola'
                        label='Sacola'
                        onClick={() => router.push(`/${tenent.slug}/cart`)}
                    />
                </nav>

                <div className={styles.menubutton}>
                    {user && (
                        <SidebarMenuitem
                            icon='sair'
                            label='Sair'
                            onClick={() => {
                                setToken('');
                                onclose();
                            }}
                        />
                    )}
                </div>
            </div>
        </aside>
    );
}