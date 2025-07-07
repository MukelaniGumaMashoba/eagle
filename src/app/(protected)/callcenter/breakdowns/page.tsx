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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Truck, Plus, Search, MapPin, Clock, CheckCircle, FileText, Phone, Edit, Eye } from "lucide-react"
import { toast } from "sonner"

interface BreakdownVehicle {
    id: string
    registration: string
    make: string
    model: string
    year: number
    vin: string
    ownerName: string
    ownerPhone: string
    ownerEmail: string
    driverName?: string
    driverPhone?: string
    currentLocation: string
    coordinates: { lat: number; lng: number }
    breakdownDescription: string
    reportedAt: string
    status: "reported" | "assigned" | "in-progress" | "completed" | "cancelled"
    priority: "low" | "medium" | "high" | "emergency"
    assignedTechnician?: string
    estimatedRepairTime?: string
    repairCost?: number
    insuranceDetails?: {
        provider: string
        policyNumber: string
        covered: boolean
    }
    vehicleHistory: BreakdownHistory[]
}

interface BreakdownHistory {
    id: string
    date: string
    issue: string
    resolution: string
    cost: number
    technician: string
}

interface ExternalRequest {
    id: string
    clientName: string
    clientPhone: string
    clientEmail: string
    vehicleDetails: {
        registration: string
        make: string
        model: string
        year: number
    }
    location: string
    description: string
    requestedAt: string
    status: "pending" | "accepted" | "declined" | "completed"
    quotedAmount?: number
    assignedTechnician?: string
}

