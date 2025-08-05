"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import {
    Search,
    Grid3X3,
    List,
    Star,
    FileText,
    Users,
    Truck,
    AlertTriangle,
    Wrench,
    ClipboardList,
    UserCheck,
    Cog,
    Fuel,
    HelpCircle,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const reportIcons = {
    Vehicles: Truck,
    "Vehicle Assignments": UserCheck,
    Inspections: ClipboardList,
    Issues: AlertTriangle,
    Service: Wrench,
    "Work Orders": FileText,
    Contacts: Users,
    Parts: Cog,
    Fuel: Fuel,
}

const allReports = {
    "standard reports": [
        {
            name: "Contact Renewal Reminders",
            description: "Lists all date based reminders for contacts.",
            type: "Contacts",
            category: "contacts",
        },
        {
            name: "Contacts List",
            description: "List of all basic contacts information.",
            type: "Contacts",
            category: "contacts",
        },
        {
            name: "Fuel Entries by Vehicle",
            description: "Listing of fuel entries by vehicle.",
            type: "Fuel",
            category: "fuel",
        },
        {
            name: "Fuel Summary",
            description: "Listing of summarized fuel metrics by vehicles.",
            type: "Fuel",
            category: "fuel",
        },
        {
            name: "Fuel Summary by Location",
            description: "Aggregate fuel volume and price data grouped by location and fuel type.",
            type: "Fuel",
            category: "fuel",
        },
        {
            name: "Inspection Submission List",
            description: "Listing of all inspection submissions.",
            type: "Inspections",
            category: "inspections",
        },
        {
            name: "Inspection Failures List",
            description: "Listing of all failed inspection items.",
            type: "Inspections",
            category: "inspections",
        },
        {
            name: "Inspection Schedules",
            description: "Listing of all inspection schedules.",
            type: "Inspections",
            category: "inspections",
        },
        {
            name: "Inspection Submissions Summary",
            description: "Aggregate inspection data grouped by user or vehicle.",
            type: "Inspections",
            category: "inspections",
        },
        {
            name: "Faults Summary",
            description: "Listing of summarized fault metrics for particular fault codes and vehicles.",
            type: "Issues",
            category: "issues",
        },
        {
            name: "Issues List",
            description: "Lists basic details of all vehicle-related issues.",
            type: "Issues",
            category: "issues",
        },
        {
            name: "Parts by Vehicle",
            description: "Listing of all parts used on each vehicle.",
            type: "Parts",
            category: "parts",
        },
        {
            name: "Repair Priority Class Summary",
            description: "Aggregate Service Data breakdown of Scheduled, Non-Scheduled, and Emergency Repairs.",
            type: "Service",
            category: "service",
        },
        {
            name: "Service History by Vehicle",
            description: "Listing of all service by vehicle grouped by entry or task.",
            type: "Service",
            category: "service",
        },
        {
            name: "Service Entries Summary",
            description: "Listing of summarized service history for vehicles.",
            type: "Service",
            category: "service",
        },
        {
            name: "Service Reminder Compliance",
            description: "Shows history of completed Service Reminders as On Time/Late.",
            type: "Service",
            category: "service",
        },
        {
            name: "Service Reminders",
            description: "Lists all service reminders.",
            type: "Service",
            category: "service",
        },
        {
            name: "Service Task Summary",
            description: "Aggregate service data grouped by Service Task.",
            type: "Service",
            category: "service",
        },
        {
            name: "Vehicles Without Service",
            description: "Lists all vehicles that haven't had a service task(s) performed.",
            type: "Service",
            category: "service",
        },
        {
            name: "Maintenance Categorization Summary",
            description: "Aggregate service data grouped by VMRS Category, System, or Reason for Repair Codes.",
            type: "Service",
            category: "service",
        },
    ],
    vehicles: [
        {
            name: "Group Changes",
            description: "List updates to every vehicle's group.",
            type: "Vehicles",
            category: "vehicles",
        },
        {
            name: "Vehicle Renewal Reminders",
            description: "Lists all date-based reminders for vehicles.",
            type: "Vehicles",
            category: "vehicles",
        },
        {
            name: "Status Changes",
            description: "List updates to every vehicle's status.",
            type: "Vehicles",
            category: "vehicles",
        },
        {
            name: "Status Summary",
            description: "Lists the time vehicles have spent in different statuses.",
            type: "Vehicles",
            category: "vehicles",
        },
        {
            name: "Vehicles Report",
            description: "Listing of all basic vehicle information.",
            type: "Vehicles",
            category: "vehicles",
        },
        {
            name: "Cost Comparison by Year in Service",
            description:
                "Analysis of total vehicle costs per meter (mile/kilometer/hour) based on when in the vehicle's life costs occurred.",
            type: "Vehicles",
            category: "vehicles",
        },
        {
            name: "Cost/Meter Trend",
            description: "Analysis of total vehicle costs per meter (mile/kilometer/hour) over time.",
            type: "Vehicles",
            category: "vehicles",
        },
        {
            name: "Vehicle Details",
            description: "Listing of full vehicle profiles & details.",
            type: "Vehicles",
            category: "vehicles",
        },
        {
            name: "Expense Summary",
            description: "Aggregate expense costs grouped by expense type or vehicle group.",
            type: "Vehicles",
            category: "vehicles",
        },
        {
            name: "Expenses by Vehicle",
            description: "Listing of all expense entries by vehicle.",
            type: "Vehicles",
            category: "vehicles",
        },
        {
            name: "Operating Costs Summary",
            description: "Summary of costs associated with vehicles.",
            type: "Vehicles",
            category: "vehicles",
        },
        {
            name: "Total Cost Trend",
            description: "Analysis of total vehicle costs over time.",
            type: "Vehicles",
            category: "vehicles",
        },
        {
            name: "Utilization Summary",
            description: "Shows usage (e.g. distance traveled) per vehicle based on meter entries.",
            type: "Vehicles",
            category: "vehicles",
        },
    ],
    "vehicle assignments": [
        {
            name: "Vehicle Assignment Log",
            description: "Listing of all vehicle-to-contact assignment details.",
            type: "Vehicle Assignments",
            category: "vehicle assignments",
        },
        {
            name: "Vehicle Assignments Summary",
            description: "Aggregate vehicle assignment data grouped by operator or vehicle.",
            type: "Vehicle Assignments",
            category: "vehicle assignments",
        },
    ],
    inspections: [
        {
            name: "Inspection Submission List",
            description: "Listing of all inspection submissions.",
            type: "Inspections",
            category: "inspections",
        },
        {
            name: "Inspection Failures List",
            description: "Listing of all failed inspection items.",
            type: "Inspections",
            category: "inspections",
        },
        {
            name: "Inspection Schedules",
            description: "Listing of all inspection schedules.",
            type: "Inspections",
            category: "inspections",
        },
        {
            name: "Inspection Submissions Summary",
            description: "Aggregate inspection data grouped by user or vehicle.",
            type: "Inspections",
            category: "inspections",
        },
    ],
    issues: [
        {
            name: "Faults Summary",
            description: "Listing of summarized fault metrics for particular fault codes and vehicles.",
            type: "Issues",
            category: "issues",
        },
        {
            name: "Issues List",
            description: "Lists basic details of all vehicle-related issues.",
            type: "Issues",
            category: "issues",
        },
    ],
    service: [
        {
            name: "Repair Priority Class Summary",
            description: "Aggregate Service Data breakdown of Scheduled, Non-Scheduled, and Emergency Repairs.",
            type: "Service",
            category: "service",
        },
        {
            name: "Service History by Vehicle",
            description: "Listing of all service by vehicle grouped by entry or task.",
            type: "Service",
            category: "service",
        },
        {
            name: "Service Entries Summary",
            description: "Listing of summarized service history for vehicles.",
            type: "Service",
            category: "service",
        },
        {
            name: "Service Reminder Compliance",
            description: "Shows history of completed Service Reminders as On Time/Late.",
            type: "Service",
            category: "service",
        },
        {
            name: "Service Reminders",
            description: "Lists all service reminders.",
            type: "Service",
            category: "service",
        },
        {
            name: "Service Task Summary",
            description: "Aggregate service data grouped by Service Task.",
            type: "Service",
            category: "service",
        },
        {
            name: "Vehicles Without Service",
            description: "Lists all vehicles that haven't had a service task(s) performed.",
            type: "Service",
            category: "service",
        },
        {
            name: "Maintenance Categorization Summary",
            description: "Aggregate service data grouped by VMRS Category, System, or Reason for Repair Codes.",
            type: "Service",
            category: "service",
        },
    ],
    parts: [
        {
            name: "Parts by Vehicle",
            description: "Listing of all parts used on each vehicle.",
            type: "Parts",
            category: "parts",
        },
    ],
    fuel: [
        {
            name: "Fuel Entries by Vehicle",
            description: "Listing of fuel entries by vehicle.",
            type: "Fuel",
            category: "fuel",
        },
        {
            name: "Fuel Summary",
            description: "Listing of summarized fuel metrics by vehicles.",
            type: "Fuel",
            category: "fuel",
        },
        {
            name: "Fuel Summary by Location",
            description: "Aggregate fuel volume and price data grouped by location and fuel type.",
            type: "Fuel",
            category: "fuel",
        },
    ],
}

