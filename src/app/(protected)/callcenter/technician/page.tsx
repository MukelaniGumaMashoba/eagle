"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import { assignJob } from "@/lib/action/assign"

interface Technician {
  id: number
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
  }[]
  rating: number
  // completedJobs: number
  // responseTime: string
  job_allocation?: JobAssignment
  joinDate: string
  certifications: string[]
  vehicleType: string
  equipmentLevel: "basic" | "advanced" | "specialist"
}

interface JobAssignment {
  id: number
  job_id: string
  description: string
  location: string
  priority: "low" | "medium" | "high" | "emergency"
  status: "pending" | "assigned" | "in-progress" | "awaiting-approval" | "approved" | "completed" | "cancelled"
  assigned_technician?: string
  created_at: string
  updated_at?: string
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

  const refreshData = async () => {
    // Fetch technicians with their job allocations
    const getTechnicians = async () => {
      const { data: technicians, error } = await supabase
        .from('technicians')
        .select(`
          *,
          job_allocation:job_assignments!job_assignments_technician_id_fkey(*)
        `)
        .eq('availability', 'available')
      if (error) {
        console.error('Error fetching technicians:', error)
      } else {
        setTechnicians((technicians || []) as unknown as Technician[])
        console.log('Technicians:', technicians)
      }
    }
    getTechnicians()

    // Fetch available jobs (not assigned to any technician)
    const getAvailableJobs = async () => {
      const { data: jobs, error } = await supabase
        .from('job_assignments')
        .select('*')
        .is('technician_id', null)
      if (error) {
        console.error('Error fetching available jobs:', error)
      } else {
        setAvailableJobs((jobs || []) as unknown as JobAssignment[])
        console.log('Available jobs:', jobs)
      }
    }
    getAvailableJobs()
  }

  useEffect(() => {
    refreshData()
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
    switch (skill) {
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
    // Simplified matching since we don't have requiredSkills in the database
    const locationScore = 100 // Simplified - in real app, calculate distance
    const availabilityScore = technician.availability === "available" ? 100 : 0

    return Math.round(locationScore * 0.5 + availabilityScore * 0.5)
  }

  const handleAssignJob = async () => {
    try {
      // const { data, error } = await assignJob(selectedJob)

    } catch (error) {
      console.error('Error assigning job:', error)
      toast.error("Failed to assign job")
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
            {/* <TabsTrigger value="assignments">Job Assignments</TabsTrigger> */}
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
                          <div>
                            <p>{technician.id}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            {/* <span className="text-sm text-gray-600">{technician.rating}</span> */}
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
                              {/* <span className="text-xs text-gray-500">{level}%</span> */}
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

                    {technician.job_allocation && (
                      <div className="bg-orange-50 p-3 rounded-md">
                        <p className="text-sm font-medium">Current Job</p>
                        <p className="text-sm text-gray-600">{technician.job_allocation.job_id}</p>
                        <p className="text-sm text-gray-600">{technician.job_allocation.id}</p>
                        {/* <Button
                          size="sm"
                          variant="outline"
                          className="mt-2 w-full"
                        // onClick={() => handleUnassignJob(technician.id.toString())}
                        >
                           Job
                        </Button> */}
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
                                return (
                                  <Card
                                    key={job.id}
                                    className="hover:bg-gray-50"
                                  >
                                    <CardContent className="p-4">
                                      <div className="flex justify-between items-start mb-2">
                                        <div>
                                          <h4 className="font-semibold">{job.job_id}</h4>
                                          <p className="text-sm text-gray-600">{job.description}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Badge className={getPriorityColor(job.priority)}>
                                            {job.priority}
                                          </Badge>
                                          {/* <Badge variant="outline">{matchScore}% Match</Badge> */}
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                          <span className="text-gray-500">Location:</span>
                                          <p>{job.location}</p>
                                        </div>
                                        <div>
                                          <span className="text-gray-500">Duration:</span>
                                          <p>Estimated time not available</p>
                                        </div>
                                      </div>
                                      {/* <div className="mt-2">
                                        <span className="text-gray-500 text-sm">Required Skills:</span>
                                        <div className="flex gap-1 mt-1">
                                          {job.requiredSkills.map((skill) => (
                                            <Badge key={skill} variant="secondary" className="text-xs">
                                              {skill}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div> */}

                                      <CardFooter className="mt-2">
                                        <Button variant={"outline"} className="bg-transparent"
                                          onClick={async () => {
                                            if (!selectedTechnician) {
                                              toast.error("No technician selected");
                                              return;
                                            }
                                            if (!job) {
                                              toast.error("No job selected");
                                              return;
                                            }
                                            try {
                                              const result = await assignJob({ ...job, accepted: true }, selectedTechnician.id);
                                              console.log("Result:", result);
                                              console.log("Selected job:", job);
                                              console.log("Selected technician:", selectedTechnician);


                                              if ('error' in result && result.error) {
                                                toast.error("Error assigning job:" + result.error);
                                              }
                                              else {
                                                toast.success("Job assigned successfully")
                                                refreshData()
                                                setIsAssignDialogOpen(false)
                                              }
                                            }
                                            catch (error) {
                                              console.error("Error assigning job:", error)
                                            }
                                          }}
                                        >
                                          Assign
                                        </Button>
                                      </CardFooter>
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

          {/* <TabsContent value="assignments" className="space-y-4">
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
                            <TableCell className="font-medium">{job.job_id}</TableCell>
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
          </TabsContent> */}

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
