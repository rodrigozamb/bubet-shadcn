import { AxiosError } from 'axios'
import { api } from './api'

type SigInRequestData = {
    email: string
    password: string
}

type CreateUserRequestData = {
    email: string
    password: string
    name: string
}

type User = {
    name: string
    email: string
}

export async function signInRequest({ email, password }: SigInRequestData) {
    try {
      const response = await api.post(
        '/login',
        { email, password },
        { withCredentials: true },
      )

      return response.data.token
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error retrieving data:', error.response?.data.message)
        throw new Error(error.response?.data.message)
      }
      throw new Error('Could not get data : ' + error)
    }
}

export async function recoverUserInformation() {
    try {
      const response = await api.get('/users/profile')
      const user: User = response.data.user
      return user
    } catch (error) {
      console.error('Error retrieving data:', error)
      throw new Error('Could not get data')
    }
}

export async function createNewUser({
    email,
    password,
    name,
}: CreateUserRequestData) {
    try {
      const response = await api.post('/users', {
        email,
        password,
        name,
        username: name,
      })

      return response.data
    } catch (error) {
      console.error('Error retrieving data:', error)
      throw new Error('Could not get data : ' + error)
    }
}
