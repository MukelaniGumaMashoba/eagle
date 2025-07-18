"use server"


import { createClient } from "@/lib/supabase/server"


let breakdownno = 0;


export async function AvailableBreakdown() {
    const supabase = await createClient();
    const { data: ActiveBreakDown, error } = await supabase
        .from('breakdowns')
        .select("*", { count: "exact", head: true })
        .eq('status', 'available')

    return ActiveBreakDown;
}


export async function NoOfVehicles() {
    const supabase = await createClient();
    const { data: ActiveBreakDown, error } = await supabase
        .from('breakdown')
        .select("*", { count: "exact", head: true });
}



export async function NoofBreakDowns() {
    const supabase = await createClient();
    const { data: ActiveBreakDown, error } = await supabase
        .from('breakdowns')
        .select("*", { count: "exact", head: true })
        .eq('status', 'available')
}


export async function AvailableTechnicians() {
    const supabase = await createClient();
    const { data: ActiveBreakDown, error } = await supabase
        .from('technicians')
        .select("*", { count: "exact", head: true })
        .eq('status', 'available')
}

export async function TodayBreaKdown() {
    const supabase = await createClient();
    const { data: ActiveBreakDown, error } = await supabase
        .from('')
        .select("*", { count: "exact", head: true })
        .eq('status', 'available')
}


const today = new Date();
const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
const endOfDay = new Date(
    today.setHours(23, 59, 59, 999)
).toISOString();

export async function NumberofBreakdowns() {
    const supabase = await createClient();
    const { count: breakdown, error: fileError } = await supabase
        .from("file")
        .select("*", { count: "exact", head: true });
    if (fileError) {
        throw fileError;
    }

}


