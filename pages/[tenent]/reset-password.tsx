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

const ResetPassword = (data: Props) => {

    const { tenent, setTenent } = useAppContext();
    const { setToken, setUser } = useAuthContext();


    useEffect(() => {
        setTenent(data.tenent);
    }, [])

    const [senha, setSenha] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const router = useRouter();

    const handleSubmit = async () => {
        const api = Api(data.tenent.slug);

        const result = await api.resetPassword(data.token, senha, newPassword);

        if (result) {
            // Redirecionar para a página inicial do tenant
            router.push(`/${data.tenent.slug}/login`);
        } else {
            alert('Erro ao fazer login. Verifique suas credenciais.');
        }
    }

    return (

        <div className={styles.body}
            style={{ backgroundColor: data.tenent.second_color }}
        >
            <div className={styles.container}>

                <Head>
                    <title>Login | {data.tenent.nome}</title>
                </Head>

                <div className={styles.header}>
                    <Header color="white" backHref={`/${data.tenent.slug}`}
                    />
                </div>


                <div className={styles.logo}>
                    <Logo />
                </div>

                <div className={styles.AreaConteudo}>

                    <div className={styles.formArea}>
                        <div className={styles.text}>Nova Senha:</div>
                        <div className={styles.inputArea}>

                            <InputFild

                                color={data.tenent.main_color}
                                placeholder="Digite sua senha"
                                value={senha}
                                onChange={setSenha}
                                password

                            />

                        </div>

                        <div className={styles.text}>Confirme sua Senha:</div>
                        <div className={styles.inputArea}>

                            <InputFild

                                color={data.tenent.main_color}
                                placeholder="Digite sua senha"
                                value={newPassword}
                                onChange={setNewPassword}
                                password

                            />

                        </div>

                        <div className={styles.inputButton}>

                            <Button
                                color={data.tenent.main_color}
                                label="Redefinir Senha"
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


export default ResetPassword;

type Props = {
    tenent: Tenent
    token: string
}

export const getServerSideProps: GetServerSideProps = async (context) => {

    const { tenent: tenantSlug } = context.query
    const { token: token } = context.query
    const api = Api(tenantSlug as string);
    console.log(token)


    //Get Tenant
    const tenent = await api.getTenant();

    if (!tenent) {
        return { redirect: { destination: '/', permanent: false } }
    }

    return {
        props: {
            tenent,
            token
        }
    }


}



