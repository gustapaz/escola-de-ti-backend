export const removePhoneMask = (phone: string) => {
    return phone.replace(/\D/g, '');
}

export const removeCpfMask = (cpf: string) => {
    return cpf.replace(/[^0-9]/g, '')
}

export const removeCnpjMask = (cnpj: string) => {
    return cnpj.replace(/[^0-9]/g, '')
}