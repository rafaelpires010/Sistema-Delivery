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
import { useApi } from '../../libs/useApi';
import styles from '../../styles/Forget.module.css';
import { Tenent } from '../../types/Tenent';

const Forget = (data: Props) => {

    const { tenent, setTenent } = useAppContext();

    useEffect(() => {
        setTenent(data.tenent);
    }, [])

    const [email, setEmail] = useState('');

    const router = useRouter();

    const handleSubmit = () => {
        router.push(`/${data.tenent.slug}/forget-success`);
    }


    return (

        <div className={styles.body}
            style={{ backgroundColor: data.tenent.background }}
        >
            <div className={styles.container}>

                <Head>
                    <title>Esqueci minha senha | {data.tenent.name}</title>
                </Head>

                <div className={styles.header}>
                    <Header color={data.tenent.mainColor} backHref={`/${data.tenent.slug}/login`}
                    />
                </div>


                <div className={styles.logo}>
                    <Logo />
                </div>

                <div className={styles.AreaConteudo}>

                    <div className={styles.formArea}>

                        <div className={styles.forgot}>Esqueci minha senha:</div>
                        <div className={styles.forgotsub}>Preencha os dados abaixo para realizar a recuperação da senha.</div>

                        <div className={styles.text}>Email:</div>
                        <div className={styles.inputArea}>

                            <InputFild

                                color={data.tenent.mainColor}
                                placeholder="Digite seu e-mail"
                                value={email}
                                onChange={setEmail}

                            />

                        </div>

                        

                        <div className={styles.inputButton}>

                            <Button
                                color={data.tenent.mainColor}
                                label="Enviar"
                                onClick={handleSubmit}
                                fill
                            />

                        </div>

                    </div>

                    <div className={styles.forgetArea}>
                       Não recebeu o e-mail? <Link href={''}> <p style={{color: data.tenent.mainColor}} >clique aqui</p></Link>
                    </div>


                </div>

            </div>



        </div>



    );


}


export default Forget;

type Props = {
    tenent: Tenent
}

export const getServerSideProps: GetServerSideProps = async (context) => {

    const { tenent: tenantSlug } = context.query
    const api = useApi(tenantSlug as string);


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



