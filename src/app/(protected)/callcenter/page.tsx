"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Phone, Clock, AlertTriangle, Search } from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

interface Breakdown {
  id: string
  order_no: string
  driver_name: string
  driver_phone: string
  registration: string
  location: string
  coordinates: { lat: number; lng: number }
  issue: string
  status: "pending" | "dispatched" | "in-progress" | "completed" | "cancelled"
  priority: "low" | "medium" | "high" | "emergency"
  created_at: string
  assigned_tech?: string
  estimated_time?: string
}

interface Technician {
  id: string
  name: string
  phone: string
  location: string
  availability: string
  specialties: string[]
}

export default function CallCenterPage() {
  const [breakdowns, setBreakdowns] = useState<Breakdown[]>([])
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [selectedBreakdown, setSelectedBreakdown] = useState<Breakdown | null>(null)
  const [isDispatchDialogOpen, setIsDispatchDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const supabase = createClient()
  useEffect(() => {
    const getBreakdowns = async () => {
      const { data: breakdowns, error } = await supabase.from('breakdowns').select('*')
      if (error) {
        console.error(error)
      } else {
        setBreakdowns(breakdowns as unknown as Breakdown[])
      }
    }

    const getTechnicians = async () => {
      const { data: technicians, error } = await supabase.from('technicians').select('*')
      if (error) {
        console.error(error)
      } else {
        setTechnicians(technicians as unknown as Technician[])
      }
    }
    getTechnicians()
    getBreakdowns()

    // Mock data - in real app, fetch from API
    // setBreakdowns([
    //   {
    //     id: "1",
    //     order_no: "OR.128651312",
    //     driverName: "John Smith",
    //     driverPhone: "+27 82 123 4567",
    //     vehicleReg: "ABC 123 GP",
    //     location: "N1 Highway, Johannesburg",
    //     coordinates: { lat: -26.2041, lng: 28.0473 },
    //     description: "Engine overheating, steam coming from radiator",
    //     status: "pending",
    //     priority: "high",
    //     createdAt: "2025-01-15 14:30",
    //   },
    //   {
    //     id: "2",
    //     order_no: "OR.128651313",
    //     driverName: "Sarah Johnson",
    //     driverPhone: "+27 83 987 6543",
    //     vehicleReg: "XYZ 789 GP",
    //     location: "M1 Highway, Sandton",
    //     coordinates: { lat: -26.1076, lng: 28.0567 },
    //     description: "Flat tire, no spare available",
    //     status: "dispatched",
    //     priority: "medium",
    //     createdAt: "2025-01-15 15:45",
    //     assignedTech: "Mike Wilson",
    //     estimatedTime: "45 minutes",
    //   },
    // ])

    // setTechnicians([
    //   {
    //     id: "1",
    //     name: "Mike Wilson",
    //     phone: "+27 84 111 2222",
    //     location: "Sandton",
    //     status: false,
    //     specialties: ["Engine Repair", "Tire Service"],
    //   },
    //   {
    //     id: "2",
    //     name: "David Brown",
    //     phone: "+27 85 333 4444",
    //     location: "Johannesburg CBD",
    //     status: true,
    //     specialties: ["Electrical", "Battery Service"],
    //   },
    //   {
    //     id: "3",
    //     name: "Lisa Davis",
    //     phone: "+27 86 555 6666",
    //     location: "Randburg",
    //     status: true,
    //     specialties: ["Towing", "Recovery"],
    //   },
    // ])
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "dispatched":
        return "bg-blue-100 text-blue-800"
      case "in-progress":
        return "bg-orange-100 text-orange-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
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

  const handleDispatchTechnician = (breakdownId: string, techId: string) => {
    const tech = technicians.find((t) => t.id === techId)
    if (tech) {
      setBreakdowns((prev) =>
        prev.map((b) =>
          b.id === breakdownId
            ? { ...b, status: "dispatched", assignedTech: tech.name, estimatedTime: "30-60 minutes" }
            : b,
        ),
      )
      setTechnicians((prev) => prev.map((t) => (t.id === techId ? { ...t, available: false } : t)))
      toast.success(`${tech.name} has been assigned to breakdown ${breakdowns.find((b) => b.id === breakdownId)?.order_no}`)
      setIsDispatchDialogOpen(false)
    }
  }

  const filteredBreakdowns = breakdowns.filter(
    (breakdown) =>
      breakdown.order_no ||
      breakdown.driver_name ||
      breakdown.registration,
  )

  return (
    <>
      <div className="flex-1 space-y-4 p-4 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Breakdown Management</h2>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search breakdowns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
          </div>
        </div>

        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">Breakdowns</TabsTrigger>
            <TabsTrigger value="technicians">Technicians</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            <div className="grid gap-4">
              {filteredBreakdowns.map((breakdown) => (
                <Card key={breakdown.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-orange-500" />
                          <CardTitle className="text-lg">{breakdown.order_no}</CardTitle>
                        </div>
                        <Badge className={getPriorityColor(breakdown.priority)}>
                          {breakdown.priority}
                        </Badge>
                        <Badge className={getStatusColor(breakdown.status)}>
                          {breakdown.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-500">{breakdown.created_at}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Driver Information</h4>
                        <p className="text-sm">
                          <strong>Name:</strong> {breakdown.driver_name}
                        </p>
                        <p className="text-sm">
                          <strong>Phone:</strong> {breakdown.driver_phone}
                        </p>
                        <p className="text-sm">
                          <strong>Vehicle:</strong> {breakdown.registration}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Location</h4>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-red-500 mt-0.5" />
                          <p className="text-sm">{breakdown.location}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Issue Description</h4>
                        <p className="text-sm text-gray-600">{breakdown.issue}</p>
                        {breakdown.assigned_tech && (
                          <div className="mt-2">
                            <p className="text-sm">
                              <strong>Assigned:</strong> {breakdown.assigned_tech}
                            </p>
                            <p className="text-sm">
                              <strong>ETA:</strong> {breakdown.estimated_time}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4 mr-2" />
                        Call Driver
                      </Button>
                      {breakdown.status === "pending" && (
                        <Dialog open={isDispatchDialogOpen} onOpenChange={setIsDispatchDialogOpen}>
                          <DialogTrigger asChild>
                            <Button size="sm" onClick={() => setSelectedBreakdown(breakdown)}>
                              Dispatch Technician
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Dispatch Technician</DialogTitle>
                              <DialogDescription>
                                Select an available technician for breakdown {selectedBreakdown?.order_no}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              {technicians
                                .filter((t) => t.availability)
                                .map((tech) => (
                                  <Card
                                    key={tech.id}
                                    className="cursor-pointer hover:bg-gray-50"
                                    onClick={() => handleDispatchTechnician(selectedBreakdown?.id || "", tech.id)}
                                  >
                                    <CardContent className="p-4">
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <h4 className="font-semibold">{tech.name}</h4>
                                          <p className="text-sm text-gray-600">{tech.phone}</p>
                                          <p className="text-sm text-gray-600">Location: {tech.location}</p>
                                          <div className="flex gap-1 mt-2">
                                            {tech.specialties.map((specialty) => (
                                              <Badge key={specialty} variant="secondary" className="text-xs">
                                                {specialty}
                                              </Badge>
                                            ))}
                                          </div>
                                        </div>
                                        <Badge className="bg-green-100 text-green-800">Available</Badge>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="technicians" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {technicians.map((tech) => (
                <Card key={tech.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{tech.name}</CardTitle>
                      <Badge className={tech.availability === "available" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                        {tech.availability}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">
                      <strong>Phone:</strong> {tech.phone}
                    </p>
                    <p className="text-sm mb-3">
                      <strong>Location:</strong> {tech.location}
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Specialties:</h4>
                      <div className="flex flex-wrap gap-1">
                        {tech.specialties.map((specialty) => (
                          <Badge key={specialty} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="map" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Breakdown Locations</CardTitle>
                <CardDescription>Real-time map view of active breakdowns and technician locations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Interactive map would be integrated here</p>
                    <p className="text-sm text-gray-400 mt-2">Showing {breakdowns.length} active breakdowns</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
