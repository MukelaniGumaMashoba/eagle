"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building, Plus, Phone, Mail, Star, Users, Truck, Edit, Eye } from "lucide-react"
import { toast } from "sonner"

interface ExternalClient {
    id: string
    companyName: string
    contactPerson: string
    phone: string
    email: string
    address: string
    clientType: "corporate" | "individual" | "government"
    contractType: "one-time" | "monthly" | "annual"
    rating: number
    totalJobs: number
    totalRevenue: number
    status: "active" | "inactive" | "pending"
    joinDate: string
    lastServiceDate?: string
    preferredServices: string[]
    paymentTerms: string
    creditLimit: number
}

interface Subcontractor {
    id: string
    companyName: string
    contactPerson: string
    phone: string
    email: string
    location: string
    services: string[]
    rating: number
    completedJobs: number
    status: "active" | "inactive" | "pending"
    hourlyRate: number
    availability: "available" | "busy" | "unavailable"
    certifications: string[]
    coverageAreas: string[]
    joinDate: string
}

interface TowingCompany {
    id: string
    companyName: string
    contactPerson: string
    phone: string
    emergencyPhone: string
    email: string
    location: string
    fleetSize: number
    vehicleTypes: string[]
    coverageRadius: number
    rating: number
    responseTime: string
    status: "active" | "inactive"
    pricing: {
        baseRate: number
        perKmRate: number
        heavyVehicleSurcharge: number
    }
    availability24h: boolean
}

