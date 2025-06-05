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
import { Footer } from '../../../components/Footer';

const NewAddress = (data: Props) => {
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

    const [addressCep, setAddressCep] = useState<string>('');
    const [addressIbge, setAddressIbge] = useState<string>('');
    const [addressRua, setAddressRua] = useState<string>('');
    const [addressNumero, setAddressNumero] = useState<string>('');
    const [addressBairro, setAddressBairro] = useState<string>('');
    const [addressCidade, setAddressCidade] = useState<string>('');
    const [addressEstado, setAddressEstado] = useState<string>('');
    const [addressCommplemento, setAddressComplemento] = useState<string>('');

    const verifyAddress = () => {
        let newErrorFields = [];

        let approved = true;

        if (addressCep.replaceAll(/[^0-9]/g, '').length !== 8) {
            newErrorFields.push('cep');
            approved = false;
        }
        if (addressNumero.length <= 0) {
            newErrorFields.push('numero');
            approved = false;
        }
        if (addressRua.length <= 2) {
            newErrorFields.push('rua');
            approved = false;
        }
        if (addressBairro.length <= 2) {
            newErrorFields.push('bairro');
            approved = false;
        }
        if (addressCidade.length <= 2) {
            newErrorFields.push('cidade');
            approved = false;
        }
        if (addressEstado.length <= 1) {
            newErrorFields.push('estado');
            approved = false;
        }

        setErrorFields(newErrorFields)
        return approved;
    }

    const addCepInfos = async (value: string) => {
        setAddressCep(value)
        if (value.length == 8) {
            let cepInfos = await api.getCepInfo(value);
            setAddressRua(cepInfos.logradouro)
            setAddressBairro(cepInfos.bairro)
            setAddressCidade(cepInfos.localidade)
            setAddressEstado(cepInfos.estado)
            setAddressIbge(cepInfos.ibge)
        }
    }

    const handleNewAddress = async () => {
        if (verifyAddress()) {
            let address: Address = {
                id_user: data.user?.id,
                cep: addressCep,
                rua: addressRua,
                id_cidade: Number(addressIbge),
                numero: addressNumero,
                bairro: addressBairro,
                cidade: addressCidade,
                estado: addressEstado,
                complemento: addressCommplemento
            }
            let newAddress = await api.addUserAddress(address);
            console.log(address)
            if (newAddress) {
                router.push(`/${data.tenent.slug}/myaddresses`)
            } else {
                alert('Ocorreu um erro tente mais tarde.')
            }
        }

    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Novo Endereço | {data.tenent.nome}</title>
            </Head>

            <div className={styles.headerArea}>
                <div className={styles.headerContent}>
                    <Header
                        backHref={`/${data.tenent.slug}/myaddresses`}
                        title='Novo Endereço'
                        color={data.tenent.main_color}
                    />
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.inputs}>
                    <div className={styles.row}>
                        <div className={styles.column}>
                            <div className={styles.label}>CEP:</div>
                            <InputFild
                                color={data.tenent.main_color}
                                placeholder="Insira o seu CEP"
                                value={addressCep}
                                onChange={value => addCepInfos(value)}
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
                                value={addressRua}
                                onChange={value => setAddressRua(value)}
                                warning={errorFields.includes('rua')}
                            />
                        </div>
                        <div className={styles.column}>
                            <div className={styles.label}>Numero:</div>
                            <InputFild
                                color={data.tenent.main_color}
                                placeholder="Ex: 99"
                                value={addressNumero}
                                onChange={value => setAddressNumero(value)}
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
                                value={addressBairro}
                                onChange={value => setAddressBairro(value)}
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
                                value={addressCidade}
                                onChange={value => setAddressCidade(value)}
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
                                value={addressEstado}
                                onChange={value => setAddressEstado(value)}
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
                                value={addressCommplemento}
                                onChange={value => setAddressComplemento(value)}
                            />
                        </div>
                    </div>


                </div>

                <div className={styles.btnArea}>
                    <Button
                        color={data.tenent.main_color}
                        label="Adicionar"
                        onClick={handleNewAddress}
                        fill
                    />
                </div>
            </div>
        </div>
    );
}


export default NewAddress;

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
