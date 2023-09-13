export const getToken = () => {
    const token = localStorage.getItem('jwt');
    return token;
}