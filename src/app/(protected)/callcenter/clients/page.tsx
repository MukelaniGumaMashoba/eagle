"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import {
  Building,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  Star,
  Users,
  DollarSign,
  Clock,
  AlertTriangle,
  FileText,
} from "lucide-react"
import { toast } from "sonner"

interface ExternalClient {
  id: string
  companyName: string
  contactPerson: string
  phone: string
  email: string
  address: string
  city: string
  province: string
  postalCode: string
  clientType: "corporate" | "sme" | "individual"
  status: "active" | "inactive" | "pending"
  rating: number
  totalJobs: number
  totalRevenue: number
  averageJobValue: number
  paymentTerms: string
  creditLimit: number
  registrationDate: string
  lastJobDate?: string
  preferredServices: string[]
  contractType: "standard" | "premium" | "custom"
  accountManager: string
}

interface Subcontractor {
  id: string
  companyName: string
  contactPerson: string
  phone: string
  email: string
  specialties: string[]
  serviceAreas: string[]
  rating: number
  completedJobs: number
  responseTime: string
  hourlyRate: number
  availability: "available" | "busy" | "unavailable"
  certifications: string[]
  equipmentTypes: string[]
  contractStatus: "active" | "pending" | "suspended"
  lastActive: string
}

interface TowingCompany {
  id: string
  companyName: string
  contactPerson: string
  phone: string
  emergencyPhone: string
  email: string
  serviceAreas: string[]
  vehicleTypes: string[]
  capacity: {
    lightVehicles: number
    heavyVehicles: number
    specializedEquipment: number
  }
  rates: {
    perKm: number
    baseRate: number
    emergencyRate: number
  }
  rating: number
  responseTime: string
  availability: "24/7" | "business-hours" | "on-call"
  status: "active" | "inactive"
  lastUsed?: string
}

