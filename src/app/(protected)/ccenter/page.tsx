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
import { DollarSign, FileText, Plus, Send, Clock, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

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
  createdat?: string
  created_by?: string
}

interface QuotationItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export default function CostCenterPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [isCreateQuotationOpen, setIsCreateQuotationOpen] = useState(false)
  const [quotationItems, setQuotationItems] = useState<QuotationItem[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  // Form state for creating quotation
  const [formData, setFormData] = useState({
    orderno: "",
    drivername: "",
    vehiclereg: "",
    description: "",
    job_type: "",
    issue: "",
    priority: "medium",
    estimated_time: "",
    additional_notes: "",
    parts_needed: [] as string[],
    laborcost: 0,
    partscost: 0,
    totalcost: 0
  })

  const [newPart, setNewPart] = useState("")

  const fetchQuotations = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('quotations')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching quotations:', error)
        toast.error('Failed to fetch quotations')
        return
      }

      setQuotations(
        (data ?? []).map((q: any) => ({
          id: q.id,
          breakdown_id: q.breakdown_id ?? undefined,
          cost_center_id: q.cost_center_id ?? undefined,
          created_at: q.created_at ?? undefined,
          estimate_amount: q.estimate_amount ?? undefined,
          reason: q.reason ?? undefined,
          status: q.status ?? undefined,
          created_by: q.created_by ?? undefined,
        }))
      )
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to fetch quotations')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuotations()
  }, [])

  const handleCreateQuotation = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const totalCost = formData.laborcost + formData.partscost

      const { data, error } = await supabase
        .from('quotations')
        .insert([
          {
            orderno: formData.orderno,
            drivername: formData.drivername,
            vehiclereg: formData.vehiclereg,
            description: formData.description,
            job_type: formData.job_type,
            issue: formData.issue,
            priority: formData.priority,
            estimated_time: formData.estimated_time,
            additional_notes: formData.additional_notes,
            parts_needed: formData.parts_needed,
            laborcost: formData.laborcost,
            partscost: formData.partscost,
            totalcost: totalCost,
            status: 'pending'
          }
        ])
        .select()

      if (error) {
        console.error('Error creating quotation:', error)
        toast.error('Failed to create quotation')
        return
      }

      toast.success(`Quotation for ${formData.orderno} has been created.`)
      setIsCreateQuotationOpen(false)

      // Reset form
      setFormData({
        orderno: "",
        drivername: "",
        vehiclereg: "",
        description: "",
        job_type: "",
        issue: "",
        priority: "medium",
        estimated_time: "",
        additional_notes: "",
        parts_needed: [],
        laborcost: 0,
        partscost: 0,
        totalcost: 0
      })

      fetchQuotations()
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to create quotation')
    }
  }

  const handleUpdateStatus = async (quotationId: string, newStatus: "approved" | "rejected") => {
    try {
      const { error } = await supabase
        .from('quotations')
        .update({ status: newStatus })
        .eq('id', quotationId)

      if (error) {
        console.error('Error updating quotation status:', error)
        toast.error('Failed to update quotation status')
        return
      }

      toast.success(`Quotation ${newStatus} successfully.`)
      fetchQuotations()
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to update quotation status')
    }
  }

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

  const addPart = () => {
    if (newPart.trim() && !formData.parts_needed.includes(newPart.trim())) {
      setFormData(prev => ({
        ...prev,
        parts_needed: [...prev.parts_needed, newPart.trim()]
      }))
      setNewPart("")
    }
  }

  const removePart = (part: string) => {
    setFormData(prev => ({
      ...prev,
      parts_needed: prev.parts_needed.filter(p => p !== part)
    }))
  }

  const updateTotalCost = () => {
    const total = formData.laborcost + formData.partscost
    setFormData(prev => ({ ...prev, totalcost: total }))
  }

  useEffect(() => {
    updateTotalCost()
  }, [formData.laborcost, formData.partscost])

  return (
    <>
      <div className="flex-1 space-y-4 p-4 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Quotation Management</h2>
          <Dialog open={isCreateQuotationOpen} onOpenChange={setIsCreateQuotationOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Quotation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Quotation</DialogTitle>
                <DialogDescription>Create a detailed quotation for repair work.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateQuotation} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="orderno">Order Number</Label>
                    <Input
                      id="orderno"
                      value={formData.orderno}
                      onChange={(e) => setFormData(prev => ({ ...prev, orderno: e.target.value }))}
                      placeholder="OR.123456789"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="drivername">Driver Name</Label>
                    <Input
                      id="drivername"
                      value={formData.drivername}
                      onChange={(e) => setFormData(prev => ({ ...prev, drivername: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="vehiclereg">Vehicle Registration</Label>
                    <Input
                      id="vehiclereg"
                      value={formData.vehiclereg}
                      onChange={(e) => setFormData(prev => ({ ...prev, vehiclereg: e.target.value }))}
                      placeholder="ABC 123 GP"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="job_type">Job Type</Label>
                    <Input
                      id="job_type"
                      value={formData.job_type}
                      onChange={(e) => setFormData(prev => ({ ...prev, job_type: e.target.value }))}
                      placeholder="Repair, Maintenance, etc."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="estimated_time">Estimated Time</Label>
                    <Input
                      id="estimated_time"
                      value={formData.estimated_time}
                      onChange={(e) => setFormData(prev => ({ ...prev, estimated_time: e.target.value }))}
                      placeholder="2 hours, 1 day, etc."
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Work Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Detailed description of the work to be done"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="issue">Issue/Problem</Label>
                  <Textarea
                    id="issue"
                    value={formData.issue}
                    onChange={(e) => setFormData(prev => ({ ...prev, issue: e.target.value }))}
                    placeholder="Description of the problem or issue"
                  />
                </div>

                <div>
                  <Label htmlFor="additional_notes">Additional Notes</Label>
                  <Textarea
                    id="additional_notes"
                    value={formData.additional_notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, additional_notes: e.target.value }))}
                    placeholder="Any additional notes or special instructions"
                  />
                </div>

                <div>
                  <Label>Parts Needed</Label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add part needed"
                        value={newPart}
                        onChange={(e) => setNewPart(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addPart()}
                      />
                      <Button onClick={addPart} type="button">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.parts_needed.map((part, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {part}
                          <button
                            onClick={() => removePart(part)}
                            className="ml-1 text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="laborcost">Labor Cost (R)</Label>
                    <Input
                      id="laborcost"
                      type="number"
                      step="0.01"
                      value={formData.laborcost}
                      onChange={(e) => setFormData(prev => ({ ...prev, laborcost: parseFloat(e.target.value) || 0 }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="partscost">Parts Cost (R)</Label>
                    <Input
                      id="partscost"
                      type="number"
                      step="0.01"
                      value={formData.partscost}
                      onChange={(e) => setFormData(prev => ({ ...prev, partscost: parseFloat(e.target.value) || 0 }))}
                      required
                    />
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-lg font-semibold">Total Cost: R {formData.totalcost.toFixed(2)}</p>
                </div>

                <Button type="submit" className="w-full">
                  Create Quotation
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="quotations" className="space-y-4">
          <TabsList>
            <TabsTrigger value="quotations">All Quotations</TabsTrigger>
            <TabsTrigger value="pending">Pending Approval</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
          </TabsList>

          <TabsContent value="quotations" className="space-y-4">
            <div className="grid gap-4">
              {loading ? (
                <div className="text-center py-8">Loading quotations...</div>
              ) : quotations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No quotations found</div>
              ) : (
                quotations.map((quotation) => (
                  <Card key={quotation.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{quotation.orderno || `Quotation ${quotation.id.slice(0, 8)}`}</CardTitle>
                          <CardDescription>Created on {new Date(quotation.created_at).toLocaleString()}</CardDescription>
                        </div>
                        <Badge className={getStatusColor(quotation.status)}>{quotation.status.toUpperCase()}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm">
                            <strong>Driver:</strong> {quotation.drivername || 'N/A'}
                          </p>
                          <p className="text-sm">
                            <strong>Vehicle:</strong> {quotation.vehiclereg || 'N/A'}
                          </p>
                          <p className="text-sm">
                            <strong>Job Type:</strong> {quotation.job_type || 'N/A'}
                          </p>
                          <p className="text-sm">
                            <strong>Priority:</strong> {quotation.priority || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm">
                            <strong>Work Description:</strong>
                          </p>
                          <p className="text-sm text-gray-600">{quotation.description || 'N/A'}</p>
                          {quotation.issue && (
                            <>
                              <p className="text-sm mt-2">
                                <strong>Issue:</strong>
                              </p>
                              <p className="text-sm text-gray-600">{quotation.issue}</p>
                            </>
                          )}
                        </div>
                        <div>
                          <div className="space-y-1">
                            <p className="text-sm">
                              <strong>Cost Breakdown:</strong>
                            </p>
                            <p className="text-sm">Labor: R {(quotation.laborcost || 0).toFixed(2)}</p>
                            <p className="text-sm">Parts: R {(quotation.partscost || 0).toFixed(2)}</p>
                            <p className="text-lg font-semibold text-green-600">
                              Total: R {(quotation.totalcost || 0).toFixed(2)}
                            </p>
                          </div>
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
                        {quotation.status === "pending" && (
                          <>
                            <Button onClick={() => handleUpdateStatus(quotation.id, "approved")}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button variant="destructive" onClick={() => handleUpdateStatus(quotation.id, "rejected")}>
                              Reject
                            </Button>
                          </>
                        )}
                        <Button variant="outline">
                          <FileText className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        {/* {quotation.status === "pending" && (
                          <div className="flex items-center gap-2 text-yellow-600">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm">Awaiting approval</span>
                          </div>
                        )}
                        {quotation.status === "approved" && (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm">Approved</span>
                          </div>
                        )}
                        {quotation.status === "rejected" && (
                          <div className="flex items-center gap-2 text-red-600">
                            <span className="text-sm">Rejected</span>
                          </div>
                        )} */}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <div className="grid gap-4">
              {quotations
                .filter((q) => q.status === "pending")
                .map((quotation) => (
                  <Card key={quotation.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{quotation.orderno || `Quotation ${quotation.id.slice(0, 8)}`}</CardTitle>
                          <CardDescription>Awaiting approval</CardDescription>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">PENDING</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-semibold text-green-600">
                        Total: R {(quotation.totalcost || 0).toFixed(2)}
                      </p>
                      <div className="flex gap-2 mt-4">
                        <Button onClick={() => handleUpdateStatus(quotation.id, "approved")}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button variant="destructive" onClick={() => handleUpdateStatus(quotation.id, "rejected")}>
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="approved" className="space-y-4">
            <div className="grid gap-4">
              {quotations
                .filter((q) => q.status === "approved")
                .map((quotation) => (
                  <Card key={quotation.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{quotation.orderno || `Quotation ${quotation.id.slice(0, 8)}`}</CardTitle>
                          <CardDescription>Approved on {new Date(quotation.created_at).toLocaleString()}</CardDescription>
                        </div>
                        <Badge className="bg-green-100 text-green-800">APPROVED</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-semibold text-green-600">
                        Total: R {(quotation.totalcost || 0).toFixed(2)}
                      </p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
