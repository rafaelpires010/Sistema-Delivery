import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { Icon } from '../../components/icons';
import { Logo } from '../../components/Logo';
import { useAppContext } from '../../contexts/app';
import { Api } from '../../libs/useApi';
import styles from '../../styles/Forget.module.css';
import { Tenent } from '../../types/Tenent';

const ForgetSuccess = (data: Props) => {

    const { tenent, setTenent } = useAppContext();

    useEffect(() => {
        setTenent(data.tenent);
    }, [])

    const [email, setEmail] = useState('');

    const router = useRouter();

    const handleSubmit = () => {
        router.push(`/${data.tenent.slug}/login`);
    }


    return (

        <div className={styles.body}
            style={{ backgroundColor: data.tenent.second_color }}
        >
            <div className={styles.container}>

                <Head>
                    <title>Esqueci minha senha | {data.tenent.nome}</title>
                </Head>

                <div className={styles.header}>
                    <Header color="white" backHref={`/${data.tenent.slug}/forget`}
                    />
                </div>

                <div className={styles.AreaConteudo}>

                    <div className={styles.formArea}>

                        <Icon icon='emailIcon' color={data.tenent.main_color} largura={99} altura={81} ></Icon>

                        <div className={styles.forgot}>Verifique seu e-mail</div>
                        <div className={styles.forgotsub}>Enviamos um email com as instruções de como redefinir sua senha.</div>

                        <div className={styles.inputButton}>

                            <Button
                                color={data.tenent.main_color}
                                label="Fazer Login"
                                onClick={handleSubmit}
                                fill
                            />

                        </div>

                    </div>




                </div>

            </div>



        </div>



    );


}


export default ForgetSuccess;

type Props = {
    tenent: Tenent
}

export const getServerSideProps: GetServerSideProps = async (context) => {

    const { tenent: tenantSlug } = context.query
    const api = Api(tenantSlug as string);


    //Get Tenant
    const tenent = await api.getTenant();

    if (!tenent) {
        return { redirect: { destination: '/', permanent: false } }
    }

    return {
        props: {
            tenent
        }
    }


}



