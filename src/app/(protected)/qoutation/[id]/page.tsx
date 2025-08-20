"use client";

import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface Quotation {
    id: string;
    drivername?: string;
    vehiclereg?: string;
    job_type?: string;
    issue?: string;
    parts_needed?: string[];
    laborcost?: number;
    partscost?: number;
    totalcost?: number;
    priority?: string;
    status: "pending" | "approved" | "rejected" | "pending-inspection" | "paid";
    created_at: string;
    description?: string;
}

export default function QuotationDetailPage() {
    const { id } = useParams();
    const [quotation, setQuotation] = useState<Quotation | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const supabase = createClient();

    const fetchQuotation = async () => {
        const { data, error } = await supabase
            .from("quotations")
            .select("*")
            .eq("id", String(id))
            .single();

        if (error) {
            toast.error("Failed to load quotation");
            console.error(error);
        } else {
            setQuotation(data as Quotation);
        }
        setLoading(false);
    };

    const updateStatus = async (newStatus: "approved" | "rejected" | "pending-inspection" | "paid") => {
        if (!quotation) return;
        setUpdating(true);

        const { error } = await supabase
            .from("quotations")
            .update({ status: newStatus })
            .eq("id", quotation.id);

        if (error) {
            toast.error("Failed to update status");
            console.error(error);
        } else {
            toast.success(`Quotation ${newStatus}`);
            setQuotation({ ...quotation, status: newStatus });
        }
        setUpdating(false);
    };

    useEffect(() => {
        if (id) fetchQuotation();
    }, [id]);

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (!quotation) return <div className="text-center mt-10">Quotation not found</div>;

    return (
        <div className="w-full h-screen p-6 bg-gray-50">
            {/* Back Button */}
            <div className="">
                <Button
                    onClick={() => { redirect("/ccenter"); }}
                    className="px-4 py-2 text-white bg-black rounded-lg shadow-md hover:bg-gray-500 transition-all duration-300"
                >
                    Back
                </Button>
            </div>

            <div className="max-w-7xl mx-auto pt-16">
                <div className="mb-6">
                    <h1 className="text-4xl font-semibold text-gray-800">Repair {quotation.id}</h1>
                </div>

                <Card className="shadow-lg border border-gray-200 rounded-lg">
                    <CardHeader className="bg-gray-50 rounded-t-lg p-4">
                        <CardTitle className="text-xl font-semibold text-gray-800">Quotation Details</CardTitle>
                    </CardHeader>

                    <CardContent className="p-6 space-y-8 text-sm text-gray-700">
                        {/* General Information Section */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-800">General Information</h2>
                            <div className="flex justify-between items-center">
                                <span><strong>Status:</strong></span>
                                <Badge variant={
                                    quotation.status === "approved" ? "default"
                                        : quotation.status === "rejected" ? "destructive"
                                            : quotation.status === "paid" ? "default"
                                                : quotation.status === "pending-inspection" ? "destructive"
                                                    : "secondary"
                                }>
                                    {quotation.status}
                                </Badge>
                            </div>
                            <div><strong>Driver:</strong> {quotation.drivername}</div>
                            <div><strong>Vehicle:</strong> {quotation.vehiclereg}</div>
                            <div><strong>Job Type:</strong> {quotation.job_type}</div>
                            <div><strong>Priority:</strong> {quotation.priority}</div>
                            <div><strong>Issue:</strong> {quotation.issue}</div>
                        </div>

                        {/* Description Section */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-800">Description</h2>
                            <div><strong>Description:</strong> {quotation.description}</div>
                            <div><strong>Parts Needed:</strong> {quotation.parts_needed?.join(", ")}</div>
                        </div>

                        {/* Cost Breakdown Section */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-800">Cost Breakdown</h2>
                            <div><strong>Labor Cost:</strong> R {quotation.laborcost?.toFixed(2)}</div>
                            <div><strong>Parts Cost:</strong> R {quotation.partscost?.toFixed(2)}</div>
                            <div><strong>Total Cost:</strong> R {quotation.totalcost?.toFixed(2)}</div>
                        </div>

                        {/* Created At Section */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-800">Created At</h2>
                            <div><strong>Created At:</strong> {new Date(quotation.created_at).toLocaleString()}</div>
                        </div>

                        {/* Action Buttons for Pending Status */}
                        {quotation.status === "pending" && (
                            <div className="flex gap-4 mt-6">
                                <Button
                                    variant="default"
                                    disabled={updating}
                                    onClick={() => updateStatus("approved")}
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 transition-all duration-300"
                                >
                                    Approve
                                </Button>
                                <Button
                                    variant="outline"
                                    disabled={updating}
                                    onClick={() => updateStatus("paid")}
                                    className="px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-md hover:bg-blue-100 disabled:bg-gray-200 transition-all duration-300"
                                >
                                    Paid
                                </Button>
                                <Button
                                    variant="destructive"
                                    disabled={updating}
                                    onClick={() => updateStatus("rejected")}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-300 transition-all duration-300"
                                >
                                    Reject
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}