"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Truck,
  Plus,
  Search,
  MapPin,
  Phone,
  User,
  CheckCircle,
  XCircle,
  FileText,
  Clock,
  DollarSign,
} from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

interface BreakdownVehicle {

  created_at: string
  emergency_type: string | null
  image_urls: string | null
  breakdown_type: string | null
  location: string
  order_no: string
  phone: string
  id: number | null
  registration: string
  make: string
  model: string
  year: number
  vin: string
  owner_name: string
  owner_phone: string
  owner_email: string
  driver_name: string
  driver_phone: string
  insurance_provider: string
  policy_number: string
  coverage_type: "comprehensive" | "third-party" | "none"
  status: "reported" | "assigned" | "in-progress" | "completed" | "cancelled"
  coordinates: { lat: number; lng: number }
  issue_description: string
  priority: "low" | "medium" | "high" | "emergency"
  reported_at: string
  estimated_cost?: number
  actual_cost?: number
  client_type: "internal" | "external"
  external_client_id?: string
  service_history: Array<{
    id: string
    date: string
    description: string
    cost: number
    technician: string
  }>
}

interface ExternalRequest {
  id: string
  clientName: string
  contactPerson: string
  phone: string
  email: string
  breakdownType: string
  vehicleDetails: {
    registration: string
    make: string
    model: string
    year: number
  }
  location: string
  description: string
  urgency: "low" | "medium" | "high" | "emergency"
  requestedAt: string
  status: "pending" | "accepted" | "declined" | "completed"
  estimatedCost?: number
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<BreakdownVehicle[]>([])
  const [externalRequests, setExternalRequests] = useState<ExternalRequest[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<BreakdownVehicle | null>(null)

  useEffect(() => {
    const supabase = createClient()

    const getVehicles = async () => {
      const { data: vehicles, error } = await supabase
        .from('breakdowns')
        .select('*')
      if (error) {
        console.error('Error fetching vehicles:', error)
      } else {
        setVehicles(vehicles as unknown as BreakdownVehicle[])
        console.log(vehicles)
      }
    }
    getVehicles()
    // Mock data - in real app, fetch from API
    // setVehicles([
    //   {
    //     id: "1",
    //     registration: "ABC 123 GP",
    //     make: "Mercedes-Benz",
    //     model: "Actros",
    //     year: 2022,
    //     vin: "WDB9634321L123456",
    //     ownerName: "Transport Solutions Ltd",
    //     ownerPhone: "+27 11 123 4567",
    //     ownerEmail: "fleet@transportsolutions.co.za",
    //     driverName: "John Smith",
    //     driverPhone: "+27 82 123 4567",
    //     insuranceProvider: "Santam",
    //     policyNumber: "POL123456789",
    //     coverageType: "comprehensive",
    //     status: "in-progress",
    //     breakdownLocation: "N1 Highway, Johannesburg",
    //     coordinates: { lat: -26.2041, lng: 28.0473 },
    //     issueDescription: "Engine overheating, steam coming from radiator",
    //     priority: "high",
    //     reportedAt: "2025-01-15T14:30:00Z",
    //     estimatedCost: 2500,
    //     clientType: "internal",
    //     serviceHistory: [
    //       {
    //         id: "1",
    //         date: "2023-12-01",
    //         description: "Regular maintenance service",
    //         cost: 1200,
    //         technician: "Mike Wilson",
    //       },
    //       {
    //         id: "2",
    //         date: "2023-10-15",
    //         description: "Tire replacement",
    //         cost: 800,
    //         technician: "David Brown",
    //       },
    //     ],
    //   },
    //   {
    //     id: "2",
    //     registration: "XYZ 789 GP",
    //     make: "Volvo",
    //     model: "FH16",
    //     year: 2021,
    //     vin: "YV2A2A1C1DA123456",
    //     ownerName: "ABC Logistics",
    //     ownerPhone: "+27 11 987 6543",
    //     ownerEmail: "operations@abclogistics.co.za",
    //     driverName: "Sarah Johnson",
    //     driverPhone: "+27 83 987 6543",
    //     insuranceProvider: "Old Mutual",
    //     policyNumber: "OM987654321",
    //     coverageType: "comprehensive",
    //     status: "completed",
    //     breakdownLocation: "M1 Highway, Sandton",
    //     coordinates: { lat: -26.1076, lng: 28.0567 },
    //     issueDescription: "Flat tire, no spare available",
    //     priority: "medium",
    //     reportedAt: "2025-01-15T10:15:00Z",
    //     estimatedCost: 800,
    //     actualCost: 750,
    //     clientType: "external",
    //     externalClientId: "ext-001",
    //     serviceHistory: [],
    //   },
    // ])

    setExternalRequests([
      {
        id: "1",
        clientName: "Quick Delivery Services",
        contactPerson: "Peter Williams",
        phone: "+27 84 555 1234",
        email: "peter@quickdelivery.co.za",
        vehicleDetails: {
          registration: "QDS 456 GP",
          make: "Isuzu",
          model: "NPR",
          year: 2020,
        },
        location: "Kempton Park Industrial",
        description: "Vehicle won't start, possible battery issue",
        urgency: "medium",
        requestedAt: "2025-01-16T09:00:00Z",
        status: "pending",
        breakdownType: "Mechanical",
      },
      {
        id: "2",
        clientName: "City Construction",
        contactPerson: "Maria Santos",
        phone: "+27 85 777 9999",
        email: "maria@cityconstruction.co.za",
        vehicleDetails: {
          registration: "CC 789 GP",
          make: "Caterpillar",
          model: "320D",
          year: 2019,
        },
        location: "Midrand Construction Site",
        description: "Hydraulic system failure on excavator",
        urgency: "high",
        requestedAt: "2025-01-16T11:30:00Z",
        status: "pending",
        estimatedCost: 3500,
        breakdownType: "Mechanical",
      },
    ])
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "reported":
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "assigned":
      case "accepted":
        return "bg-blue-100 text-blue-800"
      case "in-progress":
        return "bg-orange-100 text-orange-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
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

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)

    const newVehicle: BreakdownVehicle = {
      created_at: new Date().toISOString(),
      emergency_type: null,
      image_urls: null,
      breakdown_type: formData.get("breakdownType") as string,
      location: formData.get("location") as string,
      order_no: formData.get("order_no") as string,
      phone: formData.get("phone") as string,
      id: null,
      registration: formData.get("registration") as string,
      make: formData.get("make") as string,
      model: formData.get("model") as string,
      year: Number.parseInt(formData.get("year") as string),
      vin: formData.get("vin") as string,
      owner_name: formData.get("ownerName") as string,
      owner_phone: formData.get("ownerPhone") as string,
      owner_email: formData.get("ownerEmail") as string,
      driver_name: formData.get("driverName") as string,
      driver_phone: formData.get("driverPhone") as string,
      insurance_provider: formData.get("insuranceProvider") as string,
      policy_number: formData.get("policyNumber") as string,
      coverage_type: formData.get("coverageType") as BreakdownVehicle["coverage_type"],
      status: "reported",
      coordinates: { lat: 0, lng: 0 }, // In real app, geocode the location
      issue_description: formData.get("description") as string,
      priority: formData.get("priority") as BreakdownVehicle["priority"],
      reported_at: new Date().toISOString(),
      client_type: formData.get("clientType") as BreakdownVehicle["client_type"],
      service_history: [],
    }

    const supabase = createClient()

    const { data, error } = await supabase.from('breakdowns').insert(newVehicle).select()
    if (error) {
      console.error('Error reporting breakdown:', error)
    } else {
      setVehicles(data as unknown as BreakdownVehicle[])
    }
    // setVehicles(vehicles.concat(newVehicle))
    setIsAddVehicleOpen(false)
    toast.success(`Breakdown reported for ${newVehicle.registration}`)
  }

  const handleExternalRequest = (requestId: string, action: "accept" | "decline") => {
    setExternalRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, status: action === "accept" ? "accepted" : "declined" } : req,
      ),
    )

    if (action === "accept") {
      const request = externalRequests.find((r) => r.id === requestId)
      if (request) {
        // Convert external request to breakdown vehicle
        const newVehicle: BreakdownVehicle = {
          created_at: new Date().toISOString(),
          emergency_type: null,
          image_urls: null,
          breakdown_type: request.breakdownType as string,
          location: request.location,
          order_no: "Unknown",
          phone: request.phone,
          id: null,
          registration: request.vehicleDetails.registration,
          make: request.vehicleDetails.make,
          model: request.vehicleDetails.model,
          year: request.vehicleDetails.year,
          vin: "Unknown",
          owner_name: request.clientName,
          owner_phone: request.phone,
          owner_email: request.email,
          driver_name: request.contactPerson,
          driver_phone: request.phone,
          insurance_provider: "Unknown",
          policy_number: "Unknown",
          coverage_type: "none",
          status: "reported",
          coordinates: { lat: 0, lng: 0 },
          issue_description: request.description,
          priority: request.urgency as BreakdownVehicle["priority"],
          reported_at: request.requestedAt,
          estimated_cost: request.estimatedCost,
          client_type: "external",
          external_client_id: requestId,
          service_history: [],
        }
        setVehicles((prev) => [...prev, newVehicle])
      }
    }

    toast.success(`External service request has been ${action}ed`)
  }

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.registration ||
      vehicle.make ||
      vehicle.model ||
      vehicle.owner_name

    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <>
      <div className="flex-1 space-y-4 p-4 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Breakdown Vehicles</h2>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="reported">Reported</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={isAddVehicleOpen} onOpenChange={setIsAddVehicleOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Report Breakdown
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Report Vehicle Breakdown</DialogTitle>
                  <DialogDescription>Enter vehicle and breakdown details</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddVehicle} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Vehicle Information</h3>
                      <div>
                        <Label htmlFor="registration">Registration Number</Label>
                        <Input id="registration" name="registration" required />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="make">Make</Label>
                          <Input id="make" name="make" required />
                        </div>
                        <div>
                          <Label htmlFor="model">Model</Label>
                          <Input id="model" name="model" required />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="year">Year</Label>
                          <Input id="year" name="year" type="number" required />
                        </div>
                        <div>
                          <Label htmlFor="vin">VIN Number</Label>
                          <Input id="vin" name="vin" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Owner Information</h3>
                      <div>
                        <Label htmlFor="ownerName">Owner/Company Name</Label>
                        <Input id="ownerName" name="ownerName" required />
                      </div>
                      <div>
                        <Label htmlFor="ownerPhone">Owner Phone</Label>
                        <Input id="ownerPhone" name="ownerPhone" type="tel" required />
                      </div>
                      <div>
                        <Label htmlFor="ownerEmail">Owner Email</Label>
                        <Input id="ownerEmail" name="ownerEmail" type="email" />
                      </div>
                      <div>
                        <Label htmlFor="clientType">Client Type</Label>
                        <Select name="clientType" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select client type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="internal">Internal</SelectItem>
                            <SelectItem value="external">External</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Driver Information</h3>
                      <div>
                        <Label htmlFor="driverName">Driver Name</Label>
                        <Input id="driverName" name="driverName" />
                      </div>
                      <div>
                        <Label htmlFor="driverPhone">Driver Phone</Label>
                        <Input id="driverPhone" name="driverPhone" type="tel" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Insurance Information</h3>
                      <div>
                        <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                        <Input id="insuranceProvider" name="insuranceProvider" />
                      </div>
                      <div>
                        <Label htmlFor="policyNumber">Policy Number</Label>
                        <Input id="policyNumber" name="policyNumber" />
                      </div>
                      <div>
                        <Label htmlFor="coverageType">Coverage Type</Label>
                        <Select name="coverageType">
                          <SelectTrigger>
                            <SelectValue placeholder="Select coverage" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="comprehensive">Comprehensive</SelectItem>
                            <SelectItem value="third-party">Third Party</SelectItem>
                            <SelectItem value="none">None</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Breakdown Details</h3>
                    <div>
                      <Label htmlFor="location">Breakdown Location</Label>
                      <Input id="location" name="location" required />
                    </div>
                    <div>
                      <Label htmlFor="breakdownType">Breakdown Type</Label>
                      <Select name="breakdownType" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Breakdown Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mechanical">Mechanical</SelectItem>
                          <SelectItem value="Electrical">Electrical</SelectItem>
                          <SelectItem value="Breakdown">Breakdown</SelectItem>
                          <SelectItem value="Towing">Towing</SelectItem>
                          <SelectItem value="Driveline">Driveline</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      Report Breakdown
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setIsAddVehicleOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">Active Breakdowns</TabsTrigger>
            {/* <TabsTrigger value="history">Service History</TabsTrigger> */}
            <TabsTrigger value="external">
              External Requests ({externalRequests.filter((r) => r.status === "pending").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            <div className="grid gap-4">
              {filteredVehicles.map((vehicle) => (
                <Card key={vehicle.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Truck className="h-5 w-5 text-blue-500" />
                          <CardTitle className="text-lg">{vehicle.registration}</CardTitle>
                        </div>
                        <Badge className={getPriorityColor(vehicle.priority)}>{vehicle.priority}</Badge>
                        <Badge className={getStatusColor(vehicle.status)}>
                          {vehicle.status}
                        </Badge>
                        {vehicle.client_type === "external" && <Badge variant="outline">External</Badge>}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-500">{new Date(vehicle.reported_at).toLocaleString()}</span>
                      </div>
                    </div>
                    <CardDescription className="text-base">
                      {vehicle.make} {vehicle.model} ({vehicle.year})
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Owner Information
                        </h4>
                        <p className="text-sm">
                          <strong>Name:</strong> {vehicle.owner_name}
                        </p>
                        <p className="text-sm">
                          <strong>Phone:</strong> {vehicle.owner_phone}
                        </p>
                        {vehicle.owner_email && (
                          <p className="text-sm">
                            <strong>Email:</strong> {vehicle.owner_email}
                          </p>
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Driver Information
                        </h4>
                        {vehicle.driver_name ? (
                          <>
                            <p className="text-sm">
                              <strong>Name:</strong> {vehicle.driver_name}
                            </p>
                            <p className="text-sm">
                              <strong>Phone:</strong> {vehicle.driver_phone}
                            </p>
                          </>
                        ) : (
                          <p className="text-sm text-gray-500">No driver assigned</p>
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Location
                        </h4>
                        <p className="text-sm text-gray-600">{vehicle.location}</p>

                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Cost & Insurance
                        </h4>
                        {vehicle.estimated_cost && (
                          <p className="text-sm">
                            <strong>Est. Cost:</strong> R {vehicle.estimated_cost.toFixed(2)}
                          </p>
                        )}
                        {vehicle.actual_cost && (
                          <p className="text-sm">
                            <strong>Actual:</strong> R {vehicle.actual_cost.toFixed(2)}
                          </p>
                        )}
                        <p className="text-sm">
                          <strong>Insurance:</strong> {vehicle.insurance_provider}
                        </p>
                        <p className="text-sm">
                          <strong>Coverage:</strong> {vehicle.coverage_type}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4 mr-2" />
                          Call Owner
                        </Button>
                        {vehicle.driver_phone && (
                          <Button variant="outline" size="sm">
                            <Phone className="h-4 w-4 mr-2" />
                            Call Driver
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <MapPin className="h-4 w-4 mr-2" />
                          View Location
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Service History</CardTitle>
                <CardDescription>Complete service history for all vehicles</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Service Description</TableHead>
                      <TableHead>Technician</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vehicles.flatMap((vehicle) =>
                      vehicle.serviceHistory.map((service) => (
                        <TableRow key={`${vehicle.id}-${service.id}`}>
                          <TableCell>{new Date(service.date).toLocaleDateString()}</TableCell>
                          <TableCell className="font-medium">{vehicle.registration}</TableCell>
                          <TableCell>{service.description}</TableCell>
                          <TableCell>{service.technician}</TableCell>
                          <TableCell>R {service.cost.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800">Completed</Badge>
                          </TableCell>
                        </TableRow>
                      )),
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent> */}

          <TabsContent value="external" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>External Service Requests</CardTitle>
                <CardDescription>Requests from external clients for breakdown services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {externalRequests.map((request) => (
                    <Card key={request.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-semibold text-lg">{request.clientName}</h4>
                            <p className="text-sm text-gray-600">Contact: {request.contactPerson}</p>
                            <p className="text-sm text-gray-600">Phone: {request.phone}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getPriorityColor(request.urgency)}>
                              {request.urgency}
                            </Badge>
                            <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <h5 className="font-semibold mb-2">Vehicle Details</h5>
                            <p className="text-sm">
                              <strong>Reg:</strong> {request.vehicleDetails.registration}
                            </p>
                            <p className="text-sm">
                              <strong>Make:</strong> {request.vehicleDetails.make}
                            </p>
                            <p className="text-sm">
                              <strong>Model:</strong> {request.vehicleDetails.model}
                            </p>
                            <p className="text-sm">
                              <strong>Year:</strong> {request.vehicleDetails.year}
                            </p>
                          </div>
                          <div>
                            <h5 className="font-semibold mb-2">Location & Issue</h5>
                            <p className="text-sm">
                              <strong>Location:</strong> {request.location}
                            </p>
                            <p className="text-sm">
                              <strong>Description:</strong> {request.description}
                            </p>
                          </div>
                          <div>
                            <h5 className="font-semibold mb-2">Request Details</h5>
                            <p className="text-sm">
                              <strong>Requested:</strong> {new Date(request.requestedAt).toLocaleString()}
                            </p>
                            {request.estimatedCost && (
                              <p className="text-sm">
                                <strong>Est. Cost:</strong> R {request.estimatedCost.toFixed(2)}
                              </p>
                            )}
                          </div>
                        </div>

                        {request.status === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleExternalRequest(request.id, "accept")}
                              className="bg-green-600 hover:bg-green-700"
                              size="sm"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Accept Request
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleExternalRequest(request.id, "decline")}
                              size="sm"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Decline Request
                            </Button>
                            <Button variant="outline" size="sm">
                              <Phone className="h-4 w-4 mr-2" />
                              Call Client
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
