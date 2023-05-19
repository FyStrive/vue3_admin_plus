export const SET_TOKEN = (token:string) => {
    return localStorage.setItem('token',token)
}

export const GET_TOKEN = () => {
    return localStorage.getItem('token')
}