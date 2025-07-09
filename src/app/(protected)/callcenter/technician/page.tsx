"use client"

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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Users,
  Phone,
  MapPin,
  Star,
  Clock,
  CheckCircle,
  Search,
  Plus,
  User,
  Wrench,
  Battery,
  Zap,
  Settings,
} from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

interface Technician {
  id: string
  name: string
  phone: string
  email: string
  location: string
  coordinates: { lat: number; lng: number }
  availability: "available" | "busy" | "off-duty" | "emergency"
  specialties: string[]
  skillLevels: {
    electrical: number
    mechanical: number
    hydraulic: number
    diagnostic: number
  }
  rating: number
  // completedJobs: number
  // responseTime: string
  currentJob?: string
  joinDate: string
  certifications: string[]
  vehicleType: string
  equipmentLevel: "basic" | "advanced" | "specialist"
}

interface JobAssignment {
  id: string
  orderNo: string
  description: string
  location: string
  priority: "low" | "medium" | "high" | "emergency"
  requiredSkills: string[]
  estimatedDuration: string
  driverName: string
  vehicleReg: string
}

export default function TechniciansPage() {
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [availableJobs, setAvailableJobs] = useState<JobAssignment[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null)
  const [selectedJob, setSelectedJob] = useState<JobAssignment | null>(null)
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [isAddTechnicianOpen, setIsAddTechnicianOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const getTechnicians = async () => {
      const { data: technicians, error } = await supabase.from('technicians').select('*')
      if (error) {
        console.error(error)
      } else {
        setTechnicians((technicians || []) as unknown as Technician[])
        console.log(technicians)
      }
    }
    getTechnicians()

    setAvailableJobs([
      {
        id: "1",
        orderNo: "JOB-2024-004",
        description: "Battery replacement needed - truck won't start",
        location: "Midrand Industrial",
        priority: "medium",
        requiredSkills: ["Electrical", "Battery Service"],
        estimatedDuration: "1 hour",
        driverName: "Peter Johnson",
        vehicleReg: "GHI 789 GP",
      },
      {
        id: "2",
        orderNo: "JOB-2024-005",
        description: "Hydraulic system failure - crane not operating",
        location: "Kempton Park",
        priority: "high",
        requiredSkills: ["Hydraulic", "Diagnostic"],
        estimatedDuration: "3 hours",
        driverName: "Mary Smith",
        vehicleReg: "JKL 012 GP",
      },
      {
        id: "3",
        orderNo: "JOB-2024-006",
        description: "Emergency recovery - vehicle accident on highway",
        location: "N3 Highway",
        priority: "emergency",
        requiredSkills: ["Towing", "Recovery"],
        estimatedDuration: "2 hours",
        driverName: "Emergency Services",
        vehicleReg: "MNO 345 GP",
      },
    ])
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "busy":
        return "bg-orange-100 text-orange-800"
      case "off-duty":
        return "bg-gray-100 text-gray-800"
      case "emergency":
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

  const getSkillIcon = (skill: string) => {
    switch (skill.toLowerCase()) {
      case "electrical":
        return <Zap className="h-4 w-4" />
      case "mechanical":
        return <Wrench className="h-4 w-4" />
      case "battery service":
        return <Battery className="h-4 w-4" />
      case "diagnostic":
        return <Settings className="h-4 w-4" />
      default:
        return <Wrench className="h-4 w-4" />
    }
  }

  const calculateJobMatch = (technician: Technician, job: JobAssignment) => {
    const skillMatches = job.requiredSkills.filter((skill) =>
      technician.specialties.some((specialty) => specialty.toLowerCase().includes(skill.toLowerCase())),
    ).length

    const skillMatchPercentage = (skillMatches / job.requiredSkills.length) * 100
    const locationScore = 100 // Simplified - in real app, calculate distance
    const availabilityScore = technician.availability === "available" ? 100 : 0

    return Math.round(skillMatchPercentage * 0.5 + locationScore * 0.3 + availabilityScore * 0.2)
  }

  const handleAssignJob = (technicianId: string, jobId: string) => {
    const technician = technicians.find((t) => t.id === technicianId)
    const job = availableJobs.find((j) => j.id === jobId)

    if (technician && job) {
      setTechnicians((prev) =>
        prev.map((t) => (t.id === technicianId ? { ...t, status: "busy", currentJob: job.orderNo } : t)),
      )

      setAvailableJobs((prev) => prev.filter((j) => j.id !== jobId))

      toast.success(`${job.orderNo} assigned to ${technician.name}`)

      setIsAssignDialogOpen(false)
    }
  }

  const filteredTechnicians = technicians.filter((tech) => {
    const matchesSearch =
      tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.specialties.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || tech.availability === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <>
      <div className="flex-1 space-y-4 p-4 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Technicians</h2>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search technicians..."
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
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
                <SelectItem value="off-duty">Off Duty</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={isAddTechnicianOpen} onOpenChange={setIsAddTechnicianOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Technician
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Technician</DialogTitle>
                  <DialogDescription>Enter technician details to add them to the system</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Enter full name" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="+27 XX XXX XXXX" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="email@company.com" />
                  </div>
                  <div>
                    <Label htmlFor="location">Base Location</Label>
                    <Input id="location" placeholder="City/Area" />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button className="flex-1">Add Technician</Button>
                  <Button variant="outline" onClick={() => setIsAddTechnicianOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="directory" className="space-y-4">
          <TabsList>
            <TabsTrigger value="directory">Technician Directory</TabsTrigger>
            <TabsTrigger value="assignments">Job Assignments</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="directory" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTechnicians.map((technician) => (
                <Card key={technician.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{technician.name}</CardTitle>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm text-gray-600">{technician.rating}</span>
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(technician.availability)}>
                        {technician.availability}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{technician.phone}</span>
                        <Button size="sm" variant="outline" className="ml-auto bg-transparent">
                          Call
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{technician.location}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Specialties</h4>
                      <div className="flex flex-wrap gap-1">
                        {technician.specialties.map((specialty) => (
                          <Badge key={specialty} variant="secondary" className="text-xs">
                            {getSkillIcon(specialty)}
                            <span className="ml-1">{specialty}</span>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Skill Levels</h4>
                      <div className="space-y-2">
                        {technician.skillLevels && Object.entries(technician.skillLevels).map(([skill, level]) => (
                          <div key={skill} className="flex items-center justify-between">
                            <span className="text-sm capitalize">{skill}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${level}%` }}></div>
                              </div>
                              <span className="text-xs text-gray-500">{level}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Completed Jobs</span>
                          <p className="font-semibold">{technician.completedJobs}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Response Time</span>
                          <p className="font-semibold">{technician.responseTime}</p>
                        </div>
                      </div> */}

                    {technician.currentJob && (
                      <div className="bg-orange-50 p-3 rounded-md">
                        <p className="text-sm font-medium">Current Job</p>
                        <p className="text-sm text-gray-600">{technician.currentJob}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <MapPin className="h-4 w-4 mr-1" />
                        Track
                      </Button>
                      {technician.availability === "available" && (
                        <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
                          <DialogTrigger asChild>
                            <Button size="sm" className="flex-1" onClick={() => setSelectedTechnician(technician)}>
                              Assign Job
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Assign Job to {selectedTechnician?.name}</DialogTitle>
                              <DialogDescription>Select a job to assign to this technician</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              {availableJobs.map((job) => {
                                const matchScore = selectedTechnician ? calculateJobMatch(selectedTechnician, job) : 0
                                return (
                                  <Card
                                    key={job.id}
                                    className="cursor-pointer hover:bg-gray-50"
                                    onClick={() => {
                                      setSelectedJob(job)
                                      handleAssignJob(selectedTechnician?.id || "", job.id)
                                    }}
                                  >
                                    <CardContent className="p-4">
                                      <div className="flex justify-between items-start mb-2">
                                        <div>
                                          <h4 className="font-semibold">{job.orderNo}</h4>
                                          <p className="text-sm text-gray-600">{job.description}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Badge className={getPriorityColor(job.priority)}>
                                            {job.priority.toUpperCase()}
                                          </Badge>
                                          <Badge variant="outline">{matchScore}% Match</Badge>
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                          <span className="text-gray-500">Location:</span>
                                          <p>{job.location}</p>
                                        </div>
                                        <div>
                                          <span className="text-gray-500">Duration:</span>
                                          <p>{job.estimatedDuration}</p>
                                        </div>
                                      </div>
                                      <div className="mt-2">
                                        <span className="text-gray-500 text-sm">Required Skills:</span>
                                        <div className="flex gap-1 mt-1">
                                          {job.requiredSkills.map((skill) => (
                                            <Badge key={skill} variant="secondary" className="text-xs">
                                              {skill}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                )
                              })}
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

          <TabsContent value="assignments" className="space-y-4">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Available Jobs</CardTitle>
                  <CardDescription>Jobs waiting for technician assignment</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Job ID</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Required Skills</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Best Match</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {availableJobs.map((job) => {
                        const bestMatch = technicians
                          .filter((t) => t.availability === "available")
                          .map((t) => ({ technician: t, score: calculateJobMatch(t, job) }))
                          .sort((a, b) => b.score - a.score)[0]

                        return (
                          <TableRow key={job.id}>
                            <TableCell className="font-medium">{job.orderNo}</TableCell>
                            <TableCell>{job.description}</TableCell>
                            <TableCell>{job.location}</TableCell>
                            <TableCell>
                              <Badge className={getPriorityColor(job.priority)}>{job.priority.toUpperCase()}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                {job.requiredSkills.map((skill) => (
                                  <Badge key={skill} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>{job.estimatedDuration}</TableCell>
                            <TableCell>
                              {bestMatch && (
                                <div className="text-sm">
                                  <p className="font-medium">{bestMatch.technician.name}</p>
                                  <p className="text-gray-500">{bestMatch.score}% match</p>
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              {bestMatch && (
                                <Button size="sm" onClick={() => handleAssignJob(bestMatch.technician.id, job.id)}>
                                  Auto Assign
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Technicians</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{technicians.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {technicians.filter((t) => t.availability === "available").length} available
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(technicians.reduce((sum, t) => sum + t.rating, 0) / technicians.length).toFixed(1)}
                  </div>
                  <p className="text-xs text-muted-foreground">Across all technicians</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Jobs Completed</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                {/* <CardContent>
                    <div className="text-2xl font-bold">{technicians.reduce((sum, t) => sum + t.completedJobs, 0)}</div>
                    <p className="text-xs text-muted-foreground">Total completed jobs</p>
                  </CardContent> */}
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">13 min</div>
                  <p className="text-xs text-muted-foreground">Average response time</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Technician Performance Ranking</CardTitle>
                <CardDescription>Ranked by overall performance score</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Completed Jobs</TableHead>
                      <TableHead>Response Time</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {technicians
                      .sort((a, b) => b.rating - a.rating)
                      .map((technician, index) => (
                        <TableRow key={technician.id}>
                          <TableCell className="font-medium">#{index + 1}</TableCell>
                          <TableCell>{technician.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              {technician.rating}
                            </div>
                          </TableCell>
                          {/* <TableCell>{technician.completedJobs}</TableCell>
                            <TableCell>{technician.responseTime}</TableCell> */}
                          <TableCell>
                            <Badge className={getStatusColor(technician.availability)}>
                              {technician.availability}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
