export const SET_TOKEN = (token: string) => {
  return localStorage.setItem('token', token)
}

export const GET_TOKEN = () => {
  return localStorage.getItem('token')
}

export const REMOVE_TOKEN = () => {
  return localStorage.removeItem('token')
}