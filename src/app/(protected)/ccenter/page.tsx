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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, FileText, Plus, Send, Clock, CheckCircle } from "lucide-react"
import { toast } from "sonner"

interface Quotation {
  id: string
  orderNo: string
  driverName: string
  vehicleReg: string
  description: string
  laborCost: number
  partsCost: number
  totalCost: number
  status: "draft" | "sent" | "approved" | "rejected"
  createdAt: string
  approvedAt?: string
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

  useEffect(() => {
    // Mock data
    setQuotations([
      {
        id: "1",
        orderNo: "OR.128651312",
        driverName: "John Smith",
        vehicleReg: "ABC 123 GP",
        description: "Engine overheating repair - Replace radiator and coolant system",
        laborCost: 800.0,
        partsCost: 1700.0,
        totalCost: 2500.0,
        status: "sent",
        createdAt: "2024-01-15 16:00",
      },
      {
        id: "2",
        orderNo: "OR.128651313",
        driverName: "Sarah Johnson",
        vehicleReg: "XYZ 789 GP",
        description: "Tire replacement and wheel alignment",
        laborCost: 300.0,
        partsCost: 1200.0,
        totalCost: 1500.0,
        status: "approved",
        createdAt: "2024-01-14 10:30",
        approvedAt: "2024-01-14 14:15",
      },
    ])

    setQuotationItems([
      { id: "1", description: "Radiator replacement", quantity: 1, unitPrice: 1200.0, total: 1200.0 },
      { id: "2", description: "Coolant fluid", quantity: 5, unitPrice: 100.0, total: 500.0 },
      { id: "3", description: "Labor - Diagnostic and repair", quantity: 4, unitPrice: 200.0, total: 800.0 },
    ])
  }, [])

  const handleCreateQuotation = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)

    const laborCost = Number.parseFloat(formData.get("laborCost") as string) || 0
    const partsCost = Number.parseFloat(formData.get("partsCost") as string) || 0

    const newQuotation: Quotation = {
      id: Date.now().toString(),
      orderNo: formData.get("orderNo") as string,
      driverName: formData.get("driverName") as string,
      vehicleReg: formData.get("vehicleReg") as string,
      description: formData.get("description") as string,
      laborCost,
      partsCost,
      totalCost: laborCost + partsCost,
      status: "draft",
      createdAt: new Date().toLocaleString(),
    }

    setQuotations((prev) => [...prev, newQuotation])
    setIsCreateQuotationOpen(false)
    toast.success(`Quotation for ${newQuotation.orderNo} has been created.`)
  }

  const handleSendQuotation = (quotationId: string) => {
    setQuotations((prev) => prev.map((q) => (q.id === quotationId ? { ...q, status: "sent" } : q)))
    toast.success("The quotation has been sent to the fleet manager for approval.")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "sent":
        return "bg-blue-100 text-blue-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const addQuotationItem = () => {
    const newItem: QuotationItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0,
    }
    setQuotationItems((prev) => [...prev, newItem])
  }

  const updateQuotationItem = (id: string, field: keyof QuotationItem, value: string | number) => {
    setQuotationItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value }
          if (field === "quantity" || field === "unitPrice") {
            updated.total = updated.quantity * updated.unitPrice
          }
          return updated
        }
        return item
      }),
    )
  }

  const removeQuotationItem = (id: string) => {
    setQuotationItems((prev) => prev.filter((item) => item.id !== id))
  }

  const getTotalAmount = () => {
    return quotationItems.reduce((sum, item) => sum + item.total, 0)
  }

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
                    <Label htmlFor="orderNo">Order Number</Label>
                    <Input id="orderNo" name="orderNo" placeholder="OR.123456789" required />
                  </div>
                  <div>
                    <Label htmlFor="driverName">Driver Name</Label>
                    <Input id="driverName" name="driverName" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="vehicleReg">Vehicle Registration</Label>
                    <Input id="vehicleReg" name="vehicleReg" placeholder="ABC 123 GP" required />
                  </div>
                  <div>
                    <Label htmlFor="description">Work Description</Label>
                    <Input id="description" name="description" required />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Quotation Items</h3>
                    <Button type="button" variant="outline" onClick={addQuotationItem}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {quotationItems.map((item) => (
                      <div key={item.id} className="grid grid-cols-12 gap-2 items-center p-2 border rounded">
                        <div className="col-span-5">
                          <Input
                            placeholder="Item description"
                            value={item.description}
                            onChange={(e) => updateQuotationItem(item.id, "description", e.target.value)}
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            placeholder="Qty"
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuotationItem(item.id, "quantity", Number.parseInt(e.target.value) || 0)
                            }
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Unit Price"
                            value={item.unitPrice}
                            onChange={(e) =>
                              updateQuotationItem(item.id, "unitPrice", Number.parseFloat(e.target.value) || 0)
                            }
                          />
                        </div>
                        <div className="col-span-2">
                          <Input value={`R ${item.total.toFixed(2)}`} readOnly className="bg-gray-50" />
                        </div>
                        <div className="col-span-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeQuotationItem(item.id)}
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-semibold">Total: R {getTotalAmount().toFixed(2)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="laborCost">Labor Cost</Label>
                    <Input id="laborCost" name="laborCost" type="number" step="0.01" required />
                  </div>
                  <div>
                    <Label htmlFor="partsCost">Parts Cost</Label>
                    <Input id="partsCost" name="partsCost" type="number" step="0.01" required />
                  </div>
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
              {quotations.map((quotation) => (
                <Card key={quotation.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{quotation.orderNo}</CardTitle>
                        <CardDescription>Created on {quotation.createdAt}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(quotation.status)}>{quotation.status.toUpperCase()}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm">
                          <strong>Driver:</strong> {quotation.driverName}
                        </p>
                        <p className="text-sm">
                          <strong>Vehicle:</strong> {quotation.vehicleReg}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm">
                          <strong>Work Description:</strong>
                        </p>
                        <p className="text-sm text-gray-600">{quotation.description}</p>
                      </div>
                      <div>
                        <div className="space-y-1">
                          <p className="text-sm">
                            <strong>Cost Breakdown:</strong>
                          </p>
                          <p className="text-sm">Labor: R {quotation.laborCost.toFixed(2)}</p>
                          <p className="text-sm">Parts: R {quotation.partsCost.toFixed(2)}</p>
                          <p className="text-lg font-semibold text-green-600">
                            Total: R {quotation.totalCost.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {quotation.status === "draft" && (
                        <Button onClick={() => handleSendQuotation(quotation.id)}>
                          <Send className="h-4 w-4 mr-2" />
                          Send for Approval
                        </Button>
                      )}
                      <Button variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      {quotation.status === "sent" && (
                        <div className="flex items-center gap-2 text-blue-600">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">Awaiting approval</span>
                        </div>
                      )}
                      {quotation.status === "approved" && quotation.approvedAt && (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm">Approved on {quotation.approvedAt}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <div className="grid gap-4">
              {quotations
                .filter((q) => q.status === "sent")
                .map((quotation) => (
                  <Card key={quotation.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{quotation.orderNo}</CardTitle>
                          <CardDescription>Awaiting fleet manager approval</CardDescription>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">PENDING</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-semibold text-green-600">
                        Total: R {quotation.totalCost.toFixed(2)}
                      </p>
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
                          <CardTitle className="text-lg">{quotation.orderNo}</CardTitle>
                          <CardDescription>Approved on {quotation.approvedAt}</CardDescription>
                        </div>
                        <Badge className="bg-green-100 text-green-800">APPROVED</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-semibold text-green-600">
                        Total: R {quotation.totalCost.toFixed(2)}
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
