export const getToken = () => {
    const token = localStorage.getItem('jwt');
    return token;
}

export const makeOptions = (options) => {
    return options.map(o => ({value:o.id, label:o.title}))
}

export const stringToBoolean = (value) => {
    switch(value.toString().toLowerCase()) {
        case "false": 
        case "no": 
        case "0": 
        case "": 
            return false; 
        default: 
            return true;
    }
}