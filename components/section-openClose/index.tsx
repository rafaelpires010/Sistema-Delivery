import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import { Address } from "../../types/Address";
import { Tenent } from "../../types/Tenent";
import { Icon } from "../icons";
import { Button } from "../Button";
import { InputFild } from "../InputFild";
import { useRouter } from "next/navigation";
import { User } from "../../types/User";
import { Api } from "../../libs/useApi";
import { getNextOpeningOrClosing } from "../../libs/getNextOpenClose";
import { useAppContext } from "../../contexts/app";

type Props = {
    tenant: Tenent;
    closeTime: string;
    openTime?: string;
    nextOpenDate?: string;
    weeklySchedule?: { day: string; open: string; close: string }[];
    userLoggedIn?: User | null;
};

type Endereco = {
    logradouro: string
    localidade: string
    bairro: string
}



export const SectionOpenClose = ({
    tenant,
    userLoggedIn,
}: Props) => {
    const [cep, setCep] = useState("");
    const [isFreightExpanded, setIsFreightExpanded] = useState(false);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [userAddresses, setUserAddresses] = useState<Address[]>([]);
    const [freightPrice, setFreightPrice] = useState<string | null>(null);
    const [selectedAddress, setSelectedAddress] = useState<Endereco | null>(null);
    const { shippingPrice, setShippingPrice } = useAppContext();
    //const { shippingAddress, setShippingAddress } = useAppContext();


    const router = useRouter();
    const api = Api(tenant.slug);

    const horaFunc = getNextOpeningOrClosing(tenant.tenantFuncionamento)

    const formatTime = (time: string) => {
        return `${time.slice(0, 2)}:${time.slice(2)}h`;
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (userLoggedIn) {
            api.getUserAddresses(userLoggedIn.id).then((addresses) => {
                setUserAddresses(addresses);
            });
        }
    }, [userLoggedIn, api]);

    const handleNewAddress = () => {
        router.push(`${tenant.slug}/address/new`);
    };

    const handleSetFreight = async () => {
        const addressText = await api.getCepInfo(cep)
        const response = await api.getShippingPrice(tenant.id, cep);

        setFreightPrice(response);
        setSelectedAddress(addressText); // Armazena o endereço selecionado

        setShippingPrice(response)
        //setShippingAddress(addressText)

    };

    const handleSetFreightUser = async (cepp: string) => {
        const addressText = await api.getCepInfo(cepp)
        const response = await api.getShippingPrice(tenant.id, cepp);
        setFreightPrice(response);
        setSelectedAddress(addressText); // Armazena o endereço selecionado

        setShippingPrice(response)
        //setShippingAddress(addressText)
    };

    const toggleScheduleModal = () => {
        setIsScheduleModalOpen(!isScheduleModalOpen);
    };

    if (!mounted) return null;

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.header}>
                    <h1 className={styles.title}>{tenant.nome}</h1>
                    <p className={styles.location}>
                        <Icon icon="location" altura={0} largura={0} color="" />
                        {`${tenant.tenantInfo.rua}, ${tenant.tenantInfo.numero}, ${tenant.tenantInfo.cidade} - ${tenant.tenantInfo.estado}`}
                    </p>
                </div>

                <div className={styles.infoContainer}>
                    <div className={styles.topInfo}>
                        {/* Status e Horário */}
                        <div className={styles.infoSection}>
                            <div className={styles.areaStatus} onClick={toggleScheduleModal}>
                                <div className={styles.statusArea}>
                                    <div className={styles.statusHeader}>
                                        <span className={styles.statusTitle} style={{ color: tenant.OnClose ? "green" : "red" }}>
                                            {tenant.OnClose ? "Aberto agora" : "Fechado agora"}
                                        </span>
                                        <Icon
                                            icon={tenant.OnClose ? "storeOpen" : "storeClose"}
                                            color={tenant.OnClose ? "green" : "red"}
                                            largura={0}
                                            altura={0}
                                        />
                                    </div>
                                    <div className={styles.statusDetails}>
                                        {horaFunc}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Área de Entrega */}
                        <div className={styles.infoSection}>
                            <div className={styles.deliveryArea}>
                                <div className={styles.statusArea}>
                                    <div className={styles.statusHeader}>
                                        <span>Entrega</span>
                                        <Icon icon="moto" color="" largura={0} altura={0} />
                                    </div>
                                    {!freightPrice ? (
                                        <div className={styles.statusDetails}>
                                            Hoje,
                                            {tenant.tenantInfo.tempoMaxEntre ? `${tenant.tenantInfo.tempoMaxEntre} min` : "Tempo não especificado "} •
                                            {tenant.zone.fixedFee > 0 ? (
                                                ` Taxa mínima R$ ${tenant.zone.fixedFee.toFixed(2)}`
                                            ) : (
                                                <span style={{ color: "green" }}> Grátis</span>
                                            )}
                                        </div>
                                    ) : (
                                        <div>
                                            {freightPrice === "Sua região não é atendida pelo estabelecimento :("
                                                ? freightPrice
                                                : selectedAddress && freightPrice !== null
                                                    ? (
                                                        <div className={styles.entregaArea}>
                                                            <div className={styles.statusHeaderEntrega}>
                                                                <Icon icon={"location"} color={tenant.main_color} largura={0} altura={0} />
                                                                {`${selectedAddress.logradouro}, ${selectedAddress.bairro}`}
                                                            </div>
                                                            <div className={styles.statusDetails}>
                                                                Hoje, {tenant.tenantInfo.tempoMaxEntre} min • Entrega R$ {Number(freightPrice).toFixed(2).replace(".", ",")}
                                                            </div>
                                                        </div>
                                                    )
                                                    : "Calcule o frete para saber o valor"}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Campo de Cálculo de Frete */}
                    <div className={styles.freightArea}>
                        <div className={styles.freightInputArea}>
                            {userLoggedIn ? (
                                <div className={styles.addressArea}>
                                    {userAddresses.length > 0 ? (
                                        <>
                                            <p className={styles.titleAddress}>Selecione o endereço:</p>
                                            {userAddresses.map((address, index) => (
                                                <div
                                                    key={index}
                                                    className={styles.address}
                                                    onClick={() => handleSetFreightUser(address.cep)}
                                                >
                                                    <div className={styles.addressIcon}>
                                                        <Icon
                                                            color={tenant.main_color}
                                                            icon="location"
                                                            altura={24}
                                                            largura={24}
                                                        />
                                                    </div>
                                                    <div className={styles.addressText}>
                                                        {`${address.rua}, ${address.numero} - ${address.bairro}`}
                                                    </div>
                                                </div>
                                            ))}
                                        </>
                                    ) : (
                                        <Button
                                            color={tenant.main_color}
                                            fill
                                            label="Adicionar Endereço"
                                            onClick={handleNewAddress}
                                        />
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <div className={styles.calcArea}>
                                        <InputFild
                                            color={tenant.main_color}
                                            placeholder="Digite seu CEP"
                                            value={cep}
                                            onChange={setCep}
                                        />
                                        <Button
                                            color={tenant.main_color}
                                            fill
                                            label="Calcular"
                                            onClick={handleSetFreight}
                                        />
                                    </div>
                                    <div className={styles.loginPrompt}>
                                        Faça login para ver seus endereços cadastrados.
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Horário Semanal */}
            {isScheduleModalOpen && (
                <div className={styles.modalOverlay} onClick={toggleScheduleModal} role="dialog" aria-modal="true">
                    <div
                        className={styles.modal}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2>Horário de Funcionamento</h2>
                        <ul className={styles.scheduleList}>
                            {[
                                { day: "Segunda", open: tenant.tenantFuncionamento.segOpen.toString(), close: tenant.tenantFuncionamento.segClose.toString() },
                                { day: "Terça", open: tenant.tenantFuncionamento.terOpen.toString(), close: tenant.tenantFuncionamento.terClose.toString() },
                                { day: "Quarta", open: tenant.tenantFuncionamento.quarOpen.toString(), close: tenant.tenantFuncionamento.quarClose.toString() },
                                { day: "Quinta", open: tenant.tenantFuncionamento.quinOpen.toString(), close: tenant.tenantFuncionamento.quinClose.toString() },
                                { day: "Sexta", open: tenant.tenantFuncionamento.sexOpen.toString(), close: tenant.tenantFuncionamento.sexClose.toString() },
                                { day: "Sábado", open: tenant.tenantFuncionamento.sabOpen.toString(), close: tenant.tenantFuncionamento.sabClose.toString() },
                                { day: "Domingo", open: tenant.tenantFuncionamento.domOpen.toString(), close: tenant.tenantFuncionamento.domClose.toString() }
                            ].map((schedule, index) => (
                                <li key={index} className={styles.scheduleItem}>
                                    <span>{schedule.day}:</span>{" "}
                                    <div className={styles.hour}>
                                        {schedule.open === "close" && schedule.close === "close"
                                            ? "Fechado"
                                            : `${formatTime(schedule.open)} às ${formatTime(schedule.close)}`
                                        }
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <Button color={tenant.main_color} fill label={"Fechar"} onClick={toggleScheduleModal} />
                    </div>
                </div>
            )}
        </div>
    );
};
