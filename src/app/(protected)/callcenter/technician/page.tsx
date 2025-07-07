"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import {
    Users,
    Plus,
    Phone,
    MapPin,
    Clock,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Star,
    Navigation,
    Edit,
} from "lucide-react"
import { toast } from "sonner"

interface Technician {
    id: string
    name: string
    phone: string
    email: string
    location: string
    coordinates: { lat: number; lng: number }
    status: "available" | "busy" | "off-duty" | "emergency"
    specialties: string[]
    rating: number
    completedJobs: number
    currentJob?: string
    estimatedAvailable?: string
    skills: {
        electrical: number
        mechanical: number
        hydraulic: number
        diagnostic: number
    }
    certifications: string[]
    joinDate: string
    lastActive: string
}

interface PendingJob {
    id: string
    orderNo: string
    driverName: string
    vehicleReg: string
    location: string
    coordinates: { lat: number; lng: number }
    description: string
    urgency: "low" | "medium" | "high" | "emergency"
    requiredSkills: string[]
    estimatedDuration: string
    createdAt: string
    distance?: number
}

interface JobAssignment {
    id: string
    technicianId: string
    jobId: string
    assignedAt: string
    estimatedArrival: string
    status: "assigned" | "en-route" | "on-site" | "completed"
}

export default function TechniciansPage() {
    const [technicians, setTechnicians] = useState<Technician[]>([])
    const [pendingJobs, setPendingJobs] = useState<PendingJob[]>([])
    const [assignments, setAssignments] = useState<JobAssignment[]>([])
    const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null)
    const [selectedJob, setSelectedJob] = useState<PendingJob | null>(null)
    const [isAddTechnicianOpen, setIsAddTechnicianOpen] = useState(false)
    const [isAssignJobOpen, setIsAssignJobOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterStatus, setFilterStatus] = useState<string>("all")
    useEffect(() => {
        // Mock data for technicians
        setTechnicians([
            {
                id: "1",
                name: "Mike Wilson",
                phone: "+27 84 111 2222",
                email: "mike.wilson@company.com",
                location: "Sandton",
                coordinates: { lat: -26.1076, lng: 28.0567 },
                status: "busy",
                specialties: ["Engine Repair", "Tire Service", "Electrical"],
                rating: 4.8,
                completedJobs: 156,
                currentJob: "OR.128651313",
                estimatedAvailable: "16:30",
                skills: {
                    electrical: 85,
                    mechanical: 92,
                    hydraulic: 78,
                    diagnostic: 88,
                },
                certifications: ["ASE Certified", "Mercedes Specialist", "Safety Level 1"],
                joinDate: "2022-03-15",
                lastActive: "2024-01-15 14:30",
            },
            {
                id: "2",
                name: "David Brown",
                phone: "+27 85 333 4444",
                email: "david.brown@company.com",
                location: "Johannesburg CBD",
                coordinates: { lat: -26.2041, lng: 28.0473 },
                status: "available",
                specialties: ["Electrical", "Battery Service", "Diagnostic"],
                rating: 4.6,
                completedJobs: 89,
                skills: {
                    electrical: 95,
                    mechanical: 72,
                    hydraulic: 65,
                    diagnostic: 91,
                },
                certifications: ["Electrical Specialist", "Bosch Certified"],
                joinDate: "2023-01-20",
                lastActive: "2024-01-15 15:45",
            },
            {
                id: "3",
                name: "Lisa Davis",
                phone: "+27 86 555 6666",
                email: "lisa.davis@company.com",
                location: "Randburg",
                coordinates: { lat: -26.0939, lng: 28.0021 },
                status: "available",
                specialties: ["Towing", "Recovery", "Heavy Vehicle"],
                rating: 4.9,
                completedJobs: 203,
                skills: {
                    electrical: 68,
                    mechanical: 89,
                    hydraulic: 94,
                    diagnostic: 75,
                },
                certifications: ["Heavy Vehicle License", "Crane Operator", "Safety Level 2"],
                joinDate: "2021-08-10",
                lastActive: "2024-01-15 15:20",
            },
            {
                id: "4",
                name: "James Smith",
                phone: "+27 87 777 8888",
                email: "james.smith@company.com",
                location: "Pretoria",
                coordinates: { lat: -25.7479, lng: 28.2293 },
                status: "off-duty",
                specialties: ["Transmission", "Engine Rebuild", "Diagnostic"],
                rating: 4.7,
                completedJobs: 134,
                skills: {
                    electrical: 80,
                    mechanical: 96,
                    hydraulic: 85,
                    diagnostic: 93,
                },
                certifications: ["Master Technician", "Volvo Specialist"],
                joinDate: "2022-11-05",
                lastActive: "2024-01-15 17:00",
            },
        ])

        setPendingJobs([
            {
                id: "1",
                orderNo: "OR.128651314",
                driverName: "Peter Johnson",
                vehicleReg: "DEF 456 GP",
                location: "N3 Highway, Germiston",
                coordinates: { lat: -26.2309, lng: 28.1647 },
                description: "Electrical fault - dashboard warning lights, engine cutting out",
                urgency: "high",
                requiredSkills: ["Electrical", "Diagnostic"],
                estimatedDuration: "2-3 hours",
                createdAt: "2024-01-15 15:30",
                distance: 12.5,
            },
            {
                id: "2",
                orderNo: "OR.128651315",
                driverName: "Mary Williams",
                vehicleReg: "GHI 789 GP",
                location: "R21 Highway, Kempton Park",
                coordinates: { lat: -26.1225, lng: 28.2314 },
                description: "Hydraulic system failure - trailer cannot be lifted",
                urgency: "medium",
                requiredSkills: ["Hydraulic", "Heavy Vehicle"],
                estimatedDuration: "3-4 hours",
                createdAt: "2024-01-15 14:45",
                distance: 18.3,
            },
            {
                id: "3",
                orderNo: "OR.128651316",
                driverName: "Robert Davis",
                vehicleReg: "JKL 012 GP",
                location: "M1 Highway, Midrand",
                coordinates: { lat: -25.9953, lng: 28.1294 },
                description: "Engine overheating - coolant leak, steam visible",
                urgency: "emergency",
                requiredSkills: ["Engine Repair", "Cooling System"],
                estimatedDuration: "4-6 hours",
                createdAt: "2024-01-15 16:00",
                distance: 8.7,
            },
        ])

        setAssignments([
            {
                id: "1",
                technicianId: "1",
                jobId: "existing-job",
                assignedAt: "2024-01-15 13:30",
                estimatedArrival: "2024-01-15 16:30",
                status: "on-site",
            },
        ])
    }, [])

    const handleAssignJob = (technicianId: string, jobId: string) => {
        const technician = technicians.find((t) => t.id === technicianId)
        const job = pendingJobs.find((j) => j.id === jobId)

        if (technician && job) {
            // Create new assignment
            const newAssignment: JobAssignment = {
                id: Date.now().toString(),
                technicianId,
                jobId,
                assignedAt: new Date().toISOString(),
                estimatedArrival: new Date(Date.now() + 45 * 60000).toISOString(), // 45 minutes from now
                status: "assigned",
            }

            setAssignments((prev) => [...prev, newAssignment])

            // Update technician status
            setTechnicians((prev) =>
                prev.map((t) =>
                    t.id === technicianId
                        ? {
                            ...t,
                            status: "busy",
                            currentJob: job.orderNo,
                            estimatedAvailable: new Date(Date.now() + 3 * 60 * 60000).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            }),
                        }
                        : t,
                ),
            )

            // Remove job from pending
            setPendingJobs((prev) => prev.filter((j) => j.id !== jobId))

            toast.success(`${technician.name} has been assigned to ${job.orderNo}`)

            setIsAssignJobOpen(false)
            setSelectedTechnician(null)
            setSelectedJob(null)
        }
    }

    const handleAddTechnician = (e: React.FormEvent) => {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)

        const newTechnician: Technician = {
            id: Date.now().toString(),
            name: formData.get("name") as string,
            phone: formData.get("phone") as string,
            email: formData.get("email") as string,
            location: formData.get("location") as string,
            coordinates: { lat: -26.2041, lng: 28.0473 }, // Default coordinates
            status: "available",
            specialties: (formData.get("specialties") as string).split(",").map((s) => s.trim()),
            rating: 0,
            completedJobs: 0,
            skills: {
                electrical: Number.parseInt(formData.get("electrical") as string) || 0,
                mechanical: Number.parseInt(formData.get("mechanical") as string) || 0,
                hydraulic: Number.parseInt(formData.get("hydraulic") as string) || 0,
                diagnostic: Number.parseInt(formData.get("diagnostic") as string) || 0,
            },
            certifications: (formData.get("certifications") as string).split(",").map((c) => c.trim()),
            joinDate: new Date().toISOString().split("T")[0],
            lastActive: new Date().toISOString(),
        }

        setTechnicians((prev) => [...prev, newTechnician])
        setIsAddTechnicianOpen(false)
        toast.success(`${newTechnician.name} has been added to the team.`)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "available":
                return "bg-green-100 text-green-800"
            case "busy":
                return "bg-blue-100 text-blue-800"
            case "off-duty":
                return "bg-gray-100 text-gray-800"
            case "emergency":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const getUrgencyColor = (urgency: string) => {
        switch (urgency) {
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

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "available":
                return <CheckCircle className="h-4 w-4 text-green-500" />
            case "busy":
                return <Clock className="h-4 w-4 text-blue-500" />
            case "off-duty":
                return <XCircle className="h-4 w-4 text-gray-500" />
            case "emergency":
                return <AlertTriangle className="h-4 w-4 text-red-500" />
            default:
                return <Clock className="h-4 w-4 text-gray-500" />
        }
    }

    const filteredTechnicians = technicians.filter((tech) => {
        const matchesSearch =
            tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tech.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tech.specialties.some((spec) => spec.toLowerCase().includes(searchTerm.toLowerCase()))

        const matchesFilter = filterStatus === "all" || tech.status === filterStatus

        return matchesSearch && matchesFilter
    })

    const findBestTechnician = (job: PendingJob) => {
        return technicians
            .filter((tech) => tech.status === "available")
            .map((tech) => {
                let score = 0

                // Skill match score
                const skillMatch = job.requiredSkills.some((skill) =>
                    tech.specialties.some((spec) => spec.toLowerCase().includes(skill.toLowerCase())),
                )
                if (skillMatch) score += 50

                // Distance score (closer is better)
                if (job.distance && job.distance < 15) score += 30
                else if (job.distance && job.distance < 25) score += 20
                else if (job.distance && job.distance < 35) score += 10

                // Rating score
                score += tech.rating * 5

                // Experience score
                score += Math.min(tech.completedJobs / 10, 20)

                return { ...tech, matchScore: score }
            })
            .sort((a, b) => b.matchScore - a.matchScore)[0]
    }

    return (
        <>
            <div className="flex-1 space-y-4 p-4 pt-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold tracking-tight">Technicians & Job Assignment</h2>
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
                                <DialogDescription>Enter technician details and skill levels.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleAddTechnician} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input id="name" name="name" required />
                                    </div>
                                    <div>
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input id="phone" name="phone" type="tel" required />
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
                                <div>
                                    <Label htmlFor="specialties">Specialties (comma-separated)</Label>
                                    <Input id="specialties" name="specialties" placeholder="Engine Repair, Electrical, Diagnostic" />
                                </div>
                                <div>
                                    <Label htmlFor="certifications">Certifications (comma-separated)</Label>
                                    <Input id="certifications" name="certifications" placeholder="ASE Certified, Safety Level 1" />
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                    <div>
                                        <Label htmlFor="electrical">Electrical (%)</Label>
                                        <Input id="electrical" name="electrical" type="number" min="0" max="100" />
                                    </div>
                                    <div>
                                        <Label htmlFor="mechanical">Mechanical (%)</Label>
                                        <Input id="mechanical" name="mechanical" type="number" min="0" max="100" />
                                    </div>
                                    <div>
                                        <Label htmlFor="hydraulic">Hydraulic (%)</Label>
                                        <Input id="hydraulic" name="hydraulic" type="number" min="0" max="100" />
                                    </div>
                                    <div>
                                        <Label htmlFor="diagnostic">Diagnostic (%)</Label>
                                        <Input id="diagnostic" name="diagnostic" type="number" min="0" max="100" />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full">
                                    Add Technician
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <Input
                            placeholder="Search technicians by name, location, or specialty..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="busy">Busy</SelectItem>
                            <SelectItem value="off-duty">Off Duty</SelectItem>
                            <SelectItem value="emergency">Emergency</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Tabs defaultValue="technicians" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="technicians">All Technicians</TabsTrigger>
                        <TabsTrigger value="pending">Pending Jobs ({pendingJobs.length})</TabsTrigger>
                        <TabsTrigger value="assignments">Active Assignments</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    </TabsList>

                    <TabsContent value="technicians" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {filteredTechnicians.map((technician) => (
                                <Card key={technician.id} className="hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-2">
                                                    {getStatusIcon(technician.status)}
                                                    <CardTitle className="text-lg">{technician.name}</CardTitle>
                                                </div>
                                                <Badge className={getStatusColor(technician.status)}>
                                                    {technician.status.replace("-", " ").toUpperCase()}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                                <span className="text-sm font-semibold">{technician.rating}</span>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Phone className="h-3 w-3 text-gray-500" />
                                                    <span>{technician.phone}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-3 w-3 text-gray-500" />
                                                    <span>{technician.location}</span>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold text-sm mb-2">Specialties:</h4>
                                                <div className="flex flex-wrap gap-1">
                                                    {technician.specialties.map((specialty) => (
                                                        <Badge key={specialty} variant="secondary" className="text-xs">
                                                            {specialty}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold text-sm mb-2">Skills:</h4>
                                                <div className="grid grid-cols-2 gap-2 text-xs">
                                                    <div className="flex justify-between">
                                                        <span>Electrical:</span>
                                                        <span className="font-semibold">{technician.skills.electrical}%</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Mechanical:</span>
                                                        <span className="font-semibold">{technician.skills.mechanical}%</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Hydraulic:</span>
                                                        <span className="font-semibold">{technician.skills.hydraulic}%</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Diagnostic:</span>
                                                        <span className="font-semibold">{technician.skills.diagnostic}%</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-xs text-gray-600">
                                                <p>Completed Jobs: {technician.completedJobs}</p>
                                                <p>Joined: {technician.joinDate}</p>
                                                {technician.currentJob && (
                                                    <p className="text-blue-600">
                                                        Current Job: {technician.currentJob} (Available: {technician.estimatedAvailable})
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex gap-2 pt-2">
                                                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                                                    <Phone className="h-3 w-3 mr-1" />
                                                    Call
                                                </Button>
                                                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                                                    <Navigation className="h-3 w-3 mr-1" />
                                                    Track
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

                    <TabsContent value="pending" className="space-y-4">
                        <div className="grid gap-4">
                            {pendingJobs.map((job) => {
                                const bestTechnician = findBestTechnician(job)
                                return (
                                    <Card key={job.id} className="hover:shadow-md transition-shadow">
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-2">
                                                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                                                        <CardTitle className="text-lg">{job.orderNo}</CardTitle>
                                                    </div>
                                                    <Badge className={getUrgencyColor(job.urgency)}>{job.urgency.toUpperCase()}</Badge>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-gray-500" />
                                                    <span className="text-sm text-gray-500">{job.createdAt}</span>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                                <div>
                                                    <h4 className="font-semibold mb-2">Job Details</h4>
                                                    <div className="space-y-1 text-sm">
                                                        <p>
                                                            <strong>Driver:</strong> {job.driverName}
                                                        </p>
                                                        <p>
                                                            <strong>Vehicle:</strong> {job.vehicleReg}
                                                        </p>
                                                        <p>
                                                            <strong>Location:</strong> {job.location}
                                                        </p>
                                                        <p>
                                                            <strong>Duration:</strong> {job.estimatedDuration}
                                                        </p>
                                                        {job.distance && (
                                                            <p>
                                                                <strong>Distance:</strong> {job.distance} km
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="font-semibold mb-2">Problem Description</h4>
                                                    <p className="text-sm text-gray-700 mb-3">{job.description}</p>
                                                    <div>
                                                        <h5 className="font-medium mb-1">Required Skills:</h5>
                                                        <div className="flex flex-wrap gap-1">
                                                            {job.requiredSkills.map((skill) => (
                                                                <Badge key={skill} variant="outline" className="text-xs">
                                                                    {skill}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="font-semibold mb-2">Recommended Technician</h4>
                                                    {bestTechnician ? (
                                                        <div className="bg-green-50 p-3 rounded-lg">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                                                <span className="font-medium">{bestTechnician.name}</span>
                                                                <Badge className="bg-green-100 text-green-800 text-xs">
                                                                    {Math.round(bestTechnician.matchScore)}% Match
                                                                </Badge>
                                                            </div>
                                                            <div className="text-xs space-y-1">
                                                                <p>Location: {bestTechnician.location}</p>
                                                                <p>Rating: {bestTechnician.rating}/5</p>
                                                                <p>Phone: {bestTechnician.phone}</p>
                                                            </div>
                                                            <Button
                                                                size="sm"
                                                                className="w-full mt-2"
                                                                onClick={() => handleAssignJob(bestTechnician.id, job.id)}
                                                            >
                                                                Assign to {bestTechnician.name}
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <div className="bg-yellow-50 p-3 rounded-lg">
                                                            <p className="text-sm text-yellow-800">
                                                                No available technicians match the requirements
                                                            </p>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="w-full mt-2 bg-transparent"
                                                                onClick={() => {
                                                                    setSelectedJob(job)
                                                                    setIsAssignJobOpen(true)
                                                                }}
                                                            >
                                                                Manual Assignment
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    </TabsContent>

                    <TabsContent value="assignments" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Active Job Assignments</CardTitle>
                                <CardDescription>Currently assigned technicians and their job status</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Technician</TableHead>
                                            <TableHead>Job Order</TableHead>
                                            <TableHead>Assigned At</TableHead>
                                            <TableHead>ETA</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {assignments.map((assignment) => {
                                            const technician = technicians.find((t) => t.id === assignment.technicianId)
                                            return (
                                                <TableRow key={assignment.id}>
                                                    <TableCell>
                                                        <div>
                                                            <p className="font-medium">{technician?.name}</p>
                                                            <p className="text-sm text-gray-500">{technician?.phone}</p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{technician?.currentJob || "N/A"}</TableCell>
                                                    <TableCell>{new Date(assignment.assignedAt).toLocaleString()}</TableCell>
                                                    <TableCell>{new Date(assignment.estimatedArrival).toLocaleTimeString()}</TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            className={
                                                                assignment.status === "on-site"
                                                                    ? "bg-blue-100 text-blue-800"
                                                                    : assignment.status === "en-route"
                                                                        ? "bg-yellow-100 text-yellow-800"
                                                                        : "bg-gray-100 text-gray-800"
                                                            }
                                                        >
                                                            {assignment.status.replace("-", " ").toUpperCase()}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-2">
                                                            <Button variant="outline" size="sm">
                                                                <Phone className="h-3 w-3 mr-1" />
                                                                Call
                                                            </Button>
                                                            <Button variant="outline" size="sm">
                                                                <Navigation className="h-3 w-3 mr-1" />
                                                                Track
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="analytics" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">Available Technicians</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-green-600">
                                        {technicians.filter((t) => t.status === "available").length}
                                    </div>
                                    <p className="text-xs text-muted-foreground">Out of {technicians.length} total</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">Average Response Time</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-blue-600">18 min</div>
                                    <p className="text-xs text-muted-foreground">-2 min from last week</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">Jobs Completed Today</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-purple-600">12</div>
                                    <p className="text-xs text-muted-foreground">+3 from yesterday</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-yellow-600">4.7</div>
                                    <p className="text-xs text-muted-foreground">Customer satisfaction</p>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Manual Assignment Dialog */}
                <Dialog open={isAssignJobOpen} onOpenChange={setIsAssignJobOpen}>
                    <DialogContent className="max-w-4xl">
                        <DialogHeader>
                            <DialogTitle>Manual Job Assignment</DialogTitle>
                            <DialogDescription>
                                Select a technician for job {selectedJob?.orderNo} - {selectedJob?.description}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-h-96 overflow-y-auto">
                            {technicians
                                .filter((t) => t.status === "available")
                                .map((technician) => (
                                    <Card
                                        key={technician.id}
                                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                                        onClick={() => selectedJob && handleAssignJob(technician.id, selectedJob.id)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-semibold">{technician.name}</h4>
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                                    <span className="text-xs">{technician.rating}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-1 text-xs text-gray-600">
                                                <p>Location: {technician.location}</p>
                                                <p>Phone: {technician.phone}</p>
                                                <p>Jobs: {technician.completedJobs}</p>
                                            </div>
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {technician.specialties.slice(0, 2).map((specialty) => (
                                                    <Badge key={specialty} variant="secondary" className="text-xs">
                                                        {specialty}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    )
}
