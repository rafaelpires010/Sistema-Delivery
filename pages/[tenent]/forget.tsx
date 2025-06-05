import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { InputFild } from '../../components/InputFild';
import { Logo } from '../../components/Logo';
import { useAppContext } from '../../contexts/app';
import { Api } from '../../libs/useApi';
import styles from '../../styles/Forget.module.css';
import { Tenent } from '../../types/Tenent';
import { Footer } from '../../components/Footer';

const Forget = (data: Props) => {

    const { tenent, setTenent } = useAppContext();

    useEffect(() => {
        setTenent(data.tenent);
    }, [])

    const [email, setEmail] = useState('');

    const router = useRouter();
    const api = Api(data.tenent.slug)

    const handleSubmit = async () => {
        await api.forget(email, data.tenent.slug)
        router.push(`/${data.tenent.slug}/forget-success`);
    }


    return (
        <div className={styles.container}>
            <Head>
                <title>Esqueci minha senha | {data.tenent.nome}</title>
            </Head>

            <div className={styles.headerArea}>
                <div className={styles.headerContent}>
                    <Header
                        color={data.tenent.main_color}
                        backHref={`/${data.tenent.slug}/login`}
                    />
                </div>
            </div>

            <div className={styles.forgetArea}>
                <div className={styles.formArea}>
                    <div className={styles.formTitle}>
                        Esqueci minha senha
                    </div>
                    <div className={styles.formSubtitle}>
                        Preencha o campo abaixo para receber um e-mail de recuperação
                    </div>

                    <div className={styles.inputArea}>
                        <div className={styles.inputLabel}>E-mail</div>
                        <InputFild
                            color={data.tenent.main_color}
                            placeholder="Digite seu e-mail"
                            value={email}
                            onChange={setEmail}
                        />
                    </div>

                    <div className={styles.inputArea}>
                        <Button
                            color={data.tenent.main_color}
                            label="Enviar"
                            onClick={handleSubmit}
                            fill
                        />
                    </div>

                    <div className={styles.resendArea}>
                        <div className={styles.resendText}>
                            Não recebeu o e-mail?{' '}
                            <Link
                                href="#"
                                className={styles.resendLink}
                                style={{ color: data.tenent.main_color }}
                                onClick={() => handleSubmit()}
                            >
                                Reenviar
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );


}


export default Forget;

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



