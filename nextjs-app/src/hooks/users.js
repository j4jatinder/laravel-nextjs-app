'use client'

import axios from '@/lib/axios'

export const listUsers = async params => {
    const response = await axios.get('/api/users', { params })

    return response.data
}

export const createUser = async payload => {
    const response = await axios.post('/api/users', payload)

    return response.data
}

export const getUser = async userId => {
    const response = await axios.get(`/api/users/${userId}`)

    return response.data
}

export const updateUser = async (userId, payload) => {
    const response = await axios.put(`/api/users/${userId}`, payload)

    return response.data
}

export const deleteUser = async userId => {
    const response = await axios.delete(`/api/users/${userId}`)

    return response.data
}
