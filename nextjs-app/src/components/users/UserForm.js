'use client'

import InputError from '@/components/InputError'
import Label from '@/components/Label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'

export default function UserForm({
    mode,
    form,
    errors,
    isSubmitting,
    onChange,
    onSubmit,
    onCancel,
}) {
    const isCreate = mode === 'create'

    return (
        <Card>
            <CardHeader>
                <CardTitle>{isCreate ? 'Create User' : 'Edit User'}</CardTitle>
                <CardDescription>
                    {isCreate
                        ? 'Add a new user and assign a role.'
                        : 'Update user details, role, and optionally password.'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            className="mt-1"
                            value={form.name}
                            onChange={event => onChange('name', event.target.value)}
                            required
                        />
                        <InputError messages={errors.name || []} className="mt-1" />
                    </div>

                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            className="mt-1"
                            value={form.email}
                            onChange={event => onChange('email', event.target.value)}
                            required
                        />
                        <InputError messages={errors.email || []} className="mt-1" />
                    </div>

                    <div>
                        <Label htmlFor="password">
                            {isCreate ? 'Password' : 'New Password (optional)'}
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            className="mt-1"
                            value={form.password}
                            onChange={event => onChange('password', event.target.value)}
                            required={isCreate}
                        />
                        <InputError messages={errors.password || []} className="mt-1" />
                    </div>

                    <div>
                        <Label htmlFor="role">Role</Label>
                        <Select
                            id="role"
                            className="mt-1"
                            value={form.role}
                            onChange={event => onChange('role', event.target.value)}>
                            <option value="admin">Admin</option>
                            <option value="manager">Manager</option>
                        </Select>
                        <InputError messages={errors.role || []} className="mt-1" />
                    </div>

                    <div className="md:col-span-2 flex gap-2">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting
                                ? isCreate
                                    ? 'Creating...'
                                    : 'Saving...'
                                : isCreate
                                  ? 'Create User'
                                  : 'Save Changes'}
                        </Button>
                        {onCancel && (
                            <Button type="button" variant="outline" onClick={onCancel}>
                                Cancel
                            </Button>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
