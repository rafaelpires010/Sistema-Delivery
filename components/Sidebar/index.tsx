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

    const { user, setToken} = useAuthContext();

    return (
        <div className={styles.container}
            style={{
                width: open ? '100vw' : '0'
            }}
        >
            <div className={styles.area}>
                <div className={styles.header}>
                    <div className={styles.loginArea}
                        style={{ borderBottomColor: tenent.mainColor }}
                    >

                        {user &&
                            <div className={styles.userinfo}>
                                <strong>{user.name}</strong>
                                Último pedido há x semanas
                            </div>
                        }

                        {!user &&
                            <Button
                                color={tenent.mainColor}
                                label="Fazer login"
                                onClick={() => {
                                    router.push(`/${tenent.slug}/login`)
                                }}
                                fill
                            />
                        }

                    </div>
                    <div className={styles.closeBtn}
                        style={{ color: tenent.mainColor }}
                        onClick={onclose}
                    >x</div>
                </div>

                <div className={styles.line}></div>
                <div className={styles.menu}>
                    <SidebarMenuitem
                        icon='cardapio'
                        label='Cardapio'
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
                        onClick={() => { }}
                    />
                </div>

                <div className={styles.menubutton}>
                    {user &&
                        <SidebarMenuitem
                            icon='sair'
                            label='Sair'
                            onClick={() => { 
                                setToken('');
                                onclose();
                            }}
                        />
                    }
                </div>
            </div>
        </div>
    );
}