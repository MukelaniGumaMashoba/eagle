"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  FileText,
  Plus,
  CheckCircle,
  Clock,
} from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

interface Quotation {
  id: string
  breakdown_id?: string
  cost_center_id?: string
  estimate_amount?: number
  status: "pending" | "approved" | "rejected"
  reason?: string
  created_at: string
  job_type?: string
  issue?: string
  parts_needed?: string[]
  estimated_cost?: number
  priority?: string
  estimated_time?: string
  additional_notes?: string
  job_id?: number
  paid?: boolean
  orderno?: string
  drivername?: string
  vehiclereg?: string
  description?: string
  laborcost?: number
  partscost?: number
  totalcost?: number
  created_by?: string
  jobcard_id?: number
  type: string
}

export default function CostCenterPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [isCreateQuotationOpen, setIsCreateQuotationOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchQuotations = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("quotations")
        .select(`
          id,
          breakdown_id,
          cost_center_id,
          estimate_amount,
          status,
          reason,
          created_at,
          job_type,
          issue,
          parts_needed,
          estimated_cost,
          priority,
          estimated_time,
          additional_notes,
          job_id,
          paid,
          orderno,
          drivername,
          vehiclereg,
          description,
          laborcost,
          partscost,
          totalcost,
          created_by,
          jobcard_id,
          type
        `)
        .order("created_at", { ascending: false })
        .is("markupPrice", null);

      if (error) {
        console.error("Error fetching quotations:", error)
        toast.error("Failed to fetch quotations")
        return
      }

      setQuotations((data as []) as Quotation[])
    } catch (error) {
      console.error("Error:", error)
      toast.error("Failed to fetch quotations")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuotations()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "internal":
        return "bg-green-100"
      case "external":
        return "bg-blue-100"
      default:
        return "bg-white"
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quotation Management</h2>
        <Dialog open={isCreateQuotationOpen} onOpenChange={setIsCreateQuotationOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Create Quotation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Quotation</DialogTitle>
              <DialogDescription>Create a detailed quotation for repair work.</DialogDescription>
            </DialogHeader>
            {/* FORM UI COMES HERE — OMITTED FOR SPACE */}
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="quotations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="quotations">All Quotations</TabsTrigger>
          <TabsTrigger value="pending">Pending Submission</TabsTrigger>
          <TabsTrigger value="pending-approval">Pending Approval</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="invoiced">Invoiced</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
        </TabsList>

        {['quotations', 'pending', 'approved', 'rejected', 'invoiced', 'paid','pending-approval'].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            <div className="grid gap-4">
              {loading ? (
                <div className="text-center py-8">Loading quotations...</div>
              ) : quotations.filter(q => tab === 'quotations' || q.status === tab).length === 0 ? (
                <div className="text-center py-8 text-gray-500">No quotations found</div>
              ) : (
                quotations
                  .filter(q => tab === 'quotations' || q.status === tab)
                  .map((quotation) => (
                    <Card key={quotation.id} className={getTypeColor(quotation.type)}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-md">
                              {quotation.orderno || `Quotation ${quotation.id.slice(0, 8)}`} : {quotation.type.toUpperCase()} QOUTE
                            </CardTitle>
                            <CardDescription>Created on {new Date(quotation.created_at).toLocaleString()}</CardDescription>
                          </div>
                          <Badge className={getStatusColor(quotation.status)}>
                            {quotation.status.toUpperCase()}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium">Driver: {quotation.drivername || 'N/A'}</p>
                            <p className="text-sm font-medium">Vehicle: {quotation.vehiclereg || 'N/A'}</p>
                            <p className="text-sm font-medium">Job Type: {quotation.job_type || 'N/A'}</p>
                            <p className="text-sm font-medium">Priority: {quotation.priority || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Description:</p>
                            <p className="text-sm text-gray-600">{quotation.description || 'N/A'}</p>
                            {quotation.issue && (
                              <>
                                <p className="text-sm font-medium mt-2">Issue:</p>
                                <p className="text-sm text-gray-600">{quotation.issue}</p>
                              </>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium">Labor: R {(quotation.laborcost || 0).toFixed(2)}</p>
                            <p className="text-sm font-medium">Parts: R {(quotation.partscost || 0).toFixed(2)}</p>
                            <p className="text-lg font-semibold text-green-600">Total: R {(quotation.totalcost || 0).toFixed(2)}</p>
                          </div>
                        </div>

                        {quotation.parts_needed && quotation.parts_needed.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm font-semibold mb-2">Parts Needed:</p>
                            <div className="flex flex-wrap gap-2">
                              {quotation.parts_needed.map((part, index) => (
                                <Badge key={index} variant="outline">{part}</Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Link href={`/ccenter/${quotation.id}`}>
                            <Button variant="outline">View Details</Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}