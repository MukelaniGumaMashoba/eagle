"use server"

import { createClient } from "@/lib/supabase/server"


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
    job_allocation?: number
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
    accepted: boolean
    technician_id?: number
    created_at: string
    updated_at?: string
}
export async function assignJob(Jobassignment: JobAssignment, technician_id: number) {
    const supabase = await createClient();

    // 1️⃣ Update job: assign technician
    const { data: jobUpdate, error: jobError } = await supabase
        .from("job_assignments")
        .update({
            technician_id: technician_id,
            status: "assigned",
            accepted : true,
        })
        .eq("id", Jobassignment.id)
        .select("id, technician_id, status");

    if (jobError) {
        return { error: jobError.message };
    }

    // 2️⃣ Update technician: attach job + set availability
    const { data: techUpdate, error: techError } = await supabase
        .from("technicians")
        .update({
            job_allocation: Jobassignment.id,
            availability: "busy",
        })
        .eq("id", technician_id)
        .select("id, job_allocation, availability");

    if (techError) {
        return { error: techError.message };
    }
    return { Jobassignment: Jobassignment.id, technician_id: technician_id };
}



export async function assignTechnicianToJob({
    jobId,
    technicianId,
}: {
    jobId: number
    technicianId: string
}) {
    const supabase = await createClient()

    // Step 1: Assign technician to the job
    const { data: jobUpdateData, error: jobError } = await supabase
        .from('job_assignments')
        .update({
            technician_id: technicianId,
            status: 'assigned',
        })
        .eq('id', jobId)
        .select('id, technician_id, status')

    if (jobError) {
        console.error('❌ Failed to assign technician to job:', jobError)
        return { success: false, error: jobError.message }
    }

    // Step 2: Update technician status
    const { data: technicianUpdateData, error: techError } = await supabase
        .from('technicians')
        .update({ availability: 'busy' })
        .eq('id', technicianId)
        .select('id, availability')

    if (techError) {
        console.error('❌ Failed to update technician status:', techError)
        return { success: false, error: techError.message }
    }

    console.log('✅ Technician successfully assigned and marked busy.')
    return {
        success: true,
        job: jobUpdateData[0],
        technician: technicianUpdateData[0],
    }
}
