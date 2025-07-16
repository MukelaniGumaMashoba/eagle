"use server"

import { createClient } from "@/lib/supabase/server";


interface Company {

}

interface Admin {

}


export async function RegisterCompany(formData: FormData) {
    console.log("Register Company")
    const supabase = await createClient();
    const { data, error } = await supabase.from('companies').insert({
        name: "Test Company",
        address: "123 Main St",
        city: "Anytown",
        state: "CA",
        zip: "12345",
    })
}


export function addUser() {

}


