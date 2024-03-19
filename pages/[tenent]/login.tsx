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
import { useAuthContext } from '../../contexts/auth';
import { Api } from '../../libs/useApi';
import styles from '../../styles/login.module.css';
import { Tenent } from '../../types/Tenent';

const Login = (data: Props) => {

    const { tenent, setTenent } = useAppContext();
    const { setToken, setUser } = useAuthContext();


    useEffect(() => {
        setTenent(data.tenent);
    }, [])

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const router = useRouter();

    const handleSubmit = () => {
        
        setToken('1234')
        setUser({
            name: 'Rafael Pires',
            email: 'rafapires2210@gmail.com'
        });

        router.push(`/${data.tenent.slug}`);
    }

    const handleSingUp = () => {
        router.push(`/${data.tenent.slug}/singup`)
    }

    return (

        <div className={styles.body}
            style={{ backgroundColor: data.tenent.background }}
        >
            <div className={styles.container}>

                <Head>
                    <title>Login | {data.tenent.name}</title>
                </Head>

                <div className={styles.header}>
                    <Header color={data.tenent.mainColor} backHref={`/${data.tenent.slug}`}
                    />
                </div>


                <div className={styles.logo}>
                    <Logo />
                </div>

                <div className={styles.AreaConteudo}>

                    <div className={styles.formArea}>
                        <div className={styles.text}>Email:</div>
                        <div className={styles.inputArea}>

                            <InputFild

                                color={data.tenent.mainColor}
                                placeholder="Digite seu e-mail"
                                value={email}
                                onChange={setEmail}

                            />

                        </div>

                        <div className={styles.text}>Senha:</div>
                        <div className={styles.inputArea}>

                            <InputFild

                                color={data.tenent.mainColor}
                                placeholder="Digite sua senha"
                                value={password}
                                onChange={setPassword}
                                password

                            />

                        </div>

                        <div className={styles.inputButton}>

                            <Button
                                color={data.tenent.mainColor}
                                label="Entrar"
                                onClick={handleSubmit}
                                fill
                            />

                        </div>

                    </div>

                    <div className={styles.forgetArea}>
                            Esqueci minha <Link href={`/${data.tenent.slug}/forget`}> <p style={{color: data.tenent.mainColor}} >Senha</p></Link>
                    </div>

                    <div className={styles.singupArea}>
                        <Button
                            color={data.tenent.mainColor}
                            label="Cadastrar"
                            onClick={handleSingUp}
                        />
                    </div>

                </div>

            </div>



        </div>



    );


}


export default Login;

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