export default function ExternalClientsPage() {
  const [clients, setClients] = useState<ExternalClient[]>([])
  const [subcontractors, setSubcontractors] = useState<Subcontractor[]>([])
  const [towingCompanies, setTowingCompanies] = useState<TowingCompany[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddClientOpen, setIsAddClientOpen] = useState(false)
  const [isAddSubcontractorOpen, setIsAddSubcontractorOpen] = useState(false)
  const [isAddTowingOpen, setIsAddTowingOpen] = useState(false)

  useEffect(() => {
    // Mock data - in real app, fetch from API
    setClients([
      {
        id: "1",
        companyName: "ABC Logistics",
        contactPerson: "John Smith",
        phone: "+27 11 123 4567",
        email: "john@abclogistics.co.za",
        address: "123 Industrial Street",
        city: "Johannesburg",
        province: "Gauteng",
        postalCode: "2000",
        clientType: "corporate",
        status: "active",
        rating: 4.8,
        totalJobs: 156,
        totalRevenue: 450000,
        averageJobValue: 2885,
        paymentTerms: "30 days",
        creditLimit: 100000,
        registrationDate: "2022-03-15",
        lastJobDate: "2024-01-15",
        preferredServices: ["Breakdown Recovery", "Maintenance", "Emergency Response"],
        contractType: "premium",
        accountManager: "Sarah Wilson",
      },
      {
        id: "2",
        companyName: "Quick Delivery Services",
        contactPerson: "Maria Santos",
        phone: "+27 21 987 6543",
        email: "maria@quickdelivery.co.za",
        address: "456 Commerce Road",
        city: "Cape Town",
        province: "Western Cape",
        postalCode: "8000",
        clientType: "sme",
        status: "active",
        rating: 4.5,
        totalJobs: 89,
        totalRevenue: 180000,
        averageJobValue: 2022,
        paymentTerms: "15 days",
        creditLimit: 50000,
        registrationDate: "2023-01-20",
        lastJobDate: "2024-01-10",
        preferredServices: ["Tire Service", "Battery Replacement", "Towing"],
        contractType: "standard",
        accountManager: "Mike Johnson",
      },
    ])

    setSubcontractors([
      {
        id: "1",
        companyName: "Elite Mobile Mechanics",
        contactPerson: "David Brown",
        phone: "+27 82 555 1234",
        email: "david@elitemechanics.co.za",
        specialties: ["Engine Repair", "Electrical Systems", "Hydraulics"],
        serviceAreas: ["Johannesburg", "Pretoria", "Sandton"],
        rating: 4.9,
        completedJobs: 234,
        responseTime: "15 min avg",
        hourlyRate: 450,
        availability: "available",
        certifications: ["ASE Certified", "Heavy Vehicle Specialist"],
        equipmentTypes: ["Mobile Workshop", "Diagnostic Equipment"],
        contractStatus: "active",
        lastActive: "2024-01-16T10:30:00Z",
      },
      {
        id: "2",
        companyName: "Rapid Recovery Services",
        contactPerson: "Lisa Davis",
        phone: "+27 84 777 9999",
        email: "lisa@rapidrecovery.co.za",
        specialties: ["Towing", "Recovery", "Accident Response"],
        serviceAreas: ["Cape Town", "Stellenbosch", "Paarl"],
        rating: 4.7,
        completedJobs: 189,
        responseTime: "12 min avg",
        hourlyRate: 380,
        availability: "busy",
        certifications: ["Recovery Specialist", "Crane Operator"],
        equipmentTypes: ["Recovery Truck", "Flatbed Trailer"],
        contractStatus: "active",
        lastActive: "2024-01-16T09:15:00Z",
      },
    ])

    setTowingCompanies([
      {
        id: "1",
        companyName: "24/7 Towing Solutions",
        contactPerson: "Peter Wilson",
        phone: "+27 11 555 0000",
        emergencyPhone: "+27 82 911 0000",
        email: "dispatch@247towing.co.za",
        serviceAreas: ["Johannesburg", "Sandton", "Randburg", "Midrand"],
        vehicleTypes: ["Light Vehicles", "Heavy Trucks", "Motorcycles"],
        capacity: {
          lightVehicles: 8,
          heavyVehicles: 4,
          specializedEquipment: 2,
        },
        rates: {
          perKm: 15,
          baseRate: 350,
          emergencyRate: 500,
        },
        rating: 4.6,
        responseTime: "18 min avg",
        availability: "24/7",
        status: "active",
        lastUsed: "2024-01-15T16:30:00Z",
      },
      {
        id: "2",
        companyName: "Highway Heroes Towing",
        contactPerson: "James Miller",
        phone: "+27 21 444 5555",
        emergencyPhone: "+27 83 911 5555",
        email: "ops@highwayheroes.co.za",
        serviceAreas: ["Cape Town", "N1 Highway", "N2 Highway"],
        vehicleTypes: ["All Vehicle Types", "Construction Equipment"],
        capacity: {
          lightVehicles: 6,
          heavyVehicles: 8,
          specializedEquipment: 4,
        },
        rates: {
          perKm: 18,
          baseRate: 400,
          emergencyRate: 600,
        },
        rating: 4.8,
        responseTime: "22 min avg",
        availability: "24/7",
        status: "active",
        lastUsed: "2024-01-14T14:20:00Z",
      },
    ])
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "available":
        return "bg-green-100 text-green-800"
      case "inactive":
      case "unavailable":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "busy":
        return "bg-orange-100 text-orange-800"
      case "suspended":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

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
      city: formData.get("city") as string,
      province: formData.get("province") as string,
      postalCode: formData.get("postalCode") as string,
      clientType: formData.get("clientType") as ExternalClient["clientType"],
      status: "pending",
      rating: 0,
      totalJobs: 0,
      totalRevenue: 0,
      averageJobValue: 0,
      paymentTerms: formData.get("paymentTerms") as string,
      creditLimit: Number.parseInt(formData.get("creditLimit") as string),
      registrationDate: new Date().toISOString(),
      preferredServices: [],
      contractType: "standard",
      accountManager: "Unassigned",
    }

    setClients((prev) => [...prev, newClient])
    setIsAddClientOpen(false)
    toast.success(`${newClient.companyName} has been added to the system`)
  }

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || client.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <>
      <div className="flex-1 space-y-4 p-4 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">External Network</h2>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="clients" className="space-y-4">
          <TabsList>
            <TabsTrigger value="clients">External Clients</TabsTrigger>
            <TabsTrigger value="subcontractors">Subcontractors</TabsTrigger>
            <TabsTrigger value="towing">Towing Companies</TabsTrigger>
            <TabsTrigger value="analytics">Network Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="clients" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Client Database</h3>
              <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Client
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New External Client</DialogTitle>
                    <DialogDescription>Enter client details to add them to the system</DialogDescription>
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
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" name="phone" type="tel" required />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" name="email" type="email" required />
                      </div>
                      <div>
                        <Label htmlFor="clientType">Client Type</Label>
                        <Select name="clientType" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="corporate">Corporate</SelectItem>
                            <SelectItem value="sme">SME</SelectItem>
                            <SelectItem value="individual">Individual</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="paymentTerms">Payment Terms</Label>
                        <Select name="paymentTerms" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select terms" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="immediate">Immediate</SelectItem>
                            <SelectItem value="15 days">15 Days</SelectItem>
                            <SelectItem value="30 days">30 Days</SelectItem>
                            <SelectItem value="60 days">60 Days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" name="address" required />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input id="city" name="city" required />
                      </div>
                      <div>
                        <Label htmlFor="province">Province</Label>
                        <Input id="province" name="province" required />
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input id="postalCode" name="postalCode" required />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="creditLimit">Credit Limit (R)</Label>
                      <Input id="creditLimit" name="creditLimit" type="number" required />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1">
                        Add Client
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setIsAddClientOpen(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {filteredClients.map((client) => (
                <Card key={client.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Building className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{client.companyName}</CardTitle>
                          <p className="text-sm text-gray-600">{client.contactPerson}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(client.status)}>{client.status.toUpperCase()}</Badge>
                        <Badge variant="outline">{client.clientType.toUpperCase()}</Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm">{client.rating}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <h4 className="font-semibold mb-2">Contact Information</h4>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{client.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{client.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">
                              {client.city}, {client.province}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Business Metrics</h4>
                        <div className="space-y-1">
                          <p className="text-sm">
                            <strong>Total Jobs:</strong> {client.totalJobs}
                          </p>
                          <p className="text-sm">
                            <strong>Revenue:</strong> R {client.totalRevenue.toLocaleString()}
                          </p>
                          <p className="text-sm">
                            <strong>Avg Job:</strong> R {client.averageJobValue.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Account Details</h4>
                        <div className="space-y-1">
                          <p className="text-sm">
                            <strong>Payment:</strong> {client.paymentTerms}
                          </p>
                          <p className="text-sm">
                            <strong>Credit Limit:</strong> R {client.creditLimit.toLocaleString()}
                          </p>
                          <p className="text-sm">
                            <strong>Manager:</strong> {client.accountManager}
                          </p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Service History</h4>
                        <div className="space-y-1">
                          <p className="text-sm">
                            <strong>Member Since:</strong> {new Date(client.registrationDate).toLocaleDateString()}
                          </p>
                          {client.lastJobDate && (
                            <p className="text-sm">
                              <strong>Last Job:</strong> {new Date(client.lastJobDate).toLocaleDateString()}
                            </p>
                          )}
                          <p className="text-sm">
                            <strong>Contract:</strong> {client.contractType}
                          </p>
                        </div>
                      </div>
                    </div>

                    {client.preferredServices.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Preferred Services</h4>
                        <div className="flex flex-wrap gap-1">
                          {client.preferredServices.map((service) => (
                            <Badge key={service} variant="secondary" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4 mr-2" />
                          Call
                        </Button>
                        <Button variant="outline" size="sm">
                          <Mail className="h-4 w-4 mr-2" />
                          Email
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          View History
                        </Button>
                      </div>
                      <Button size="sm">Edit Client</Button>
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
                    <DialogTitle>Add New Subcontractor</DialogTitle>
                    <DialogDescription>Enter subcontractor details</DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="subCompanyName">Company Name</Label>
                      <Input id="subCompanyName" required />
                    </div>
                    <div>
                      <Label htmlFor="subContactPerson">Contact Person</Label>
                      <Input id="subContactPerson" required />
                    </div>
                    <div>
                      <Label htmlFor="subPhone">Phone Number</Label>
                      <Input id="subPhone" type="tel" required />
                    </div>
                    <div>
                      <Label htmlFor="subEmail">Email Address</Label>
                      <Input id="subEmail" type="email" required />
                    </div>
                    <div>
                      <Label htmlFor="hourlyRate">Hourly Rate (R)</Label>
                      <Input id="hourlyRate" type="number" required />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button className="flex-1">Add Subcontractor</Button>
                    <Button variant="outline" onClick={() => setIsAddSubcontractorOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {subcontractors.map((sub) => (
                <Card key={sub.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{sub.companyName}</CardTitle>
                        <p className="text-sm text-gray-600">{sub.contactPerson}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(sub.availability)}>{sub.availability.toUpperCase()}</Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm">{sub.rating}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Contact</h4>
                        <p className="text-sm">{sub.phone}</p>
                        <p className="text-sm">{sub.email}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Performance</h4>
                        <p className="text-sm">
                          <strong>Jobs:</strong> {sub.completedJobs}
                        </p>
                        <p className="text-sm">
                          <strong>Response:</strong> {sub.responseTime}
                        </p>
                        <p className="text-sm">
                          <strong>Rate:</strong> R {sub.hourlyRate}/hr
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Specialties</h4>
                      <div className="flex flex-wrap gap-1">
                        {sub.specialties.map((specialty) => (
                          <Badge key={specialty} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Service Areas</h4>
                      <div className="flex flex-wrap gap-1">
                        {sub.serviceAreas.map((area) => (
                          <Badge key={area} variant="outline" className="text-xs">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Phone className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                      <Button size="sm" className="flex-1">
                        Assign Job
                      </Button>
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
                    <DialogTitle>Add New Towing Company</DialogTitle>
                    <DialogDescription>Enter towing company details</DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="towCompanyName">Company Name</Label>
                      <Input id="towCompanyName" required />
                    </div>
                    <div>
                      <Label htmlFor="towContactPerson">Contact Person</Label>
                      <Input id="towContactPerson" required />
                    </div>
                    <div>
                      <Label htmlFor="towPhone">Phone Number</Label>
                      <Input id="towPhone" type="tel" required />
                    </div>
                    <div>
                      <Label htmlFor="towEmergencyPhone">Emergency Phone</Label>
                      <Input id="towEmergencyPhone" type="tel" required />
                    </div>
                    <div>
                      <Label htmlFor="towEmail">Email Address</Label>
                      <Input id="towEmail" type="email" required />
                    </div>
                    <div>
                      <Label htmlFor="baseRate">Base Rate (R)</Label>
                      <Input id="baseRate" type="number" required />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button className="flex-1">Add Towing Company</Button>
                    <Button variant="outline" onClick={() => setIsAddTowingOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {towingCompanies.map((company) => (
                <Card key={company.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{company.companyName}</CardTitle>
                        <p className="text-sm text-gray-600">{company.contactPerson}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(company.status)}>{company.status.toUpperCase()}</Badge>
                        <Badge variant="outline">{company.availability}</Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm">{company.rating}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <h4 className="font-semibold mb-2">Contact Information</h4>
                        <div className="space-y-1">
                          <p className="text-sm">
                            <strong>Phone:</strong> {company.phone}
                          </p>
                          <p className="text-sm">
                            <strong>Emergency:</strong> {company.emergencyPhone}
                          </p>
                          <p className="text-sm">
                            <strong>Email:</strong> {company.email}
                          </p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Capacity</h4>
                        <div className="space-y-1">
                          <p className="text-sm">
                            <strong>Light:</strong> {company.capacity.lightVehicles} units
                          </p>
                          <p className="text-sm">
                            <strong>Heavy:</strong> {company.capacity.heavyVehicles} units
                          </p>
                          <p className="text-sm">
                            <strong>Special:</strong> {company.capacity.specializedEquipment} units
                          </p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Rates</h4>
                        <div className="space-y-1">
                          <p className="text-sm">
                            <strong>Base:</strong> R {company.rates.baseRate}
                          </p>
                          <p className="text-sm">
                            <strong>Per KM:</strong> R {company.rates.perKm}
                          </p>
                          <p className="text-sm">
                            <strong>Emergency:</strong> R {company.rates.emergencyRate}
                          </p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Performance</h4>
                        <div className="space-y-1">
                          <p className="text-sm">
                            <strong>Response:</strong> {company.responseTime}
                          </p>
                          <p className="text-sm">
                            <strong>Availability:</strong> {company.availability}
                          </p>
                          {company.lastUsed && (
                            <p className="text-sm">
                              <strong>Last Used:</strong> {new Date(company.lastUsed).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Service Areas</h4>
                      <div className="flex flex-wrap gap-1">
                        {company.serviceAreas.map((area) => (
                          <Badge key={area} variant="outline" className="text-xs">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Vehicle Types</h4>
                      <div className="flex flex-wrap gap-1">
                        {company.vehicleTypes.map((type) => (
                          <Badge key={type} variant="secondary" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                      <Button variant="outline" size="sm">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Emergency
                      </Button>
                      <Button size="sm">Request Service</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{clients.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {clients.filter((c) => c.status === "active").length} active
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    R {clients.reduce((sum, c) => sum + c.totalRevenue, 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">From external clients</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Network Partners</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{subcontractors.length + towingCompanies.length}</div>
                  <p className="text-xs text-muted-foreground">Subcontractors & towing companies</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">16 min</div>
                  <p className="text-xs text-muted-foreground">Network average</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Clients</CardTitle>
                  <CardDescription>Ranked by total revenue</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {clients
                      .sort((a, b) => b.totalRevenue - a.totalRevenue)
                      .slice(0, 5)
                      .map((client, index) => (
                        <div key={client.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="font-semibold">#{index + 1}</span>
                            <div>
                              <p className="font-medium">{client.companyName}</p>
                              <p className="text-sm text-gray-500">{client.totalJobs} jobs</p>
                            </div>
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
                  <CardDescription>Subcontractor and towing company metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Subcontractor Availability</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Available</span>
                          <span className="text-sm font-medium">
                            {subcontractors.filter((s) => s.availability === "available").length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Busy</span>
                          <span className="text-sm font-medium">
                            {subcontractors.filter((s) => s.availability === "busy").length}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Towing Capacity</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Light Vehicles</span>
                          <span className="text-sm font-medium">
                            {towingCompanies.reduce((sum, c) => sum + c.capacity.lightVehicles, 0)} units
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Heavy Vehicles</span>
                          <span className="text-sm font-medium">
                            {towingCompanies.reduce((sum, c) => sum + c.capacity.heavyVehicles, 0)} units
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
