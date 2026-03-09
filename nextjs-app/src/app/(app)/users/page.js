'use client'

import Header from '@/app/(app)/Header'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useAuth } from '@/hooks/auth'
import { deleteUser, listUsers } from '@/hooks/users'
import { useToast } from '@/providers/ToastProvider'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const UsersPage = () => {
    const { user } = useAuth({ middleware: 'auth' })

    const [loading, setLoading] = useState(false)
    const [users, setUsers] = useState([])
    const [search, setSearch] = useState('')
    const [roleFilter, setRoleFilter] = useState('')
    const [meta, setMeta] = useState(null)
    const [page, setPage] = useState(1)
    const [deleteDialog, setDeleteDialog] = useState({ open: false, userId: null })
    const [isDeleting, setIsDeleting] = useState(false)
    const { toast } = useToast()

    if (!user) {
        return null
    }

    const isAdmin = user?.roles?.includes('admin')

    const fetchUsers = async requestedPage => {
        setLoading(true)

        try {
            const response = await listUsers({
                page: requestedPage,
                per_page: 10,
                search: search || undefined,
                role: roleFilter || undefined,
            })

            setUsers(response.data || [])
            setMeta(response.meta || null)
            setPage(requestedPage)
        } catch (error) {
            toast({
                title: 'Unable to load users',
                description: error?.response?.data?.message || 'Failed to load users.',
                variant: 'error',
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (isAdmin) {
            fetchUsers(1)
        }
    }, [isAdmin])

    const openDeleteDialog = userId => {
        setDeleteDialog({ open: true, userId })
    }

    const closeDeleteDialog = () => {
        if (isDeleting) {
            return
        }

        setDeleteDialog({ open: false, userId: null })
    }

    const confirmDelete = async () => {
        if (!deleteDialog.userId) {
            return
        }

        setIsDeleting(true)

        try {
            await deleteUser(deleteDialog.userId)
            toast({
                title: 'User deleted',
                description: 'User has been deleted successfully.',
                variant: 'success',
            })

            setDeleteDialog({ open: false, userId: null })
            await fetchUsers(page)
        } catch (error) {
            toast({
                title: 'Delete failed',
                description: error?.response?.data?.message || 'Failed to delete user.',
                variant: 'error',
            })
        } finally {
            setIsDeleting(false)
        }
    }

    if (!isAdmin) {
        return (
            <>
                <Header title="Users" />
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <Card>
                            <CardContent className="p-6">You are not authorized to access this page.</CardContent>
                        </Card>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <Header title="User Management" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <Card>
                        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                            <div>
                                <CardTitle>Users</CardTitle>
                                <CardDescription>Manage users and roles.</CardDescription>
                            </div>
                            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
                                <Input
                                    placeholder="Search name or email"
                                    className="w-full sm:w-64"
                                    value={search}
                                    onChange={event => setSearch(event.target.value)}
                                />
                                <Select value={roleFilter} onChange={event => setRoleFilter(event.target.value)}>
                                    <option value="">All roles</option>
                                    <option value="admin">Admin</option>
                                    <option value="manager">Manager</option>
                                </Select>
                                <Button onClick={() => fetchUsers(1)}>Apply</Button>
                                <Link href="/users/create">
                                    <Button>Create User</Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-gray-500">
                                                Loading users...
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {!loading && users.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-gray-500">
                                                No users found.
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {!loading &&
                                        users.map(entry => (
                                            <TableRow key={entry.id}>
                                                <TableCell className="font-medium">{entry.name}</TableCell>
                                                <TableCell>{entry.email}</TableCell>
                                                <TableCell>
                                                    <Badge>{entry.roles?.[0] || '-'}</Badge>
                                                </TableCell>
                                                <TableCell className="text-right space-x-2">
                                                    <Link href={`/users/${entry.id}/edit`}>
                                                        <Button variant="outline" size="sm">
                                                            Edit
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => openDeleteDialog(entry.id)}>
                                                        Delete
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>

                            {meta && meta.last_page > 1 && (
                                <div className="mt-4 flex items-center justify-between">
                                    <p className="text-sm text-gray-600">
                                        Page {meta.current_page} of {meta.last_page}
                                    </p>
                                    <div className="space-x-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            disabled={meta.current_page <= 1}
                                            onClick={() => fetchUsers(meta.current_page - 1)}>
                                            Prev
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            disabled={meta.current_page >= meta.last_page}
                                            onClick={() => fetchUsers(meta.current_page + 1)}>
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <AlertDialog
                open={deleteDialog.open}
                title="Delete user"
                description="This action cannot be undone. Are you sure you want to delete this user?"
                confirmLabel="Delete"
                confirmVariant="destructive"
                isConfirming={isDeleting}
                onConfirm={confirmDelete}
                onCancel={closeDeleteDialog}
            />
        </>
    )
}

export default UsersPage
