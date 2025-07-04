"use client"

import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Filter } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
export default function Drivers() {
    const [drivers, setDrivers] = useState<Driver[]>([])
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const [driver, setDriver] = useState<Driver | null>(null)

    useEffect(() => {
        const drivers = [
            {
                firstName: "John",
                surname: "Doe",
                identificationOrPassportNumber: "1234567890",
                identificationOrPassportDocument: "1234567890",
                emailAddress: "john.doe@example.com",
                cellNumber: "+27 123 456 789",
                driverLicenseDetails: {
                    saIssued: "YES",
                    workPermitUpload: "Permit-123.pdf",
                    licenceNumber: "DL123456789",
                    licenceExpiryDate: "2025-12-31",
                    licenceCode: "C1",
                    driverRestrictionCode: "A",
                    vehicleRestrictionCode: "B",
                    attachFrontOfDrives: "front-license.jpg",
                    attachRearOfDrives: "rear-license.jpg",
                    professionalDrivingPermit: "PDP-789",
                    professionalDrivingPermitExpiryDate: "2026-06-30"
                }
            },
            {
                firstName: "Jane",
                surname: "Smith",
                identificationOrPassportNumber: "0987654321",
                identificationOrPassportDocument: "0987654321",
                emailAddress: "jane.smith@example.com",
                cellNumber: "+27 987 654 321",
                driverLicenseDetails: {
                    saIssued: "YES",
                    workPermitUpload: "Permit-456.pdf",
                    licenceNumber: "DL987654321",
                    licenceExpiryDate: "2024-08-15",
                    licenceCode: "EB",
                    driverRestrictionCode: "A",
                    vehicleRestrictionCode: "C",
                    attachFrontOfDrives: "front-license-2.jpg",
                    attachRearOfDrives: "rear-license-2.jpg",
                    professionalDrivingPermit: "PDP-456",
                    professionalDrivingPermitExpiryDate: "2025-03-20"
                }
            }
        ]
        setDrivers(drivers as Driver[])
    }, [])

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        })
    }

    const getStatusBadge = (saIssued: string) => {
        return saIssued === "YES" ?
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">SA Issued</Badge> :
            <Badge variant="secondary">Foreign</Badge>
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Drivers</h1>
                    <p className="text-gray-600 mt-1">Manage your driver database and licenses</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Driver
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Drivers</p>
                                <p className="text-2xl font-bold text-gray-900">{drivers.length}</p>
                            </div>
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-blue-600 text-sm font-semibold">🚗</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">SA Licensed</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {drivers.filter(d => d.driverLicenseDetails.saIssued === "YES").length}
                                </p>
                            </div>
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <span className="text-green-600 text-sm font-semibold">✓</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Active PDP</p>
                                <p className="text-2xl font-bold text-purple-600">
                                    {drivers.filter(d => new Date(d.driverLicenseDetails.professionalDrivingPermitExpiryDate) > new Date()).length}
                                </p>
                            </div>
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                <span className="text-purple-600 text-sm font-semibold">🎫</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                                <p className="text-2xl font-bold text-orange-600">
                                    {drivers.filter(d => {
                                        const expiryDate = new Date(d.driverLicenseDetails.licenceExpiryDate)
                                        const thirtyDaysFromNow = new Date()
                                        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
                                        return expiryDate <= thirtyDaysFromNow && expiryDate > new Date()
                                    }).length}
                                </p>
                            </div>
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                <span className="text-orange-600 text-sm font-semibold">⚠</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search drivers..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <Button variant="outline" className="flex items-center gap-2">
                            <Filter className="w-4 h-4" />
                            Filter
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Drivers Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Driver Database</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Sheet>
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50">
                                        <TableHead className="font-semibold">Driver Name</TableHead>
                                        <TableHead className="font-semibold">Contact</TableHead>
                                        <TableHead className="font-semibold">License Status</TableHead>
                                        <TableHead className="font-semibold">License Details</TableHead>
                                        <TableHead className="font-semibold">PDP Status</TableHead>
                                        <TableHead className="font-semibold">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {drivers.map((driver, index) => (
                                        <TableRow key={index} className="hover:bg-gray-50 transition-colors">
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {driver.firstName} {driver.surname}
                                                    </p>
                                                    <p className="text-sm text-gray-500">ID: {driver.identificationOrPassportNumber}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="text-gray-900">{driver.emailAddress}</p>
                                                    <p className="text-sm text-gray-500">{driver.cellNumber}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    {getStatusBadge(driver.driverLicenseDetails.saIssued)}
                                                    <p className="text-sm text-gray-600">
                                                        {driver.driverLicenseDetails.licenceNumber}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <p className="text-sm text-gray-900">
                                                        Code: {driver.driverLicenseDetails.licenceCode}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Expires: {formatDate(driver.driverLicenseDetails.licenceExpiryDate)}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <p className="text-sm text-gray-900">
                                                        {driver.driverLicenseDetails.professionalDrivingPermit}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Expires: {formatDate(driver.driverLicenseDetails.professionalDrivingPermitExpiryDate)}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <SheetTrigger asChild>
                                                        <Button size="sm" variant="outline">View</Button>
                                                    </SheetTrigger>
                                                    <Button size="sm" variant="outline">Edit</Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Sheet>
                    </div>
                </CardContent>
            </Card>


            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Driver Details</SheetTitle>
                    </SheetHeader>
                    <div className="space-y-2">
                        <p>{driver?.firstName} {driver?.surname}</p>
                        <p>{driver?.emailAddress}</p>
                        <p>{driver?.cellNumber}</p>
                        <p>{driver?.driverLicenseDetails.licenceNumber}</p>
                        <p>{driver?.driverLicenseDetails.licenceExpiryDate}</p>
                        <p>{driver?.driverLicenseDetails.licenceCode}</p>
                        <p>{driver?.driverLicenseDetails.driverRestrictionCode}</p>
                        <p>{driver?.driverLicenseDetails.vehicleRestrictionCode}</p>
                        <p>{driver?.driverLicenseDetails.attachFrontOfDrives}</p>
                        <p>{driver?.driverLicenseDetails.attachRearOfDrives}</p>
                        <p>{driver?.driverLicenseDetails.professionalDrivingPermit}</p>
                        <p>{driver?.driverLicenseDetails.professionalDrivingPermitExpiryDate}</p>
                        <p>{driver?.driverLicenseDetails.saIssued}</p>
                        <p>{driver?.driverLicenseDetails.workPermitUpload}</p>
                    </div>
                    <Button onClick={() => setIsSheetOpen(false)}>Close</Button>
                </SheetContent>
            </Sheet>

        </div>
    )
}

type DriverLicenseDetails = {
    saIssued: string
    workPermitUpload: string
    licenceNumber: string
    licenceExpiryDate: string
    licenceCode: string
    driverRestrictionCode: string
    vehicleRestrictionCode: string
    attachFrontOfDrives: string
    attachRearOfDrives: string
    professionalDrivingPermit: string
    professionalDrivingPermitExpiryDate: string
}

type Driver = {
    firstName: string
    surname: string
    identificationOrPassportNumber: string
    identificationOrPassportDocument: string
    emailAddress: string
    cellNumber: string
    driverLicenseDetails: DriverLicenseDetails
}
