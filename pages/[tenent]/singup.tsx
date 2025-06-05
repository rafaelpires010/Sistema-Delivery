import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { InputFild } from '../../components/InputFild';
import { useAppContext } from '../../contexts/app';
import { Api } from '../../libs/useApi';
import styles from '../../styles/SingUp.module.css';
import { Tenent } from '../../types/Tenent';
import axios, { AxiosError } from 'axios';
import { Footer } from '../../components/Footer';

const SingUp = (data: Props) => {
    const { tenent, setTenent } = useAppContext();

    useEffect(() => {
        setTenent(data.tenent);
    }, []);

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmSenha, setConfirmSenha] = useState('');
    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // Para exibir mensagens de erro
    const [successMessage, setSuccessMessage] = useState(''); // Para exibir mensagem de sucesso

    const router = useRouter();

    const handleSubmit = async () => {
        // Limpa mensagens anteriores
        setErrorMessage('');
        setSuccessMessage('');

        // Valida se os campos estão preenchidos
        if (!nome || !telefone || !email || !senha || !confirmSenha) {
            setErrorMessage('Todos os campos são obrigatórios.');
            return;
        }

        // Verifica se as senhas coincidem
        if (senha !== confirmSenha) {
            setErrorMessage('As senhas não coincidem.');
            return;
        }

        try {
            // Chama a função de signup passando os dados do usuário
            const api = Api(data.tenent.slug);
            const result = await api.signup(email, nome, senha, telefone);

            if (result.token) {
                // Exibe mensagem de sucesso
                setSuccessMessage('Cadastro realizado com sucesso!');
                setTimeout(() => {
                    router.push(`/${data.tenent.slug}/login`);
                }, 2000);
            } else if (result.error) {
                // Exibe a mensagem de erro retornada pela API
                setErrorMessage(result.error);
            } else {
                setErrorMessage('Ocorreu um erro ao realizar o cadastro. Tente novamente.');
            }
        } catch (error: unknown) {
            console.log("Erro completo:", error); // Verifique toda a estrutura do erro

            if (axios.isAxiosError(error)) {
                const serverError = error as AxiosError<{ error: Record<string, string[]> }>;

                if (serverError.response && serverError.response.data && serverError.response.data.error) {
                    // Extrai as mensagens de erro de validação do backend
                    const validationErrors = serverError.response.data.error;
                    const errorMessages = Object.values(validationErrors).flat().join('\n');
                    setErrorMessage(errorMessages);
                } else {
                    setErrorMessage('Erro de conexão. Verifique sua conexão e tente novamente.');
                }
            } else {
                setErrorMessage('Ocorreu um erro inesperado.');
            }
        }
    };


    return (
        <div className={styles.container}>
            <Head>
                <title>Cadastro | {data.tenent.nome}</title>
            </Head>

            <div className={styles.headerArea}>
                <div className={styles.headerContent}>
                    <Header
                        color={data.tenent.main_color}
                        backHref={`/${data.tenent.slug}`}
                        title="Cadastro"
                    />
                </div>
            </div>

            <div className={styles.signupArea}>
                <div className={styles.formArea}>
                    <div className={styles.formTitle}>
                        Criar sua conta
                    </div>

                    <div className={styles.inputArea}>
                        <div className={styles.inputLabel}>Nome completo</div>
                        <InputFild
                            color={data.tenent.main_color}
                            placeholder="Digite seu nome"
                            value={nome}
                            onChange={setNome}
                        />
                    </div>

                    <div className={styles.inputArea}>
                        <div className={styles.inputLabel}>Telefone</div>
                        <InputFild
                            color={data.tenent.main_color}
                            placeholder="(00) 00000-0000"
                            value={telefone}
                            onChange={setTelefone}
                        />
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
                            value={senha}
                            onChange={setSenha}
                            password
                        />
                    </div>

                    <div className={styles.inputArea}>
                        <div className={styles.inputLabel}>Confirmar senha</div>
                        <InputFild
                            color={data.tenent.main_color}
                            placeholder="Confirme sua senha"
                            value={confirmSenha}
                            onChange={setConfirmSenha}
                            password
                        />
                    </div>

                    <div className={styles.inputArea}>
                        <Button
                            color={data.tenent.main_color}
                            label="Criar conta"
                            onClick={handleSubmit}
                            fill
                        />
                    </div>

                    {errorMessage &&
                        <div className={styles.error}>{errorMessage}</div>
                    }
                    {successMessage &&
                        <div className={styles.success}>{successMessage}</div>
                    }

                    <div className={styles.loginArea}>
                        <div className={styles.loginText}>
                            Já tem uma conta?{' '}
                            <Link
                                href={`/${data.tenent.slug}/login`}
                                className={styles.loginLink}
                                style={{ color: data.tenent.main_color }}
                            >
                                Fazer login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default SingUp;

type Props = {
    tenent: Tenent;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { tenent: tenantSlug } = context.query;
    const api = Api(tenantSlug as string);

    // Get Tenant
    const tenent = await api.getTenant();

    if (!tenent) {
        return { redirect: { destination: '/', permanent: false } };
    }

    return {
        props: {
            tenent,
        },
    };
};
