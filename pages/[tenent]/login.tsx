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
import axios from 'axios';
import { Footer } from '../../components/Footer';

const Login = (data: Props) => {

    const { tenent, setTenent } = useAppContext();
    const { setToken, setUser } = useAuthContext();


    useEffect(() => {
        setTenent(data.tenent);
    }, [])

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const router = useRouter();

    const handleSubmit = async () => {
        const api = Api(data.tenent.slug);

        const result = await api.signin(email, password);

        if (result) {
            // Login bem-sucedido, setar token e usuário no contexto
            setToken(result.token);
            setUser(result.user);

            // Redirecionar para a página inicial do tenant
            router.push(`/${data.tenent.slug}`);
        } else {
            alert('Erro ao fazer login. Verifique suas credenciais.');
        }
    }

    const handleSingUp = () => {
        router.push(`/${data.tenent.slug}/singup`)
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Login | {data.tenent.nome}</title>
            </Head>

            <div className={styles.headerArea}>
                <div className={styles.headerContent}>
                    <Header
                        color={data.tenent.main_color}
                        backHref={`/${data.tenent.slug}`}
                    />
                </div>
            </div>

            <div className={styles.loginArea}>
                <div className={styles.formArea}>
                    <div className={styles.formTitle}>
                        Faça seu login
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
                        <div className={styles.inputLabel}>Senha</div>
                        <InputFild
                            color={data.tenent.main_color}
                            placeholder="Digite sua senha"
                            value={password}
                            onChange={setPassword}
                            password
                        />
                    </div>

                    <div className={styles.inputArea}>
                        <Button
                            color={data.tenent.main_color}
                            label="Entrar"
                            onClick={handleSubmit}
                            fill
                        />
                    </div>

                    <div className={styles.forgetArea}>
                        <Link
                            href={`/${data.tenent.slug}/forget`}
                            className={styles.forgetLink}
                        >
                            Esqueceu sua senha?
                        </Link>
                    </div>

                    <div className={styles.divider}>
                        <div className={styles.dividerText}>ou</div>
                    </div>

                    <div className={styles.signupButton}>
                        <Button
                            color={data.tenent.main_color}
                            label="Criar conta"
                            onClick={handleSingUp}
                        />
                    </div>
                </div>
            </div>

            <Footer />
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



