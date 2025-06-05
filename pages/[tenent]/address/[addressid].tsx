import { getCookie, setCookie } from 'cookies-next';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import { useAppContext } from '../../../contexts/app';
import { useAuthContext } from '../../../contexts/auth';
import { Api } from '../../../libs/useApi';
import styles from '../../../styles/NewAddresses.module.css';
import { Tenent } from '../../../types/Tenent';
import { User } from '../../../types/User';
import Head from 'next/head';
import { Header } from '../../../components/Header';
import { useFormater } from '../../../libs/useFormater';
import { useRouter } from 'next/router';
import { Button } from '../../../components/Button';
import { Address } from '../../../types/Address';
import { InputFild } from '../../../components/InputFild';

const EditAddress = (data: Props) => {
    const { setToken, setUser } = useAuthContext();
    const { tenent, setTenent } = useAppContext();

    useEffect(() => {
        setTenent(data.tenent);
        setToken(data.token);
        if (data.user) setUser(data.user);
    }, []);

    const formatter = useFormater();
    const router = useRouter();
    const api = Api(data.tenent.slug);

    const [errorFields, setErrorFields] = useState<string[]>([]);

    const [address, setAddress] = useState<Address>(data.address);

    const changeAddressfield = (
        field: keyof Address,
        value: typeof address[keyof Address]
    ) => {
        setAddress({ ...address, [field]: value, id_user: data.user?.id });
    }

    const verifyAddress = () => {
        let newErrorFields = [];

        let approved = true;

        if (address.cep.replaceAll(/[^0-9]/g, '').length !== 8) {
            newErrorFields.push('cep');
            approved = false;
        }
        if (address.numero.length <= 0) {
            newErrorFields.push('numero');
            approved = false;
        }
        if (address.rua.length <= 2) {
            newErrorFields.push('rua');
            approved = false;
        }
        if (address.bairro.length <= 2) {
            newErrorFields.push('bairro');
            approved = false;
        }
        if (address.cidade.length <= 2) {
            newErrorFields.push('cidade');
            approved = false;
        }
        if (address.estado.length <= 1) {
            newErrorFields.push('estado');
            approved = false;
        }

        setErrorFields(newErrorFields)
        return approved;
    }

    const handleSaveAddress = async () => {
        if (verifyAddress()) {
            console.log(address)
            await api.editUserAddress(address);
            router.push(`/${data.tenent.slug}/myaddresses`)
        }

    }

    return (

        <div className={styles.container}>
            <Head>
                <title>Editar Endereço | {data.tenent.nome}</title>
            </Head>

            <Header
                backHref={`/${data.tenent.slug}/myaddresses`}
                title='Editar Endereço'
                color={data.tenent.main_color}
            />

            <div className={styles.inputs}>
                <div className={styles.row}>
                    <div className={styles.column}>
                        <div className={styles.label}>CEP:</div>
                        <InputFild
                            color={data.tenent.main_color}
                            placeholder="Insira o seu CEP"
                            value={address.cep}
                            onChange={value => changeAddressfield('cep', value)}
                            warning={errorFields.includes('cep')}
                        />
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.column}>
                        <div className={styles.label}>Rua:</div>
                        <InputFild
                            color={data.tenent.main_color}
                            placeholder="Nome da Rua"
                            value={address.rua}
                            onChange={value => changeAddressfield('rua', value)}
                            warning={errorFields.includes('rua')}
                        />
                    </div>
                    <div className={styles.column}>
                        <div className={styles.label}>Numero:</div>
                        <InputFild
                            color={data.tenent.main_color}
                            placeholder="Ex: 99"
                            value={address.numero}
                            onChange={value => changeAddressfield('numero', value)}
                            warning={errorFields.includes('numero')}
                        />
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.column}>
                        <div className={styles.label}>Bairro:</div>
                        <InputFild
                            color={data.tenent.main_color}
                            placeholder="Nome do Bairro"
                            value={address.bairro}
                            onChange={value => changeAddressfield('bairro', value)}
                            warning={errorFields.includes('bairro')}
                        />
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.column}>
                        <div className={styles.label}>Cidade:</div>
                        <InputFild
                            color={data.tenent.main_color}
                            placeholder="Nome da cidade"
                            value={address.cidade}
                            onChange={value => changeAddressfield('cidade', value)}
                            warning={errorFields.includes('cidade')}
                        />
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.column}>
                        <div className={styles.label}>Estado:</div>
                        <InputFild
                            color={data.tenent.main_color}
                            placeholder="Nome do estado"
                            value={address.estado}
                            onChange={value => changeAddressfield('estado', value)}
                            warning={errorFields.includes('estado')}
                        />
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.column}>
                        <div className={styles.label}>Complemento:</div>
                        <InputFild
                            color={data.tenent.main_color}
                            placeholder="opcional"
                            value={address.complemento ?? ''}
                            onChange={value => changeAddressfield('complemento', value)}
                        />
                    </div>
                </div>


            </div>

            <div className={styles.btnArea}>
                <Button
                    color={data.tenent.main_color}
                    label="Atualizar"
                    onClick={handleSaveAddress}
                    fill
                />
            </div>

        </div>
    );
}


export default EditAddress;

type Props = {
    tenent: Tenent,
    token: string,
    user: User | null;
    address: Address;

}

export const getServerSideProps: GetServerSideProps = async (context) => {

    const { tenent: tenantSlug, addressid } = context.query
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

    // Get Address

    const address = await api.getUserAddress(parseInt(addressid as string));
    if (!address) {
        return { redirect: { destination: 'myaddress', permanent: false } }
    }

    return {
        props: {
            tenent,
            user,
            token,
            address
        }
    }


}
