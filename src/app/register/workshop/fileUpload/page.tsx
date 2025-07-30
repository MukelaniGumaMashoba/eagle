"use client"

import React from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
interface WorkshopDocumentData {
    workshop_id: string;
    document_type: string;
    document_url?: string | null;
    verified?: boolean;
}

export default function UploadFiles() {
    const router = useRouter()
    const supabase = createClient()
    // Insert multiple documents for a workshop
    async function insertWorkshopDocuments(docs: WorkshopDocumentData[]) {
        const { data, error } = await supabase
            .from("workshop_documents")
            .insert(docs as []);
        if (error) throw error;
        return data;
    }

    const handleImageUpload = (e: React.FormEvent,) => {
        // const file = e.target.files[0];
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const coords = position.coords;
                console.log("Lat:", coords.latitude, "Long:", coords.longitude);
                // You can attach location + image to your form data here
            });
        }
    };


    const handleSubmit = (e: React.FormEvent,
        documentsData: Omit<WorkshopDocumentData, 'workshop_id'>[]
    ) => {
        insertWorkshopDocuments(documentsData as [])
        router.push("/register/workshop/success")
    }

    const isMobile = window.screen.width <= 768;
    const isTablet = window.screen.width > 768 && window.screen.width <= 1024;
    if (isMobile || isTablet) {
        return (
            <div>
                <div>
                    <h1>Upload All Files For Tools You selected</h1>
                </div>
                <form>
                    <div>
                        <label>Document</label>
                        <input
                            type="file"
                            accept="image/*"
                            capture="environment"  // rear camera
                            onChange={handleImageUpload}
                        />

                    </div>
                    <Button>Submit</Button>
                </form>
            </div>
        )
    }
    else {
        return (
            <div>
                <p>Use your phone to upload Images or Documents</p>
                <p>Make sure location is turned on</p>
            </div>
        )
    }

}