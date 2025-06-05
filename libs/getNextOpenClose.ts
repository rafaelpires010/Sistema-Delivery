interface Schedule {
  day: string;
  open: string;
  close: string;
}

const formatTime = (time: string) => {
  return time === "close" ? "Fechado" : `${time.slice(0, 2)}:${time.slice(2)}h`;
};

// Função principal para obter o status de hoje e o próximo horário de operação
export const getNextOpeningOrClosing = (tenantFuncionamento: {
  segOpen: string;
  segClose: string;
  terOpen: string;
  terClose: string;
  quarOpen: string;
  quarClose: string;
  quinOpen: string;
  quinClose: string;
  sexOpen: string;
  sexClose: string;
  sabOpen: string;
  sabClose: string;
  domOpen: string;
  domClose: string;
}) => {
  const daysOfWeek = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];
  const now = new Date();
  const todayIndex = now.getDay();
  const currentTime = `${now.getHours().toString().padStart(2, "0")}${now
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  const scheduleMapping: Schedule[] = [
    {
      day: "Domingo",
      open: tenantFuncionamento.domOpen,
      close: tenantFuncionamento.domClose,
    },
    {
      day: "Segunda",
      open: tenantFuncionamento.segOpen,
      close: tenantFuncionamento.segClose,
    },
    {
      day: "Terça",
      open: tenantFuncionamento.terOpen,
      close: tenantFuncionamento.terClose,
    },
    {
      day: "Quarta",
      open: tenantFuncionamento.quarOpen,
      close: tenantFuncionamento.quarClose,
    },
    {
      day: "Quinta",
      open: tenantFuncionamento.quinOpen,
      close: tenantFuncionamento.quinClose,
    },
    {
      day: "Sexta",
      open: tenantFuncionamento.sexOpen,
      close: tenantFuncionamento.sexClose,
    },
    {
      day: "Sábado",
      open: tenantFuncionamento.sabOpen,
      close: tenantFuncionamento.sabClose,
    },
  ];

  const todaySchedule = scheduleMapping[todayIndex];

  // Caso 1: Se o restaurante está fechado o dia todo hoje
  if (todaySchedule.open === "close" && todaySchedule.close === "close") {
    // Encontrar o próximo dia em que estará aberto
    for (let i = 1; i <= 7; i++) {
      const nextIndex = (todayIndex + i) % 7;
      const nextSchedule = scheduleMapping[nextIndex];
      if (nextSchedule.open !== "close") {
        return `Abre ${daysOfWeek[nextIndex]} às ${formatTime(
          nextSchedule.open
        )}.`;
      }
    }
  }

  // Caso 2: Se o restaurante ainda não abriu hoje
  if (currentTime < todaySchedule.open) {
    return `Abre às ${formatTime(todaySchedule.open)}.`;
  }

  // Caso 3: Se o restaurante está aberto agora
  if (currentTime >= todaySchedule.open && currentTime < todaySchedule.close) {
    return `Fechará às ${formatTime(todaySchedule.close)}.`;
  }

  // Caso 4: Se o restaurante já fechou hoje
  return `Já fechou para o dia. Próxima abertura será amanhã às ${formatTime(
    scheduleMapping[(todayIndex + 1) % 7].open
  )}.`;
};
