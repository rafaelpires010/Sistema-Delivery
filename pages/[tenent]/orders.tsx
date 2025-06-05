import { getCookie, setCookie } from 'cookies-next';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import { useAppContext } from '../../contexts/app';
import { useAuthContext } from '../../contexts/auth';
import { Api } from '../../libs/useApi';
import styles from '../../styles/Orders.module.css';
import { Tenent } from '../../types/Tenent';
import { User } from '../../types/User';
import Head from 'next/head';
import { Header } from '../../components/Header';
import { InputFild } from '../../components/InputFild';
import { Button } from '../../components/Button';
import { useFormater } from '../../libs/useFormater';
import { CartItem } from '../../types/CartItem';
import { useRouter } from 'next/router';
import { CartProductItem } from '../../components/CartProductItem';
import { ButtonWithIcon } from '../../components/ButtonWithIcon';
import { Order } from '../../types/Order';
import { Icon } from '../../components/icons';
import { motion } from 'framer-motion';

const Orders = (data: Props) => {
    const { setToken, setUser } = useAuthContext();
    const { tenent, setTenent } = useAppContext();

    useEffect(() => {
        setTenent(data.tenent);
        setToken(data.token);
        if (data.user) setUser(data.user);
    }, []);

    const formatter = useFormater();
    const router = useRouter();
    const api = Api(data.tenent.slug)



    useEffect(() => {
        const hasUndeliveredOrders = data.orders.some(order => order.status !== 'delivered');
        if (hasUndeliveredOrders) {
            const interval = setTimeout(() => {
                router.reload();
            }, 60000); // 60 segundos

            return () => clearTimeout(interval); // Limpa o intervalo ao desmontar
        }
    }, [data.orders, router]);

    const orderStatusList = {
        received: {
            label: 'Recebido',
            longLabel: 'Já recebemos seu pedido :)',
            backgroundColor: '#d6d6d6',
            fontColor: '#000000',
            pct: 10
        },
        preparing: {
            label: 'Preparando',
            longLabel: 'Estamos preparando seu pedido',
            backgroundColor: '#FEFAE6',
            fontColor: '#D4BC34',
            pct: 25
        },
        sent: {
            label: 'Saiu para entrega',
            longLabel: 'Seu pedido saiu para entrega',
            backgroundColor: '#F1F3F8',
            fontColor: '#758CBD',
            pct: 75
        },
        delivered: {
            label: 'Entregue',
            longLabel: 'Seu pedido foi entregue',
            backgroundColor: '#F1F8F6',
            fontColor: '#6AB70A',
            pct: 100
        },
    }

    let orders = data.orders;

    return (
        <div className={styles.container}>
            <Head>
                <title>Meus Pedidos</title>
            </Head>

            <Header
                backHref={`/${data.tenent.slug}`}
                title={`Meus Pedidos`}
                color={data.tenent.main_color}
            />

            {orders.sort((a, b) => b.id - a.id).map((i, index) => (
                <>
                    <div className={styles.containerPedidos}>

                        <div className={styles.pedido}>
                            <div className={styles.conteudo}>
                                <div className={styles.left}>
                                    <div className={styles.id}>
                                        Pedido #{i.id}
                                    </div>
                                    <div className={styles.date}>
                                        {formatter.formatDate(i.data_order)}
                                    </div>
                                    <div className={styles.textTotal}>Total</div>
                                    <div className={styles.total} style={{ color: data.tenent.main_color }}>
                                        {formatter.fomatePrice(i.preco)}
                                    </div>
                                </div>
                                <div className={styles.right}>
                                    <div className={styles.statusIcons}>
                                        {i.status != 'delivered' &&
                                            <motion.div
                                                className={styles.icon} style={{ color: data.tenent.main_color }}
                                                animate={{ rotate: 360 }}
                                                transition={{
                                                    repeat: Infinity,
                                                    duration: 3,
                                                    ease: "linear",
                                                }}

                                            >
                                                <Icon icon={'ellipse'} color={''} largura={0} altura={0} />
                                            </motion.div>
                                        }
                                        <div
                                            className={styles.orderInfoStatus}
                                            style={{
                                                backgroundColor: orderStatusList[i.status]?.backgroundColor || '#FFFFFF',  // Cor padrão caso o status não seja encontrado
                                                color: orderStatusList[i.status]?.fontColor || '#000000'                   // Cor padrão caso o status não seja encontrado
                                            }}
                                        >
                                            {orderStatusList[i.status]?.label || 'Status desconhecido'}
                                        </div>
                                    </div>

                                    <div className={styles.button}
                                        style={{
                                            color: data.tenent.main_color,
                                            border: `1px solid ${data.tenent.main_color}`
                                        }}
                                        onClick={() => {
                                            router.push(`/${data.tenent.slug}/order/${i.id}`)
                                        }}
                                    >
                                        <Icon icon={'arrowRight'} color={''} largura={24} altura={24} />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </>
            ))}
        </div>
    );
}


export default Orders;

type Props = {
    tenent: Tenent,
    token: string,
    user: User | null;
    orders: Order[];

}

export const getServerSideProps: GetServerSideProps = async (context) => {

    const { tenent: tenantSlug } = context.query
    const api = Api(tenantSlug as string);


    //Get Tenant
    const tenent = await api.getTenant();

    if (!tenent) {
        return { redirect: { destination: '/', permanent: false } }
    }

    //get Logged User 

    const token = getCookie('token', context);
    const user = await api.authorizeToken(token as string);

    //Get Order
    const orders = await api.getOrders(token as string);

    return {
        props: {
            tenent,
            user,
            token,
            orders
        }
    }


}