const reportCategories = [
    { name: "Standard Reports", count: 0, key: "standard reports" },
    { name: "Favorites", count: 0, key: "favorites" },
    { name: "Saved", count: 0, key: "saved" },
    { name: "Shared", count: 0, key: "shared" },
]

const reportTypes = [
    { name: "Vehicles", count: 13, key: "vehicles" },
    { name: "Vehicle Assignments", count: 2, key: "vehicle assignments" },
    { name: "Inspections", count: 4, key: "inspections" },
    { name: "Issues", count: 2, key: "issues" },
    { name: "Service", count: 8, key: "service" },
    { name: "Work Orders", count: 4, key: "work orders" },
    { name: "Contacts", count: 2, key: "contacts" },
    { name: "Parts", count: 1, key: "parts" },
    { name: "Fuel", count: 3, key: "fuel" },
]

export default function ReportsPage() {
    const [userRole, setUserRole] = useState<"call-center" | "fleet-manager" | "cost-center" | "customer" | "admin">(
        "fleet-manager",
    )
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("Standard Reports")
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const searchParams = useSearchParams()

    useEffect(() => {
        const role = localStorage.getItem("userRole") as typeof userRole
        if (role) setUserRole(role)

        const category = searchParams.get("category")
        if (category) {
            const categoryName = category.charAt(0).toUpperCase() + category.slice(1)
            setSelectedCategory(categoryName)
        }
    }, [searchParams])

    const getCurrentReports = () => {
        const category = searchParams.get("category")
        if (category && allReports[category as keyof typeof allReports]) {
            return allReports[category as keyof typeof allReports]
        }
        return allReports["standard reports"]
    }

    const filteredReports = getCurrentReports().filter((report) => {
        const matchesSearch =
            report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.description.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesSearch
    })

    const getPageTitle = () => {
        const category = searchParams.get("category")
        if (category) {
            return category.charAt(0).toUpperCase() + category.slice(1)
        }
        return "Standard Reports"
    }

    const getPageIcon = () => {
        const category = searchParams.get("category")
        if (category && reportIcons[(category.charAt(0).toUpperCase() + category.slice(1)) as keyof typeof reportIcons]) {
            const Icon = reportIcons[(category.charAt(0).toUpperCase() + category.slice(1)) as keyof typeof reportIcons]
            return <Icon className="h-5 w-5" />
        }
        return <FileText className="h-5 w-5" />
    }

    return (
        <div className="flex h-full flex-col">
            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar */}
                <div className="w-64 border-r bg-muted/20 p-4">
                    <div className="space-y-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search for a Report"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8"
                            />
                        </div>

                        {/* Report Categories */}
                        <div className="space-y-1">
                            {reportCategories.map((category) => (
                                <Button
                                    key={category.name}
                                    variant={selectedCategory === category.name ? "secondary" : "ghost"}
                                    className={`w-full justify-start ${selectedCategory === category.name ? "bg-green-100 text-green-800" : ""
                                        }`}
                                    onClick={() => setSelectedCategory(category.name)}
                                >
                                    <FileText className="mr-2 h-4 w-4" />
                                    {category.name}
                                    <span className="ml-auto text-xs text-muted-foreground">{category.count}</span>
                                </Button>
                            ))}
                        </div>

                        <Separator />

                        {/* Report Types */}
                        <div className="space-y-1">
                            <h3 className="text-sm font-medium text-muted-foreground mb-2">REPORT TYPES</h3>
                            {reportTypes.map((type) => {
                                const Icon = reportIcons[type.name as keyof typeof reportIcons] || FileText
                                const category = searchParams.get("category")
                                const isSelected = category === type.key
                                return (
                                    <Button
                                        key={type.name}
                                        variant="ghost"
                                        className={`w-full justify-start ${isSelected ? "bg-green-100 text-green-800 border-l-4 border-l-green-500" : ""
                                            }`}
                                        onClick={() => (window.location.href = `/reports?category=${type.key}`)}
                                    >
                                        <Icon className="mr-2 h-4 w-4" />
                                        {type.name}
                                        <span className="ml-auto text-xs text-muted-foreground">{type.count}</span>
                                    </Button>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6">
                    <div className="space-y-4">
                        {/* Header Controls */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {getPageIcon()}
                                <h2 className="text-lg font-semibold">{getPageTitle()}</h2>
                            </div>
                            <div className="flex items-center gap-2">
                                <Select defaultValue="report-type">
                                    <SelectTrigger className="w-40">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="report-type">Report Type</SelectItem>
                                        <SelectItem value="name">Name</SelectItem>
                                        <SelectItem value="date">Date</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button
                                    variant={viewMode === "grid" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setViewMode("grid")}
                                >
                                    <Grid3X3 className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={viewMode === "list" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setViewMode("list")}
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Reports Display */}
                        {viewMode === "list" ? (
                            <div className="space-y-2">
                                {/* Table Header */}
                                <div className="grid grid-cols-12 gap-4 p-3 text-sm font-medium text-muted-foreground border-b">
                                    <div className="col-span-1"></div>
                                    <div className="col-span-3">Name</div>
                                    <div className="col-span-5">Description</div>
                                    <div className="col-span-2">Report Type</div>
                                    <div className="col-span-1">Saved Reports</div>
                                </div>

                                {/* Table Rows */}
                                {filteredReports.map((report, index) => (
                                    <div
                                        key={index}
                                        className="grid grid-cols-12 gap-4 p-3 hover:bg-muted/50 border-b border-border/50"
                                    >
                                        <div className="col-span-1 flex items-center">
                                            <Star className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <div className="col-span-3 font-medium text-blue-600 hover:underline cursor-pointer">
                                            {report.name}
                                        </div>
                                        <div className="col-span-5 text-sm text-muted-foreground">{report.description}</div>
                                        <div className="col-span-2">
                                            <Badge variant="secondary">{report.type}</Badge>
                                        </div>
                                        <div className="col-span-1"></div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {filteredReports.map((report, index) => (
                                    <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-base text-blue-600 hover:underline">{report.name}</CardTitle>
                                            <CardDescription className="text-sm">{report.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            <Badge variant="secondary">{report.type}</Badge>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {filteredReports.length === 0 && (
                            <div className="text-center py-12">
                                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium mb-2">No reports found</h3>
                                <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
