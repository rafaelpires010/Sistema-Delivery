export const useFormater = () => ({
    fomatePrice: (preco: number) => {
        return preco.toLocaleString('pt-br', {
            minimumFractionDigits: 2,
            style: 'currency',
            currency: 'BRL'
        })
    },

    formatQuantidade: (qt: number, minDigitos: number) => {
        if(qt.toString().length >= minDigitos) return qt.toString();
        
        const remain = minDigitos - qt.toString().length;

        return `${'0'.repeat(remain)}${qt}`
    },
    formatDate: (date: string | Date) => {
        try {
            // Verificar se a data é válida
            const parsedDate = new Date(date);
            if (isNaN(parsedDate.getTime())) {
                throw new Error('Data inválida');
            }
    
            // Formatar a data para 'pt-BR'
            return new Intl.DateTimeFormat('pt-BR').format(parsedDate);
        } catch (error) {
            console.error('Erro ao formatar a data:', error);
            return 'Data inválida'; // Ou uma string padrão que você prefira
        }
    }
})