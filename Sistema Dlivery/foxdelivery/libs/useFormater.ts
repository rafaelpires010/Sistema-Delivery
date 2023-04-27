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
    } 
})