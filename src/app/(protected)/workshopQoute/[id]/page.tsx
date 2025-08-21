"use client";

import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Quotation {
    id: string;
    drivername?: string;
    vehiclereg?: string;
    job_type?: string;
    issue?: string;
    parts_needed?: string[]; // just part names
    laborcost?: number;
    partscost?: number; // total parts cost number
    totalcost?: number;
    priority?: string;
    status: "pending" | "approved" | "rejected" | "pending-inspection" | "paid";
    created_at: string;
    description?: string;
    markupPrice?: number; // percentage markup number
    type: "external" | "internal";
    additional_notes: string;
}

interface Part {
    name: string;
    price: number;
}


export default function QuotationDetailPage() {
    const { id } = useParams();
    const [quotation, setQuotation] = useState<Quotation | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const supabase = createClient();

    // Manage parts as strings (names)
    const [parts, setParts] = useState<Part[]>([]);
    const [newPartName, setNewPartName] = useState("");
    const [newPartPrice, setNewPartPrice] = useState<number | "">(0);
    const [labourCost, setLabourCost] = useState<string>("");


    // Manage parts total cost input (price side)
    const [partsCost, setPartsCost] = useState<number>(0);
    // Markup percentage
    const [markupPrice, setMarkupPrice] = useState<number>(0);

    // // const fetchQuotation = async () => {
    // const { data, error } = await supabase
    //     .from("quotations")
    //     .select("*")
    //     .eq("id", String(id))
    //     .single();

    // if (error) {
    //     toast.error("Failed to load quotation");
    //     console.error(error);

    // }
    // else {
    //     setParts(data.parts_needed || []);
    //     setPartsCost(data.partscost || 0);
    //     setMarkupPrice(data.markupPrice || 0);
    //     setQuotation(data as Quotation);
    // }
    // setLoading(false);
    // // };

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
            // Convert parts_needed (string[]) to Part[] with price 0 by default
            const partsFromDB = (data.parts_needed || []).map((name: string) => ({
                name,
                price: 0,
            }));
            setParts(partsFromDB);

            setPartsCost(data.partscost || 0);
            setMarkupPrice(data.markupPrice || 0);
            setQuotation(data as Quotation);
        }
        setLoading(false);
    };


    // Calculate total cost with markup applied
    const calculateTotalCost = (
        labor: number = 0,
        partsCostVal: number,
        markup: number
    ) => {
        const baseTotal = labor + partsCostVal;
        const markupAmount = (baseTotal * markup) / 100;
        return baseTotal + markupAmount;
    };

    // Add a new part name
    const addPart = () => {
        if (!newPartName.trim()) {
            toast.error("Part name is required");
            return;
        }
        if (newPartPrice === "" || newPartPrice <= 0) {
            toast.error("Part price must be a positive number");
            return;
        }
        if (parts.find((p) => p.name.toLowerCase() === newPartName.trim().toLowerCase())) {
            toast.error("Part already added");
            return;
        }
        setParts([...parts, { name: newPartName.trim(), price: newPartPrice }]);
        setNewPartName("");
        setNewPartPrice(0);
    };

    // Remove part by name
    const removePart = (name: string) => {
        setParts(parts.filter((p) => p.name !== name));
    };


    // Save updated parts, parts cost, markup and recalc total cost
    const updateQuotation = async () => {
        if (!quotation) return;
        setUpdating(true);

        // Fix: Calculate total cost correctly (labor + partsCost, then apply markup)
        const baseTotal = (quotation.laborcost || 0) + labourCost;

        const { error } = await supabase
            .from("quotations")
            .update({
                laborcost: Number(baseTotal),
            })
            .eq("id", quotation.id);

        if (error) {
            toast.error("Failed to update quotation");
            console.error(error);
        } else {
            toast.success("Quotation updated");
            setQuotation({
                ...quotation,
            });
        }
        setUpdating(false);
    };

    useEffect(() => {
        if (id) fetchQuotation();
    }, [id]);

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (!quotation) return <div className="text-center mt-10">Quotation not found</div>;

    const updateLabour = async () => {
        if (!quotation) return;
        // Ensure labourCost is a string or number, and quotation.laborcost is a number
        const newLabourCost = parseInt(labourCost);
        if (isNaN(newLabourCost)) {
            toast.error("Invalid labour cost");
            return;
        }

        const { error } = await supabase
            .from("quotations")
            .update({
                laborcost: newLabourCost,
            })
            .eq("id", quotation.id);

        if (error) {
            toast.error("Failed to update labour cost");
            console.error(error);
        } else {
            toast.success("Labour cost updated");
            setQuotation({
                ...quotation,
                laborcost: newLabourCost,
            });
        }
    };
        
    

    return (
        <div className="w-full h-full p-6 bg-gray-50">
            {/* Back Button */}
            <div className="">
                <Button
                    onClick={() => {
                        redirect("/workshopQoute");
                    }}
                    className="px-4 py-2 text-white bg-black rounded-lg shadow-md hover:bg-gray-500 transition-all duration-300"
                >
                    Back
                </Button>
            </div>

            <div className="max-w-7xl mx-auto pt-16">
                <div className="mb-6">
                    <h1 className="text-4xl font-semibold text-gray-800">Repair {quotation.id}</h1>
                    <div>
                        <strong>Quote Type: </strong>
                        <Badge variant={quotation.type === "external" ? "secondary" : "default"}>
                            {quotation.type}
                        </Badge>
                    </div>
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
                                <span>
                                    <strong>Status:</strong>
                                </span>
                                <Badge
                                    variant={
                                        quotation.status === "approved"
                                            ? "default"
                                            : quotation.status === "rejected"
                                                ? "destructive"
                                                : quotation.status === "paid"
                                                    ? "default"
                                                    : quotation.status === "pending-inspection"
                                                        ? "destructive"
                                                        : "secondary"
                                    }
                                >
                                    {quotation.status}
                                </Badge>
                            </div>
                            <div>
                                <strong>Driver:</strong> {quotation.drivername}
                            </div>
                            <div>
                                <strong>Vehicle:</strong> {quotation.vehiclereg}
                            </div>
                            <div>
                                <strong>Job Type:</strong> {quotation.job_type}
                            </div>
                            <div>
                                <strong>Priority:</strong> {quotation.priority}
                            </div>
                            <div>
                                <strong>Issue:</strong> {quotation.additional_notes}
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-800">Description</h2>
                            <div className="flex flex-row justify-evenly">
                                <div>
                                    <strong>Description:</strong> {quotation.issue}
                                </div>
                                <div>
                                    <strong>Labour</strong> R{quotation.laborcost}
                                </div>
                            </div>


                        </div>

                        {/* Parts Section */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-800">Parts</h2>

                            {parts.length === 0 && <div>No parts added yet</div>}

                            {parts.length > 0 && (
                                <ul className="list-disc list-inside">
                                    {parts.map((part) => (
                                        <li key={part.name} className="flex justify-between items-center space-x-2 m-4">
                                            <span>{part.name} - R {part.price.toFixed(2)}</span>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => removePart(part.name)}
                                                disabled={updating}
                                            >
                                                Remove
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            )}


                            <div className="flex space-x-2 items-center mt-4">
                                <input
                                    type="text"
                                    placeholder="Part Name"
                                    value={newPartName}
                                    onChange={(e) => setNewPartName(e.target.value)}
                                    className="border p-2 rounded flex-grow"
                                />

                                <input
                                    type="number"
                                    placeholder="Price"
                                    min={0}
                                    step={0.01}
                                    value={newPartPrice}
                                    onChange={(e) => setNewPartPrice(parseFloat(e.target.value) || 0)}
                                    className="border p-2 rounded w-28"
                                />
                                {/* if this if clicked a dialog to say add labour(hours * workshop rate) */}

                                <Dialog>
                                    <DialogTrigger>
                                        <Button>
                                            {loading ? "Creating..." : "Create"}
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <Input placeholder="Labour hours" />
                                        <DialogClose>
                                            <Button>
                                                Save
                                            </Button>
                                        </DialogClose>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            <Button onClick={addPart} disabled={updating}>
                                {loading ? "Adding..." : "Add Parts"}
                            </Button>
                            {/* remove markup for workshop */}
                            {/* add total labour and parts and breakdown cost(a technician driving to the vehicles) and tow cost if towing and km towed */}

                            <div className="mt-4 flex items-center space-x-4">
                                <label htmlFor="partsCost" className="font-semibold">
                                    Total Labour Cost (R):
                                </label>
                                <input
                                    type="number"
                                    id="partsCost"
                                    min={0}
                                    step={0.01}
                                    value={labourCost}
                                    onChange={(e) => setLabourCost(e.target.value)}
                                    className="border rounded p-2 w-40"
                                    disabled={updating}
                                />
                            </div>

                            <div className="mt-4 flex items-center space-x-4">
                                <label htmlFor="partsCost" className="font-semibold">
                                    Total Parts Cost (R):
                                </label>
                                <input
                                    type="number"
                                    id="partsCost"
                                    min={0}
                                    step={0.01}
                                    value={partsCost}
                                    onChange={(e) => setPartsCost(parseFloat(e.target.value) || 0)}
                                    className="border rounded p-2 w-40"
                                    disabled={updating}
                                />
                            </div>

                            <div className="mt-4 flex items-center space-x-4">
                                {/* <label htmlFor="markupPrice" className="font-semibold">
                                    Markup (%):
                                </label> */}
                                <input
                                    type="number"
                                    id="markupPrice"
                                    min={0}
                                    max={100}
                                    step={0.1}
                                    value={markupPrice}
                                    onChange={(e) => setMarkupPrice(parseFloat(e.target.value) || 0)}
                                    className="border rounded p-2 w-24"
                                    disabled={updating}
                                    hidden
                                />
                            </div>
                        </div>

                        {/* Cost Breakdown Section */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-800">Cost Breakdown</h2>
                            <div>
                                <strong>Labor Cost:</strong> R {quotation.laborcost?.toFixed(2)}
                            </div>
                            <div>
                                <strong>Parts Cost:</strong> R {partsCost.toFixed(2)}
                            </div>
                            <div>
                                <strong>Total Cost:</strong> R{" "}
                                {calculateTotalCost(quotation.laborcost || 0, partsCost, markupPrice).toFixed(2)}
                            </div>
                        </div>

                        {/* Created At Section */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-800">Created At</h2>
                            <div>
                                <strong>Created At:</strong> {new Date(quotation.created_at).toLocaleString()}
                            </div>
                        </div>

                        <div className="flex gap-4 mt-6">
                            <Button onClick={updateQuotation} disabled={updating}>
                                {updating ? "Saving..." : "Save Changes"}
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => fetchQuotation()}
                                disabled={updating}
                            >
                                Reset
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
