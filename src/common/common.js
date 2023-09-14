export const getToken = () => {
    const token = localStorage.getItem('jwt');
    return token;
}

export const makeOptions = (options) => {
    return options.map(o => ({value:o.id, label:o.title}))
}