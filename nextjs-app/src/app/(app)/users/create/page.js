'use client'

import Header from '@/app/(app)/Header'
import { Button } from '@/components/ui/button'
import UserForm from '@/components/users/UserForm'
import { useAuth } from '@/hooks/auth'
import { createUser } from '@/hooks/users'
import { useToast } from '@/providers/ToastProvider'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const initialForm = {
    name: '',
    email: '',
    password: '',
    role: 'manager',
}

const CreateUserPage = () => {
    const { user } = useAuth({ middleware: 'auth' })
    const router = useRouter()

    const [form, setForm] = useState(initialForm)
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()

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
            await createUser(form)
            toast({
                title: 'User created',
                description: 'New user has been created successfully.',
                variant: 'success',
            })
            router.push('/users')
        } catch (error) {
            if (error?.response?.status === 422) {
                setErrors(error.response.data.errors || {})
            } else {
                toast({
                    title: 'Create failed',
                    description: error?.response?.data?.message || 'Failed to create user.',
                    variant: 'error',
                })
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <Header title="Create User" />
            <div className="py-8">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-4">
                    <Link href="/users">
                        <Button variant="outline">Back to users</Button>
                    </Link>

                    <UserForm
                        mode="create"
                        form={form}
                        errors={errors}
                        isSubmitting={isSubmitting}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                        onCancel={() => router.push('/users')}
                    />
                </div>
            </div>
        </>
    )
}

export default CreateUserPage
