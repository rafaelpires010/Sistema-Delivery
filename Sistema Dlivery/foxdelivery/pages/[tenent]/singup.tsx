import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { InputFild } from '../../components/InputFild';
import { useAppContext } from '../../contexts/app';
import { useApi } from '../../libs/useApi';
import styles from '../../styles/SingUp.module.css';
import { Tenent } from '../../types/Tenent';

const SingUp = (data: Props) => {

    const { tenent, setTenent } = useAppContext();

    useEffect(() => {
        setTenent(data.tenent);
    }, [])

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');

    const router = useRouter();

    const handleSubmit = () => {

    }

    const handleSingUp = () => {
        router.push(`/${data.tenent.slug}/singup`)
        
    }

    return (

        <div className={styles.body}
        >
            <div className={styles.container}>

                <Head>
                    <title>Cadastro | {data.tenent.name}</title>
                </Head>
                

                <div className={styles.header}>
                    <Header color={data.tenent.mainColor} backHref={`/${data.tenent.slug}`}
                    title={'Cadastrar:'}
                    
                    />
                </div>

                <div className={styles.AreaConteudo}>

                    <div className={styles.formArea}>
                        <div className={styles.text}>Nome:</div>
                        <div className={styles.inputArea}>

                            <InputFild

                                color={data.tenent.mainColor}
                                placeholder="Digite seu nome"
                                value={nome}
                                onChange={setNome}

                            />

                        </div>

                        <div className={styles.text}>Telefone:</div>
                        <div className={styles.inputArea}>

                            <InputFild

                                color={data.tenent.mainColor}
                                placeholder="( ) *****-****"
                                value={telefone}
                                onChange={setTelefone}

                            />

                        </div>

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

                        <div className={styles.text}>Confirmar senha:</div>
                        <div className={styles.inputArea}>

                            <InputFild

                                color={data.tenent.mainColor}
                                placeholder="Confirme sua senha"
                                value={password}
                                onChange={setPassword}
                                password

                            />

                        </div>

                        <div className={styles.inputButton}>

                            <Button
                                color={data.tenent.mainColor}
                                label="Cadastrar"
                                onClick={handleSubmit}
                                fill
                            />

                        </div>

                    </div>

                    <div className={styles.forgetArea}>
                            Já sou cadastrado. <Link href={`/${data.tenent.slug}/login`}> <p style={{color: data.tenent.mainColor}} >Fazer Login</p></Link>
                    </div>

                    

                </div>

            </div>



        </div>



    );


}


export default SingUp;

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



