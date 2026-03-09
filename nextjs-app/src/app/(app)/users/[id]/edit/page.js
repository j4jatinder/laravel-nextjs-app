'use client'

import Header from '@/app/(app)/Header'
import { Button } from '@/components/ui/button'
import UserForm from '@/components/users/UserForm'
import { useAuth } from '@/hooks/auth'
import { getUser, updateUser } from '@/hooks/users'
import { useToast } from '@/providers/ToastProvider'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const initialForm = {
    name: '',
    email: '',
    password: '',
    role: 'manager',
}

const EditUserPage = () => {
    const { user } = useAuth({ middleware: 'auth' })
    const params = useParams()
    const router = useRouter()

    const [form, setForm] = useState(initialForm)
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const { toast } = useToast()

    const userId = params?.id

    useEffect(() => {
        const loadUser = async () => {
            if (!userId) {
                return
            }

            setIsLoading(true)

            try {
                const response = await getUser(userId)
                const payload = response?.data || response

                setForm({
                    name: payload.name || '',
                    email: payload.email || '',
                    password: '',
                    role: payload.roles?.[0] || 'manager',
                })
            } catch (error) {
                toast({
                    title: 'Unable to load user',
                    description: error?.response?.data?.message || 'Failed to load user.',
                    variant: 'error',
                })
            } finally {
                setIsLoading(false)
            }
        }

        if (user?.roles?.includes('admin')) {
            loadUser()
        }
    }, [userId, user])

    if (!user) {
        return null
    }

    if (!user?.roles?.includes('admin')) {
        router.push('/users')
        return null
    }

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async event => {
        event.preventDefault()
        setIsSubmitting(true)
        setErrors({})

        try {
            const payload = {
                name: form.name,
                email: form.email,
                role: form.role,
            }

            if (form.password) {
                payload.password = form.password
            }

            await updateUser(userId, payload)
            toast({
                title: 'User updated',
                description: 'User details updated successfully.',
                variant: 'success',
            })
            router.push('/users')
        } catch (error) {
            if (error?.response?.status === 422) {
                setErrors(error.response.data.errors || {})
            } else {
                toast({
                    title: 'Update failed',
                    description: error?.response?.data?.message || 'Failed to update user.',
                    variant: 'error',
                })
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <Header title="Edit User" />
            <div className="py-8">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-4">
                    <Link href="/users">
                        <Button variant="outline">Back to users</Button>
                    </Link>

                    {isLoading ? (
                        <div className="p-4 bg-white rounded-md border text-sm text-gray-600">Loading user...</div>
                    ) : (
                        <UserForm
                            mode="edit"
                            form={form}
                            errors={errors}
                            isSubmitting={isSubmitting}
                            onChange={handleChange}
                            onSubmit={handleSubmit}
                            onCancel={() => router.push('/users')}
                        />
                    )}
                </div>
            </div>
        </>
    )
}

export default EditUserPage