export default function VehiclesPage() {
    const [breakdownVehicles, setBreakdownVehicles] = useState<BreakdownVehicle[]>([])
    const [externalRequests, setExternalRequests] = useState<ExternalRequest[]>([])
    const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false)
    const [selectedVehicle, setSelectedVehicle] = useState<BreakdownVehicle | null>(null)
    const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterStatus, setFilterStatus] = useState<string>("all")

    useEffect(() => {
        // Mock data for breakdown vehicles
        setBreakdownVehicles([
            {
                id: "1",
                registration: "ABC 123 GP",
                make: "Mercedes-Benz",
                model: "Actros",
                year: 2022,
                vin: "WDB9634321L123456",
                ownerName: "Transport Solutions Ltd",
                ownerPhone: "+27 11 123 4567",
                ownerEmail: "fleet@transportsolutions.co.za",
                driverName: "John Smith",
                driverPhone: "+27 82 123 4567",
                currentLocation: "N1 Highway, Johannesburg",
                coordinates: { lat: -26.2041, lng: 28.0473 },
                breakdownDescription:
                    "Engine overheating, steam coming from radiator. Driver reports temperature gauge in red zone.",
                reportedAt: "2024-01-15 14:30",
                status: "in-progress",
                priority: "high",
                assignedTechnician: "Mike Wilson",
                estimatedRepairTime: "4-6 hours",
                repairCost: 2500,
                insuranceDetails: {
                    provider: "Commercial Vehicle Insurance",
                    policyNumber: "CVI-2024-001234",
                    covered: true,
                },
                vehicleHistory: [
                    {
                        id: "1",
                        date: "2023-12-10",
                        issue: "Brake pad replacement",
                        resolution: "Replaced front brake pads and discs",
                        cost: 1200,
                        technician: "David Brown",
                    },
                    {
                        id: "2",
                        date: "2023-10-15",
                        issue: "Tire puncture",
                        resolution: "Replaced rear tire",
                        cost: 800,
                        technician: "Lisa Davis",
                    },
                ],
            },
            {
                id: "2",
                registration: "XYZ 789 GP",
                make: "Volvo",
                model: "FH16",
                year: 2021,
                vin: "YV2A2A1C1DA123456",
                ownerName: "Logistics Pro",
                ownerPhone: "+27 11 987 6543",
                ownerEmail: "operations@logisticspro.co.za",
                driverName: "Sarah Johnson",
                driverPhone: "+27 83 987 6543",
                currentLocation: "M1 Highway, Sandton",
                coordinates: { lat: -26.1076, lng: 28.0567 },
                breakdownDescription: "Multiple tire punctures on rear axle. Vehicle cannot continue journey safely.",
                reportedAt: "2024-01-15 15:45",
                status: "completed",
                priority: "medium",
                assignedTechnician: "David Brown",
                estimatedRepairTime: "2-3 hours",
                repairCost: 1500,
                vehicleHistory: [
                    {
                        id: "3",
                        date: "2024-01-15",
                        issue: "Tire replacement",
                        resolution: "Replaced both rear tires and performed wheel alignment",
                        cost: 1500,
                        technician: "David Brown",
                    },
                ],
            },
        ])

        setExternalRequests([
            {
                id: "1",
                clientName: "Independent Trucking Co",
                clientPhone: "+27 12 555 0123",
                clientEmail: "dispatch@independenttrucking.co.za",
                vehicleDetails: {
                    registration: "DEF 456 GP",
                    make: "Scania",
                    model: "R450",
                    year: 2020,
                },
                location: "N3 Highway, Heidelberg",
                description: "Transmission failure - vehicle stuck on highway, urgent assistance required",
                requestedAt: "2024-01-15 16:15",
                status: "pending",
                quotedAmount: 3500,
            },
            {
                id: "2",
                clientName: "City Delivery Services",
                clientPhone: "+27 21 444 5678",
                clientEmail: "fleet@citydelivery.co.za",
                vehicleDetails: {
                    registration: "GHI 789 WC",
                    make: "Isuzu",
                    model: "NPR",
                    year: 2019,
                },
                location: "N1 Highway, Cape Town",
                description: "Electrical fault causing intermittent engine shutdown",
                requestedAt: "2024-01-15 13:20",
                status: "accepted",
                quotedAmount: 1800,
                assignedTechnician: "Cape Town Team",
            },
        ])
    }, [])

    const handleAddVehicle = (e: React.FormEvent) => {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)

        const newVehicle: BreakdownVehicle = {
            id: Date.now().toString(),
            registration: formData.get("registration") as string,
            make: formData.get("make") as string,
            model: formData.get("model") as string,
            year: Number.parseInt(formData.get("year") as string),
            vin: formData.get("vin") as string,
            ownerName: formData.get("ownerName") as string,
            ownerPhone: formData.get("ownerPhone") as string,
            ownerEmail: formData.get("ownerEmail") as string,
            driverName: formData.get("driverName") as string,
            driverPhone: formData.get("driverPhone") as string,
            currentLocation: formData.get("location") as string,
            coordinates: { lat: -26.2041, lng: 28.0473 },
            breakdownDescription: formData.get("description") as string,
            reportedAt: new Date().toLocaleString(),
            status: "reported",
            priority: formData.get("priority") as any,
            vehicleHistory: [],
        }

        setBreakdownVehicles((prev) => [...prev, newVehicle])
        setIsAddVehicleOpen(false)
        toast.success(`Breakdown for ${newVehicle.registration} has been added to the system.`)
    }

    const handleExternalRequestAction = (requestId: string, action: "accept" | "decline") => {
        setExternalRequests((prev) =>
            prev.map((request) =>
                request.id === requestId ? { ...request, status: action === "accept" ? "accepted" : "declined" } : request,
            ),
        )

        const request = externalRequests.find((r) => r.id === requestId)
        toast.success(`External request from ${request?.clientName} has been ${action}ed.`)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "reported":
                return "bg-yellow-100 text-yellow-800"
            case "assigned":
                return "bg-blue-100 text-blue-800"
            case "in-progress":
                return "bg-orange-100 text-orange-800"
            case "completed":
                return "bg-green-100 text-green-800"
            case "cancelled":
                return "bg-red-100 text-red-800"
            case "pending":
                return "bg-gray-100 text-gray-800"
            case "accepted":
                return "bg-green-100 text-green-800"
            case "declined":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "emergency":
                return "bg-red-500 text-white"
            case "high":
                return "bg-orange-500 text-white"
            case "medium":
                return "bg-yellow-500 text-white"
            case "low":
                return "bg-green-500 text-white"
            default:
                return "bg-gray-500 text-white"
        }
    }

    const filteredVehicles = breakdownVehicles.filter((vehicle) => {
        const matchesSearch =
            vehicle.registration.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vehicle.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesFilter = filterStatus === "all" || vehicle.status === filterStatus

        return matchesSearch && matchesFilter
    })

    return (
        <>


            <div className="flex-1 space-y-4 p-4 pt-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold tracking-tight">Breakdown Vehicles & External Requests</h2>
                    <Dialog open={isAddVehicleOpen} onOpenChange={setIsAddVehicleOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Report Breakdown
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Report Vehicle Breakdown</DialogTitle>
                                <DialogDescription>Enter details of the vehicle breakdown incident.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleAddVehicle} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="registration">Vehicle Registration</Label>
                                        <Input id="registration" name="registration" placeholder="ABC 123 GP" required />
                                    </div>
                                    <div>
                                        <Label htmlFor="priority">Priority Level</Label>
                                        <Select name="priority" required>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select priority" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="low">Low</SelectItem>
                                                <SelectItem value="medium">Medium</SelectItem>
                                                <SelectItem value="high">High</SelectItem>
                                                <SelectItem value="emergency">Emergency</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="make">Make</Label>
                                        <Input id="make" name="make" required />
                                    </div>
                                    <div>
                                        <Label htmlFor="model">Model</Label>
                                        <Input id="model" name="model" required />
                                    </div>
                                    <div>
                                        <Label htmlFor="year">Year</Label>
                                        <Input id="year" name="year" type="number" required />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="vin">VIN Number</Label>
                                    <Input id="vin" name="vin" required />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="ownerName">Owner/Company Name</Label>
                                        <Input id="ownerName" name="ownerName" required />
                                    </div>
                                    <div>
                                        <Label htmlFor="ownerPhone">Owner Phone</Label>
                                        <Input id="ownerPhone" name="ownerPhone" type="tel" required />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="ownerEmail">Owner Email</Label>
                                    <Input id="ownerEmail" name="ownerEmail" type="email" required />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="driverName">Driver Name</Label>
                                        <Input id="driverName" name="driverName" />
                                    </div>
                                    <div>
                                        <Label htmlFor="driverPhone">Driver Phone</Label>
                                        <Input id="driverPhone" name="driverPhone" type="tel" />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="location">Current Location</Label>
                                    <Input id="location" name="location" placeholder="N1 Highway, Johannesburg" required />
                                </div>

                                <div>
                                    <Label htmlFor="description">Breakdown Description</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        placeholder="Describe the vehicle problem in detail..."
                                        rows={4}
                                        required
                                    />
                                </div>

                                <Button type="submit" className="w-full">
                                    Report Breakdown
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by registration, owner, make, or model..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="reported">Reported</SelectItem>
                            <SelectItem value="assigned">Assigned</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Tabs defaultValue="breakdowns" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="breakdowns">Breakdown Vehicles ({filteredVehicles.length})</TabsTrigger>
                        <TabsTrigger value="external">External Requests ({externalRequests.length})</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    </TabsList>

                    <TabsContent value="breakdowns" className="space-y-4">
                        <div className="grid gap-4">
                            {filteredVehicles.map((vehicle) => (
                                <Card key={vehicle.id} className="hover:shadow-md transition-shadow">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-2">
                                                    <Truck className="h-5 w-5 text-blue-500" />
                                                    <CardTitle className="text-lg">{vehicle.registration}</CardTitle>
                                                </div>
                                                <Badge className={getPriorityColor(vehicle.priority)}>{vehicle.priority.toUpperCase()}</Badge>
                                                <Badge className={getStatusColor(vehicle.status)}>
                                                    {vehicle.status.replace("-", " ").toUpperCase()}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-gray-500" />
                                                <span className="text-sm text-gray-500">{vehicle.reportedAt}</span>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                                            <div>
                                                <h4 className="font-semibold mb-2">Vehicle Details</h4>
                                                <div className="space-y-1 text-sm">
                                                    <p>
                                                        <strong>Make/Model:</strong> {vehicle.make} {vehicle.model}
                                                    </p>
                                                    <p>
                                                        <strong>Year:</strong> {vehicle.year}
                                                    </p>
                                                    <p>
                                                        <strong>VIN:</strong> {vehicle.vin}
                                                    </p>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold mb-2">Owner Information</h4>
                                                <div className="space-y-1 text-sm">
                                                    <p>
                                                        <strong>Owner:</strong> {vehicle.ownerName}
                                                    </p>
                                                    <p>
                                                        <strong>Phone:</strong> {vehicle.ownerPhone}
                                                    </p>
                                                    <p>
                                                        <strong>Email:</strong> {vehicle.ownerEmail}
                                                    </p>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold mb-2">Driver & Location</h4>
                                                <div className="space-y-1 text-sm">
                                                    {vehicle.driverName && (
                                                        <>
                                                            <p>
                                                                <strong>Driver:</strong> {vehicle.driverName}
                                                            </p>
                                                            <p>
                                                                <strong>Driver Phone:</strong> {vehicle.driverPhone}
                                                            </p>
                                                        </>
                                                    )}
                                                    <div className="flex items-start gap-2">
                                                        <MapPin className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                                                        <span className="text-xs">{vehicle.currentLocation}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold mb-2">Service Details</h4>
                                                <div className="space-y-1 text-sm">
                                                    {vehicle.assignedTechnician && (
                                                        <p>
                                                            <strong>Technician:</strong> {vehicle.assignedTechnician}
                                                        </p>
                                                    )}
                                                    {vehicle.estimatedRepairTime && (
                                                        <p>
                                                            <strong>Est. Time:</strong> {vehicle.estimatedRepairTime}
                                                        </p>
                                                    )}
                                                    {vehicle.repairCost && (
                                                        <p>
                                                            <strong>Est. Cost:</strong> R {vehicle.repairCost.toLocaleString()}
                                                        </p>
                                                    )}
                                                    {vehicle.insuranceDetails && (
                                                        <p>
                                                            <strong>Insurance:</strong>{" "}
                                                            <Badge
                                                                className={
                                                                    vehicle.insuranceDetails.covered
                                                                        ? "bg-green-100 text-green-800"
                                                                        : "bg-red-100 text-red-800"
                                                                }
                                                            >
                                                                {vehicle.insuranceDetails.covered ? "Covered" : "Not Covered"}
                                                            </Badge>
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                            <h4 className="font-semibold mb-2">Problem Description</h4>
                                            <p className="text-sm text-gray-700">{vehicle.breakdownDescription}</p>
                                        </div>

                                        <div className="flex justify-end gap-2 mt-4">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedVehicle(vehicle)
                                                    setIsViewDetailsOpen(true)
                                                }}
                                            >
                                                <Eye className="h-4 w-4 mr-2" />
                                                View Details
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                <Phone className="h-4 w-4 mr-2" />
                                                Call Owner
                                            </Button>
                                            {vehicle.driverPhone && (
                                                <Button variant="outline" size="sm">
                                                    <Phone className="h-4 w-4 mr-2" />
                                                    Call Driver
                                                </Button>
                                            )}
                                            <Button variant="outline" size="sm">
                                                <MapPin className="h-4 w-4 mr-2" />
                                                Track Location
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                <Edit className="h-4 w-4 mr-2" />
                                                Update Status
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="external" className="space-y-4">
                        <div className="grid gap-4">
                            {externalRequests.map((request) => (
                                <Card key={request.id} className="hover:shadow-md transition-shadow">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="h-5 w-5 text-purple-500" />
                                                    <CardTitle className="text-lg">{request.clientName}</CardTitle>
                                                </div>
                                                <Badge className={getStatusColor(request.status)}>{request.status.toUpperCase()}</Badge>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-gray-500" />
                                                <span className="text-sm text-gray-500">{request.requestedAt}</span>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                            <div>
                                                <h4 className="font-semibold mb-2">Client Information</h4>
                                                <div className="space-y-1 text-sm">
                                                    <p>
                                                        <strong>Company:</strong> {request.clientName}
                                                    </p>
                                                    <p>
                                                        <strong>Phone:</strong> {request.clientPhone}
                                                    </p>
                                                    <p>
                                                        <strong>Email:</strong> {request.clientEmail}
                                                    </p>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold mb-2">Vehicle Details</h4>
                                                <div className="space-y-1 text-sm">
                                                    <p>
                                                        <strong>Registration:</strong> {request.vehicleDetails.registration}
                                                    </p>
                                                    <p>
                                                        <strong>Make/Model:</strong> {request.vehicleDetails.make} {request.vehicleDetails.model}
                                                    </p>
                                                    <p>
                                                        <strong>Year:</strong> {request.vehicleDetails.year}
                                                    </p>
                                                    <div className="flex items-start gap-2 mt-2">
                                                        <MapPin className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                                                        <span className="text-xs">{request.location}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold mb-2">Service Request</h4>
                                                <p className="text-sm text-gray-700 mb-3">{request.description}</p>
                                                {request.quotedAmount && (
                                                    <p className="text-lg font-semibold text-green-600">
                                                        Quoted: R {request.quotedAmount.toLocaleString()}
                                                    </p>
                                                )}
                                                {request.assignedTechnician && (
                                                    <p className="text-sm">
                                                        <strong>Assigned:</strong> {request.assignedTechnician}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-2 mt-4">
                                            <Button variant="outline" size="sm">
                                                <Phone className="h-4 w-4 mr-2" />
                                                Call Client
                                            </Button>
                                            {request.status === "pending" && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        className="bg-green-600 hover:bg-green-700"
                                                        onClick={() => handleExternalRequestAction(request.id, "accept")}
                                                    >
                                                        <CheckCircle className="h-4 w-4 mr-2" />
                                                        Accept Request
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleExternalRequestAction(request.id, "decline")}
                                                    >
                                                        Decline
                                                    </Button>
                                                </>
                                            )}
                                            {request.status === "accepted" && (
                                                <Button size="sm">
                                                    <FileText className="h-4 w-4 mr-2" />
                                                    Create Job Order
                                                </Button>
                                            )}
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
                                    <CardTitle className="text-sm font-medium">Active Breakdowns</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-red-600">
                                        {breakdownVehicles.filter((v) => v.status === "in-progress" || v.status === "assigned").length}
                                    </div>
                                    <p className="text-xs text-muted-foreground">Currently being serviced</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">Pending External Requests</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-orange-600">
                                        {externalRequests.filter((r) => r.status === "pending").length}
                                    </div>
                                    <p className="text-xs text-muted-foreground">Awaiting response</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-green-600">
                                        {breakdownVehicles.filter((v) => v.status === "completed").length}
                                    </div>
                                    <p className="text-xs text-muted-foreground">Successfully resolved</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">Average Resolution Time</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-blue-600">3.2 hrs</div>
                                    <p className="text-xs text-muted-foreground">-15 min from last week</p>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Breakdown Trends</CardTitle>
                                <CardDescription>Common issues and resolution patterns</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-3 border rounded-lg">
                                        <div>
                                            <p className="font-medium">Engine/Cooling System Issues</p>
                                            <p className="text-sm text-gray-600">35% of all breakdowns</p>
                                        </div>
                                        <Badge className="bg-red-100 text-red-800">High Priority</Badge>
                                    </div>
                                    <div className="flex justify-between items-center p-3 border rounded-lg">
                                        <div>
                                            <p className="font-medium">Tire and Wheel Problems</p>
                                            <p className="text-sm text-gray-600">28% of all breakdowns</p>
                                        </div>
                                        <Badge className="bg-yellow-100 text-yellow-800">Medium Priority</Badge>
                                    </div>
                                    <div className="flex justify-between items-center p-3 border rounded-lg">
                                        <div>
                                            <p className="font-medium">Electrical Faults</p>
                                            <p className="text-sm text-gray-600">22% of all breakdowns</p>
                                        </div>
                                        <Badge className="bg-orange-100 text-orange-800">Variable Priority</Badge>
                                    </div>
                                    <div className="flex justify-between items-center p-3 border rounded-lg">
                                        <div>
                                            <p className="font-medium">Transmission Issues</p>
                                            <p className="text-sm text-gray-600">15% of all breakdowns</p>
                                        </div>
                                        <Badge className="bg-red-100 text-red-800">High Priority</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Vehicle Details Dialog */}
                <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Vehicle Details - {selectedVehicle?.registration}</DialogTitle>
                            <DialogDescription>
                                Complete information and service history for {selectedVehicle?.make} {selectedVehicle?.model}
                            </DialogDescription>
                        </DialogHeader>

                        {selectedVehicle && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg">Vehicle Information</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2 text-sm">
                                            <div className="grid grid-cols-2 gap-2">
                                                <span className="font-medium">Registration:</span>
                                                <span>{selectedVehicle.registration}</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <span className="font-medium">Make/Model:</span>
                                                <span>
                                                    {selectedVehicle.make} {selectedVehicle.model}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <span className="font-medium">Year:</span>
                                                <span>{selectedVehicle.year}</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <span className="font-medium">VIN:</span>
                                                <span>{selectedVehicle.vin}</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <span className="font-medium">Status:</span>
                                                <Badge className={getStatusColor(selectedVehicle.status)}>
                                                    {selectedVehicle.status.replace("-", " ").toUpperCase()}
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg">Owner & Driver</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2 text-sm">
                                            <div className="grid grid-cols-2 gap-2">
                                                <span className="font-medium">Owner:</span>
                                                <span>{selectedVehicle.ownerName}</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <span className="font-medium">Owner Phone:</span>
                                                <span>{selectedVehicle.ownerPhone}</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <span className="font-medium">Owner Email:</span>
                                                <span>{selectedVehicle.ownerEmail}</span>
                                            </div>
                                            {selectedVehicle.driverName && (
                                                <>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <span className="font-medium">Driver:</span>
                                                        <span>{selectedVehicle.driverName}</span>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <span className="font-medium">Driver Phone:</span>
                                                        <span>{selectedVehicle.driverPhone}</span>
                                                    </div>
                                                </>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>

                                {selectedVehicle.insuranceDetails && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg">Insurance Information</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2 text-sm">
                                            <div className="grid grid-cols-3 gap-4">
                                                <div>
                                                    <span className="font-medium">Provider:</span>
                                                    <p>{selectedVehicle.insuranceDetails.provider}</p>
                                                </div>
                                                <div>
                                                    <span className="font-medium">Policy Number:</span>
                                                    <p>{selectedVehicle.insuranceDetails.policyNumber}</p>
                                                </div>
                                                <div>
                                                    <span className="font-medium">Coverage Status:</span>
                                                    <Badge
                                                        className={
                                                            selectedVehicle.insuranceDetails.covered
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-red-100 text-red-800"
                                                        }
                                                    >
                                                        {selectedVehicle.insuranceDetails.covered ? "Covered" : "Not Covered"}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Current Breakdown</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div>
                                                <span className="font-medium">Location:</span>
                                                <p className="text-sm">{selectedVehicle.currentLocation}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium">Description:</span>
                                                <p className="text-sm">{selectedVehicle.breakdownDescription}</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <span className="font-medium">Reported At:</span>
                                                    <p className="text-sm">{selectedVehicle.reportedAt}</p>
                                                </div>
                                                <div>
                                                    <span className="font-medium">Priority:</span>
                                                    <Badge className={getPriorityColor(selectedVehicle.priority)}>
                                                        {selectedVehicle.priority.toUpperCase()}
                                                    </Badge>
                                                </div>
                                            </div>
                                            {selectedVehicle.assignedTechnician && (
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <span className="font-medium">Assigned Technician:</span>
                                                        <p className="text-sm">{selectedVehicle.assignedTechnician}</p>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Estimated Repair Time:</span>
                                                        <p className="text-sm">{selectedVehicle.estimatedRepairTime}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {selectedVehicle.repairCost && (
                                                <div>
                                                    <span className="font-medium">Estimated Cost:</span>
                                                    <p className="text-lg font-semibold text-green-600">
                                                        R {selectedVehicle.repairCost.toLocaleString()}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Service History</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {selectedVehicle.vehicleHistory.length > 0 ? (
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Date</TableHead>
                                                        <TableHead>Issue</TableHead>
                                                        <TableHead>Resolution</TableHead>
                                                        <TableHead>Cost</TableHead>
                                                        <TableHead>Technician</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {selectedVehicle.vehicleHistory.map((history) => (
                                                        <TableRow key={history.id}>
                                                            <TableCell>{history.date}</TableCell>
                                                            <TableCell>{history.issue}</TableCell>
                                                            <TableCell>{history.resolution}</TableCell>
                                                            <TableCell>R {history.cost.toLocaleString()}</TableCell>
                                                            <TableCell>{history.technician}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        ) : (
                                            <p className="text-sm text-gray-500 text-center py-4">No previous service history available</p>
                                        )}
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