export default function ExternalClientsPage() {
    const [externalClients, setExternalClients] = useState<ExternalClient[]>([])
    const [subcontractors, setSubcontractors] = useState<Subcontractor[]>([])
    const [towingCompanies, setTowingCompanies] = useState<TowingCompany[]>([])
    const [isAddClientOpen, setIsAddClientOpen] = useState(false)
    const [isAddSubcontractorOpen, setIsAddSubcontractorOpen] = useState(false)
    const [isAddTowingOpen, setIsAddTowingOpen] = useState(false)
    const [selectedClient, setSelectedClient] = useState<ExternalClient | null>(null)
    const [isViewClientOpen, setIsViewClientOpen] = useState(false)

    useEffect(() => {
        // Mock data for external clients
        setExternalClients([
            {
                id: "1",
                companyName: "Independent Trucking Co",
                contactPerson: "Michael Johnson",
                phone: "+27 12 555 0123",
                email: "dispatch@independenttrucking.co.za",
                address: "123 Industrial Road, Pretoria",
                clientType: "corporate",
                contractType: "monthly",
                rating: 4.5,
                totalJobs: 45,
                totalRevenue: 125000,
                status: "active",
                joinDate: "2023-06-15",
                lastServiceDate: "2024-01-10",
                preferredServices: ["Emergency Breakdown", "Preventive Maintenance", "Towing"],
                paymentTerms: "30 days",
                creditLimit: 50000,
            },
            {
                id: "2",
                companyName: "City Delivery Services",
                contactPerson: "Sarah Williams",
                phone: "+27 21 444 5678",
                email: "fleet@citydelivery.co.za",
                address: "456 Commerce Street, Cape Town",
                clientType: "corporate",
                contractType: "annual",
                rating: 4.8,
                totalJobs: 78,
                totalRevenue: 230000,
                status: "active",
                joinDate: "2022-11-20",
                lastServiceDate: "2024-01-12",
                preferredServices: ["Emergency Breakdown", "Fleet Maintenance"],
                paymentTerms: "15 days",
                creditLimit: 100000,
            },
            {
                id: "3",
                companyName: "Provincial Transport Dept",
                contactPerson: "David Mthembu",
                phone: "+27 11 789 0123",
                email: "fleet.manager@transport.gov.za",
                address: "Government Complex, Johannesburg",
                clientType: "government",
                contractType: "annual",
                rating: 4.2,
                totalJobs: 156,
                totalRevenue: 450000,
                status: "active",
                joinDate: "2021-03-10",
                lastServiceDate: "2024-01-08",
                preferredServices: ["Emergency Breakdown", "Scheduled Maintenance", "Inspections"],
                paymentTerms: "60 days",
                creditLimit: 200000,
            },
        ])

        setSubcontractors([
            {
                id: "1",
                companyName: "Elite Auto Repair",
                contactPerson: "James Smith",
                phone: "+27 84 123 4567",
                email: "james@eliteauto.co.za",
                location: "Sandton",
                services: ["Engine Repair", "Transmission", "Electrical"],
                rating: 4.7,
                completedJobs: 89,
                status: "active",
                hourlyRate: 450,
                availability: "available",
                certifications: ["ASE Certified", "Mercedes Specialist"],
                coverageAreas: ["Johannesburg", "Sandton", "Randburg"],
                joinDate: "2023-02-15",
            },
            {
                id: "2",
                companyName: "Heavy Duty Solutions",
                contactPerson: "Lisa Davis",
                phone: "+27 82 987 6543",
                email: "lisa@heavyduty.co.za",
                location: "Pretoria",
                services: ["Heavy Vehicle Repair", "Hydraulics", "Towing"],
                rating: 4.9,
                completedJobs: 134,
                status: "active",
                hourlyRate: 520,
                availability: "busy",
                certifications: ["Heavy Vehicle License", "Crane Operator"],
                coverageAreas: ["Pretoria", "Centurion", "Midrand"],
                joinDate: "2022-08-20",
            },
        ])

        setTowingCompanies([
            {
                id: "1",
                companyName: "24/7 Recovery Services",
                contactPerson: "Robert Johnson",
                phone: "+27 11 555 7777",
                emergencyPhone: "+27 82 911 0000",
                email: "dispatch@247recovery.co.za",
                location: "Johannesburg",
                fleetSize: 12,
                vehicleTypes: ["Light Vehicle Tow", "Heavy Duty Tow", "Flatbed", "Recovery Truck"],
                coverageRadius: 50,
                rating: 4.6,
                responseTime: "15-30 minutes",
                status: "active",
                pricing: {
                    baseRate: 350,
                    perKmRate: 15,
                    heavyVehicleSurcharge: 200,
                },
                availability24h: true,
            },
            {
                id: "2",
                companyName: "Metro Towing",
                contactPerson: "Patricia Williams",
                phone: "+27 21 333 8888",
                emergencyPhone: "+27 83 911 1111",
                email: "ops@metrotowing.co.za",
                location: "Cape Town",
                fleetSize: 8,
                vehicleTypes: ["Light Vehicle Tow", "Medium Duty Tow", "Flatbed"],
                coverageRadius: 35,
                rating: 4.3,
                responseTime: "20-40 minutes",
                status: "active",
                pricing: {
                    baseRate: 320,
                    perKmRate: 12,
                    heavyVehicleSurcharge: 150,
                },
                availability24h: true,
            },
        ])
    }, [])

    const handleAddClient = (e: React.FormEvent) => {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)

        const newClient: ExternalClient = {
            id: Date.now().toString(),
            companyName: formData.get("companyName") as string,
            contactPerson: formData.get("contactPerson") as string,
            phone: formData.get("phone") as string,
            email: formData.get("email") as string,
            address: formData.get("address") as string,
            clientType: formData.get("clientType") as any,
            contractType: formData.get("contractType") as any,
            rating: 0,
            totalJobs: 0,
            totalRevenue: 0,
            status: "pending",
            joinDate: new Date().toISOString().split("T")[0],
            preferredServices: (formData.get("preferredServices") as string).split(",").map((s) => s.trim()),
            paymentTerms: formData.get("paymentTerms") as string,
            creditLimit: Number.parseFloat(formData.get("creditLimit") as string) || 0,
        }

        setExternalClients((prev) => [...prev, newClient])
        setIsAddClientOpen(false)
        toast.success(`${newClient.companyName} has been added as an external client.`)
    }

    const handleAddSubcontractor = (e: React.FormEvent) => {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)

        const newSubcontractor: Subcontractor = {
            id: Date.now().toString(),
            companyName: formData.get("companyName") as string,
            contactPerson: formData.get("contactPerson") as string,
            phone: formData.get("phone") as string,
            email: formData.get("email") as string,
            location: formData.get("location") as string,
            services: (formData.get("services") as string).split(",").map((s) => s.trim()),
            rating: 0,
            completedJobs: 0,
            status: "pending",
            hourlyRate: Number.parseFloat(formData.get("hourlyRate") as string) || 0,
            availability: "available",
            certifications: (formData.get("certifications") as string).split(",").map((c) => c.trim()),
            coverageAreas: (formData.get("coverageAreas") as string).split(",").map((a) => a.trim()),
            joinDate: new Date().toISOString().split("T")[0],
        }

        setSubcontractors((prev) => [...prev, newSubcontractor])
        setIsAddSubcontractorOpen(false)
        toast.success(`${newSubcontractor.companyName} has been added as a subcontractor.`)
    }

    const handleAddTowingCompany = (e: React.FormEvent) => {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)

        const newTowingCompany: TowingCompany = {
            id: Date.now().toString(),
            companyName: formData.get("companyName") as string,
            contactPerson: formData.get("contactPerson") as string,
            phone: formData.get("phone") as string,
            emergencyPhone: formData.get("emergencyPhone") as string,
            email: formData.get("email") as string,
            location: formData.get("location") as string,
            fleetSize: Number.parseInt(formData.get("fleetSize") as string) || 0,
            vehicleTypes: (formData.get("vehicleTypes") as string).split(",").map((v) => v.trim()),
            coverageRadius: Number.parseInt(formData.get("coverageRadius") as string) || 0,
            rating: 0,
            responseTime: formData.get("responseTime") as string,
            status: "active",
            pricing: {
                baseRate: Number.parseFloat(formData.get("baseRate") as string) || 0,
                perKmRate: Number.parseFloat(formData.get("perKmRate") as string) || 0,
                heavyVehicleSurcharge: Number.parseFloat(formData.get("heavyVehicleSurcharge") as string) || 0,
            },
            availability24h: formData.get("availability24h") === "on",
        }

        setTowingCompanies((prev) => [...prev, newTowingCompany])
        setIsAddTowingOpen(false)
        toast.success(`${newTowingCompany.companyName} has been added to the towing network.`)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
                return "bg-green-100 text-green-800"
            case "inactive":
                return "bg-red-100 text-red-800"
            case "pending":
                return "bg-yellow-100 text-yellow-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const getAvailabilityColor = (availability: string) => {
        switch (availability) {
            case "available":
                return "bg-green-100 text-green-800"
            case "busy":
                return "bg-orange-100 text-orange-800"
            case "unavailable":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    return (
        <>
            <div className="flex-1 space-y-4 p-4 pt-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold tracking-tight">External Network Management</h2>
                </div>

                <Tabs defaultValue="clients" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="clients">External Clients ({externalClients.length})</TabsTrigger>
                        <TabsTrigger value="subcontractors">Subcontractors ({subcontractors.length})</TabsTrigger>
                        <TabsTrigger value="towing">Towing Companies ({towingCompanies.length})</TabsTrigger>
                        <TabsTrigger value="analytics">Network Analytics</TabsTrigger>
                    </TabsList>

                    <TabsContent value="clients" className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">External Client Management</h3>
                            <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
                                <DialogTrigger asChild>
                                    <Button>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Client
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle>Add External Client</DialogTitle>
                                        <DialogDescription>Register a new external client for breakdown services.</DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleAddClient} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="companyName">Company Name</Label>
                                                <Input id="companyName" name="companyName" required />
                                            </div>
                                            <div>
                                                <Label htmlFor="contactPerson">Contact Person</Label>
                                                <Input id="contactPerson" name="contactPerson" required />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="phone">Phone Number</Label>
                                                <Input id="phone" name="phone" type="tel" required />
                                            </div>
                                            <div>
                                                <Label htmlFor="email">Email Address</Label>
                                                <Input id="email" name="email" type="email" required />
                                            </div>
                                        </div>
                                        <div>
                                            <Label htmlFor="address">Address</Label>
                                            <Textarea id="address" name="address" required />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="clientType">Client Type</Label>
                                                <Select name="clientType" required>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select client type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="corporate">Corporate</SelectItem>
                                                        <SelectItem value="individual">Individual</SelectItem>
                                                        <SelectItem value="government">Government</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label htmlFor="contractType">Contract Type</Label>
                                                <Select name="contractType" required>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select contract type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="one-time">One-time</SelectItem>
                                                        <SelectItem value="monthly">Monthly</SelectItem>
                                                        <SelectItem value="annual">Annual</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div>
                                            <Label htmlFor="preferredServices">Preferred Services (comma-separated)</Label>
                                            <Input
                                                id="preferredServices"
                                                name="preferredServices"
                                                placeholder="Emergency Breakdown, Preventive Maintenance"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="paymentTerms">Payment Terms</Label>
                                                <Input id="paymentTerms" name="paymentTerms" placeholder="30 days" />
                                            </div>
                                            <div>
                                                <Label htmlFor="creditLimit">Credit Limit (R)</Label>
                                                <Input id="creditLimit" name="creditLimit" type="number" />
                                            </div>
                                        </div>
                                        <Button type="submit" className="w-full">
                                            Add Client
                                        </Button>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="grid gap-4">
                            {externalClients.map((client) => (
                                <Card key={client.id} className="hover:shadow-md transition-shadow">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-2">
                                                    <Building className="h-5 w-5 text-blue-500" />
                                                    <CardTitle className="text-lg">{client.companyName}</CardTitle>
                                                </div>
                                                <Badge className={getStatusColor(client.status)}>{client.status.toUpperCase()}</Badge>
                                                <Badge variant="outline">{client.clientType.toUpperCase()}</Badge>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                                <span className="text-sm font-semibold">{client.rating}</span>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                                            <div>
                                                <h4 className="font-semibold mb-2">Contact Information</h4>
                                                <div className="space-y-1 text-sm">
                                                    <p>
                                                        <strong>Contact:</strong> {client.contactPerson}
                                                    </p>
                                                    <p>
                                                        <strong>Phone:</strong> {client.phone}
                                                    </p>
                                                    <p>
                                                        <strong>Email:</strong> {client.email}
                                                    </p>
                                                    <p>
                                                        <strong>Address:</strong> {client.address}
                                                    </p>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold mb-2">Contract Details</h4>
                                                <div className="space-y-1 text-sm">
                                                    <p>
                                                        <strong>Type:</strong> {client.contractType}
                                                    </p>
                                                    <p>
                                                        <strong>Payment:</strong> {client.paymentTerms}
                                                    </p>
                                                    <p>
                                                        <strong>Credit Limit:</strong> R {client.creditLimit.toLocaleString()}
                                                    </p>
                                                    <p>
                                                        <strong>Joined:</strong> {client.joinDate}
                                                    </p>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold mb-2">Service History</h4>
                                                <div className="space-y-1 text-sm">
                                                    <p>
                                                        <strong>Total Jobs:</strong> {client.totalJobs}
                                                    </p>
                                                    <p>
                                                        <strong>Revenue:</strong> R {client.totalRevenue.toLocaleString()}
                                                    </p>
                                                    {client.lastServiceDate && (
                                                        <p>
                                                            <strong>Last Service:</strong> {client.lastServiceDate}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold mb-2">Preferred Services</h4>
                                                <div className="flex flex-wrap gap-1">
                                                    {client.preferredServices.map((service) => (
                                                        <Badge key={service} variant="secondary" className="text-xs">
                                                            {service}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-2 mt-4">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedClient(client)
                                                    setIsViewClientOpen(true)
                                                }}
                                            >
                                                <Eye className="h-4 w-4 mr-2" />
                                                View Details
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                <Phone className="h-4 w-4 mr-2" />
                                                Call
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                <Mail className="h-4 w-4 mr-2" />
                                                Email
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                <Edit className="h-4 w-4 mr-2" />
                                                Edit
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="subcontractors" className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Subcontractor Network</h3>
                            <Dialog open={isAddSubcontractorOpen} onOpenChange={setIsAddSubcontractorOpen}>
                                <DialogTrigger asChild>
                                    <Button>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Subcontractor
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle>Add Subcontractor</DialogTitle>
                                        <DialogDescription>Register a new subcontractor for specialized services.</DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleAddSubcontractor} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="companyName">Company Name</Label>
                                                <Input id="companyName" name="companyName" required />
                                            </div>
                                            <div>
                                                <Label htmlFor="contactPerson">Contact Person</Label>
                                                <Input id="contactPerson" name="contactPerson" required />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="phone">Phone Number</Label>
                                                <Input id="phone" name="phone" type="tel" required />
                                            </div>
                                            <div>
                                                <Label htmlFor="email">Email Address</Label>
                                                <Input id="email" name="email" type="email" required />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="location">Location</Label>
                                                <Input id="location" name="location" required />
                                            </div>
                                            <div>
                                                <Label htmlFor="hourlyRate">Hourly Rate (R)</Label>
                                                <Input id="hourlyRate" name="hourlyRate" type="number" required />
                                            </div>
                                        </div>
                                        <div>
                                            <Label htmlFor="services">Services Offered (comma-separated)</Label>
                                            <Input
                                                id="services"
                                                name="services"
                                                placeholder="Engine Repair, Transmission, Electrical"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="certifications">Certifications (comma-separated)</Label>
                                            <Input
                                                id="certifications"
                                                name="certifications"
                                                placeholder="ASE Certified, Mercedes Specialist"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="coverageAreas">Coverage Areas (comma-separated)</Label>
                                            <Input
                                                id="coverageAreas"
                                                name="coverageAreas"
                                                placeholder="Johannesburg, Sandton, Randburg"
                                                required
                                            />
                                        </div>
                                        <Button type="submit" className="w-full">
                                            Add Subcontractor
                                        </Button>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            {subcontractors.map((subcontractor) => (
                                <Card key={subcontractor.id} className="hover:shadow-md transition-shadow">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-5 w-5 text-purple-500" />
                                                    <CardTitle className="text-lg">{subcontractor.companyName}</CardTitle>
                                                </div>
                                                <Badge className={getStatusColor(subcontractor.status)}>
                                                    {subcontractor.status.toUpperCase()}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                                <span className="text-sm font-semibold">{subcontractor.rating}</span>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p>
                                                        <strong>Contact:</strong> {subcontractor.contactPerson}
                                                    </p>
                                                    <p>
                                                        <strong>Phone:</strong> {subcontractor.phone}
                                                    </p>
                                                    <p>
                                                        <strong>Location:</strong> {subcontractor.location}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p>
                                                        <strong>Rate:</strong> R {subcontractor.hourlyRate}/hour
                                                    </p>
                                                    <p>
                                                        <strong>Jobs:</strong> {subcontractor.completedJobs}
                                                    </p>
                                                    <Badge className={getAvailabilityColor(subcontractor.availability)}>
                                                        {subcontractor.availability.toUpperCase()}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold text-sm mb-2">Services:</h4>
                                                <div className="flex flex-wrap gap-1">
                                                    {subcontractor.services.map((service) => (
                                                        <Badge key={service} variant="secondary" className="text-xs">
                                                            {service}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold text-sm mb-2">Coverage Areas:</h4>
                                                <div className="flex flex-wrap gap-1">
                                                    {subcontractor.coverageAreas.map((area) => (
                                                        <Badge key={area} variant="outline" className="text-xs">
                                                            {area}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex gap-2 pt-2">
                                                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                                                    <Phone className="h-3 w-3 mr-1" />
                                                    Call
                                                </Button>
                                                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                                                    <Mail className="h-3 w-3 mr-1" />
                                                    Email
                                                </Button>
                                                <Button variant="outline" size="sm">
                                                    <Edit className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="towing" className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Towing Company Network</h3>
                            <Dialog open={isAddTowingOpen} onOpenChange={setIsAddTowingOpen}>
                                <DialogTrigger asChild>
                                    <Button>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Towing Company
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle>Add Towing Company</DialogTitle>
                                        <DialogDescription>Register a new towing company for recovery services.</DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleAddTowingCompany} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="companyName">Company Name</Label>
                                                <Input id="companyName" name="companyName" required />
                                            </div>
                                            <div>
                                                <Label htmlFor="contactPerson">Contact Person</Label>
                                                <Input id="contactPerson" name="contactPerson" required />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="phone">Phone Number</Label>
                                                <Input id="phone" name="phone" type="tel" required />
                                            </div>
                                            <div>
                                                <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                                                <Input id="emergencyPhone" name="emergencyPhone" type="tel" required />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="email">Email Address</Label>
                                                <Input id="email" name="email" type="email" required />
                                            </div>
                                            <div>
                                                <Label htmlFor="location">Location</Label>
                                                <Input id="location" name="location" required />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <Label htmlFor="fleetSize">Fleet Size</Label>
                                                <Input id="fleetSize" name="fleetSize" type="number" required />
                                            </div>
                                            <div>
                                                <Label htmlFor="coverageRadius">Coverage Radius (km)</Label>
                                                <Input id="coverageRadius" name="coverageRadius" type="number" required />
                                            </div>
                                            <div>
                                                <Label htmlFor="responseTime">Response Time</Label>
                                                <Input id="responseTime" name="responseTime" placeholder="15-30 minutes" required />
                                            </div>
                                        </div>
                                        <div>
                                            <Label htmlFor="vehicleTypes">Vehicle Types (comma-separated)</Label>
                                            <Input
                                                id="vehicleTypes"
                                                name="vehicleTypes"
                                                placeholder="Light Vehicle Tow, Heavy Duty Tow, Flatbed"
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <Label htmlFor="baseRate">Base Rate (R)</Label>
                                                <Input id="baseRate" name="baseRate" type="number" required />
                                            </div>
                                            <div>
                                                <Label htmlFor="perKmRate">Per KM Rate (R)</Label>
                                                <Input id="perKmRate" name="perKmRate" type="number" required />
                                            </div>
                                            <div>
                                                <Label htmlFor="heavyVehicleSurcharge">Heavy Vehicle Surcharge (R)</Label>
                                                <Input id="heavyVehicleSurcharge" name="heavyVehicleSurcharge" type="number" />
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="checkbox" id="availability24h" name="availability24h" />
                                            <Label htmlFor="availability24h">24/7 Availability</Label>
                                        </div>
                                        <Button type="submit" className="w-full">
                                            Add Towing Company
                                        </Button>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="grid gap-4">
                            {towingCompanies.map((company) => (
                                <Card key={company.id} className="hover:shadow-md transition-shadow">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-2">
                                                    <Truck className="h-5 w-5 text-orange-500" />
                                                    <CardTitle className="text-lg">{company.companyName}</CardTitle>
                                                </div>
                                                <Badge className={getStatusColor(company.status)}>{company.status.toUpperCase()}</Badge>
                                                {company.availability24h && <Badge className="bg-blue-100 text-blue-800">24/7</Badge>}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                                <span className="text-sm font-semibold">{company.rating}</span>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                                            <div>
                                                <h4 className="font-semibold mb-2">Contact Information</h4>
                                                <div className="space-y-1 text-sm">
                                                    <p>
                                                        <strong>Contact:</strong> {company.contactPerson}
                                                    </p>
                                                    <p>
                                                        <strong>Phone:</strong> {company.phone}
                                                    </p>
                                                    <p>
                                                        <strong>Emergency:</strong> {company.emergencyPhone}
                                                    </p>
                                                    <p>
                                                        <strong>Email:</strong> {company.email}
                                                    </p>
                                                    <p>
                                                        <strong>Location:</strong> {company.location}
                                                    </p>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold mb-2">Fleet Details</h4>
                                                <div className="space-y-1 text-sm">
                                                    <p>
                                                        <strong>Fleet Size:</strong> {company.fleetSize} vehicles
                                                    </p>
                                                    <p>
                                                        <strong>Coverage:</strong> {company.coverageRadius} km radius
                                                    </p>
                                                    <p>
                                                        <strong>Response Time:</strong> {company.responseTime}
                                                    </p>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold mb-2">Pricing</h4>
                                                <div className="space-y-1 text-sm">
                                                    <p>
                                                        <strong>Base Rate:</strong> R {company.pricing.baseRate}
                                                    </p>
                                                    <p>
                                                        <strong>Per KM:</strong> R {company.pricing.perKmRate}
                                                    </p>
                                                    <p>
                                                        <strong>Heavy Vehicle:</strong> +R {company.pricing.heavyVehicleSurcharge}
                                                    </p>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold mb-2">Vehicle Types</h4>
                                                <div className="flex flex-wrap gap-1">
                                                    {company.vehicleTypes.map((type) => (
                                                        <Badge key={type} variant="secondary" className="text-xs">
                                                            {type}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-2 mt-4">
                                            <Button variant="outline" size="sm">
                                                <Phone className="h-4 w-4 mr-2" />
                                                Call
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                <Phone className="h-4 w-4 mr-2" />
                                                Emergency
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                <Mail className="h-4 w-4 mr-2" />
                                                Email
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                <Edit className="h-4 w-4 mr-2" />
                                                Edit
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="analytics" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">Total External Clients</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-blue-600">{externalClients.length}</div>
                                    <p className="text-xs text-muted-foreground">
                                        {externalClients.filter((c) => c.status === "active").length} active
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">Available Subcontractors</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-green-600">
                                        {subcontractors.filter((s) => s.availability === "available").length}
                                    </div>
                                    <p className="text-xs text-muted-foreground">Out of {subcontractors.length} total</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">Towing Coverage</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-orange-600">
                                        {Math.max(...towingCompanies.map((t) => t.coverageRadius))} km
                                    </div>
                                    <p className="text-xs text-muted-foreground">Maximum coverage radius</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">External Revenue</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-purple-600">
                                        R {externalClients.reduce((sum, client) => sum + client.totalRevenue, 0).toLocaleString()}
                                    </div>
                                    <p className="text-xs text-muted-foreground">Total from external clients</p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Top External Clients</CardTitle>
                                    <CardDescription>By revenue generated</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {externalClients
                                            .sort((a, b) => b.totalRevenue - a.totalRevenue)
                                            .slice(0, 5)
                                            .map((client) => (
                                                <div key={client.id} className="flex justify-between items-center">
                                                    <div>
                                                        <p className="font-medium">{client.companyName}</p>
                                                        <p className="text-sm text-gray-600">{client.totalJobs} jobs</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold">R {client.totalRevenue.toLocaleString()}</p>
                                                        <div className="flex items-center gap-1">
                                                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                                            <span className="text-xs">{client.rating}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Network Performance</CardTitle>
                                    <CardDescription>Key metrics and trends</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center p-3 border rounded-lg">
                                            <div>
                                                <p className="font-medium">Average Client Rating</p>
                                                <p className="text-sm text-gray-600">Across all external clients</p>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                                <span className="font-semibold">
                                                    {(
                                                        externalClients.reduce((sum, client) => sum + client.rating, 0) / externalClients.length
                                                    ).toFixed(1)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center p-3 border rounded-lg">
                                            <div>
                                                <p className="font-medium">Subcontractor Utilization</p>
                                                <p className="text-sm text-gray-600">Currently busy contractors</p>
                                            </div>
                                            <span className="font-semibold">
                                                {Math.round(
                                                    (subcontractors.filter((s) => s.availability === "busy").length / subcontractors.length) *
                                                    100,
                                                )}
                                                %
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 border rounded-lg">
                                            <div>
                                                <p className="font-medium">Average Response Time</p>
                                                <p className="text-sm text-gray-600">Towing companies</p>
                                            </div>
                                            <span className="font-semibold">22 min</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Client Details Dialog */}
                <Dialog open={isViewClientOpen} onOpenChange={setIsViewClientOpen}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Client Details - {selectedClient?.companyName}</DialogTitle>
                            <DialogDescription>Complete information and service history for external client</DialogDescription>
                        </DialogHeader>

                        {selectedClient && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg">Company Information</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2 text-sm">
                                            <div className="grid grid-cols-2 gap-2">
                                                <span className="font-medium">Company:</span>
                                                <span>{selectedClient.companyName}</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <span className="font-medium">Contact Person:</span>
                                                <span>{selectedClient.contactPerson}</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <span className="font-medium">Phone:</span>
                                                <span>{selectedClient.phone}</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <span className="font-medium">Email:</span>
                                                <span>{selectedClient.email}</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <span className="font-medium">Address:</span>
                                                <span>{selectedClient.address}</span>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg">Contract & Financial</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2 text-sm">
                                            <div className="grid grid-cols-2 gap-2">
                                                <span className="font-medium">Client Type:</span>
                                                <Badge variant="outline">{selectedClient.clientType.toUpperCase()}</Badge>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <span className="font-medium">Contract Type:</span>
                                                <span>{selectedClient.contractType}</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <span className="font-medium">Payment Terms:</span>
                                                <span>{selectedClient.paymentTerms}</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <span className="font-medium">Credit Limit:</span>
                                                <span>R {selectedClient.creditLimit.toLocaleString()}</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <span className="font-medium">Status:</span>
                                                <Badge className={getStatusColor(selectedClient.status)}>
                                                    {selectedClient.status.toUpperCase()}
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Service Performance</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-4 gap-4 text-center">
                                            <div>
                                                <div className="text-2xl font-bold text-blue-600">{selectedClient.totalJobs}</div>
                                                <p className="text-sm text-gray-600">Total Jobs</p>
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-green-600">
                                                    R {selectedClient.totalRevenue.toLocaleString()}
                                                </div>
                                                <p className="text-sm text-gray-600">Total Revenue</p>
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-yellow-600 flex items-center justify-center gap-1">
                                                    <Star className="h-6 w-6 fill-current" />
                                                    {selectedClient.rating}
                                                </div>
                                                <p className="text-sm text-gray-600">Client Rating</p>
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-purple-600">
                                                    R {Math.round(selectedClient.totalRevenue / selectedClient.totalJobs).toLocaleString()}
                                                </div>
                                                <p className="text-sm text-gray-600">Avg Job Value</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Preferred Services</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedClient.preferredServices.map((service) => (
                                                <Badge key={service} variant="secondary">
                                                    {service}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </>
    )
}
