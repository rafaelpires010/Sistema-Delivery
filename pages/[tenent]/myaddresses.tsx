import { getCookie, setCookie } from 'cookies-next';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import { useAppContext } from '../../contexts/app';
import { useAuthContext } from '../../contexts/auth';
import { Api } from '../../libs/useApi';
import styles from '../../styles/MyAddresses.module.css';
import { Tenent } from '../../types/Tenent';
import { User } from '../../types/User';
import Head from 'next/head';
import { Header } from '../../components/Header';
import { useFormater } from '../../libs/useFormater';
import { useRouter } from 'next/router';
import { Button } from '../../components/Button';
import { Address } from '../../types/Address';
import { AddressItem } from '../../components/AddressItem';
import { Footer } from '../../components/Footer';

const MyAddresses = (data: Props) => {
    const { setToken, setUser } = useAuthContext();
    const { tenent, setTenent, setShippingAddress, setShippingPrice } = useAppContext();

    useEffect(() => {
        setTenent(data.tenent);
        setToken(data.token);
        if (data.user) setUser(data.user);
    }, []);

    const formatter = useFormater();
    const router = useRouter();
    const api = Api(data.tenent.slug);

    const handleAddressSelect = async (address: Address) => {
        const price = await api.getShippingPrice(data.tenent.id, address.cep);
        if (price) {
            setShippingAddress(address);
            setShippingPrice(price);
            router.push(`/${data.tenent.slug}/checkout`)
        }

    }
    const handleAddressEdit = (id: number) => {
        router.push(`/${data.tenent.slug}/address/${id}`)
    }
    const handleAddressDelete = async (id: number) => {
        await api.deleteUserAddress(id);
        router.reload();
    }
    const handleNewAddress = () => {
        router.push(`/${data.tenent.slug}/address/new`)
    }

    // Menu Events
    const [menuOpened, setMenuOpened] = useState(0);
    const handleMenuEvent = (event: MouseEvent) => {
        const tagName = (event.target as Element).tagName;
        if (!['path', 'svg'].includes(tagName)) {
            setMenuOpened(0);
        }
    }
    useEffect(() => {
        window.removeEventListener('click', handleMenuEvent);
        window.addEventListener('click', handleMenuEvent);
        return () => window.removeEventListener('click', handleMenuEvent);
    }, [menuOpened]);

    return (
        <div className={styles.container}>
            <Head>
                <title>Meus Endereços | {data.tenent.nome}</title>
            </Head>

            <div className={styles.headerArea}>
                <div className={styles.headerContent}>
                    <Header
                        backHref={`/${data.tenent.slug}/checkout`}
                        title='Meus Endereços'
                        color={data.tenent.main_color}
                    />
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.list}>
                    {data.addresses.map((item, index) => (
                        <AddressItem
                            key={index}
                            color={data.tenent.main_color}
                            address={item}
                            onSelect={handleAddressSelect}
                            onEdit={handleAddressEdit}
                            onDelete={handleAddressDelete}
                            menuOpened={menuOpened}
                            setMenuOpened={setMenuOpened}
                        />
                    ))}
                </div>

                <div className={styles.btnArea}>
                    <Button
                        color={data.tenent.main_color}
                        label="Novo Endereço"
                        onClick={handleNewAddress}
                        fill
                    />
                </div>
            </div>

        </div>
    );
}


export default MyAddresses;

type Props = {
    tenent: Tenent,
    token: string,
    user: User | null;
    addresses: Address[]

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
    if (!user) {
        return { redirect: { destination: 'login', permanent: false } }
    }

    // Get Addresses from logger User

    const addresses = await api.getUserAddresses(user.id)



    return {
        props: {
            tenent,
            user,
            token,
            addresses
        }
    }


}
