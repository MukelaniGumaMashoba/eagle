"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function login(formData: FormData) {
  const supabase = await createClient();
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  const { error, data: resData } = await supabase.auth.signInWithPassword(data);
  if (error) {
    console.log(error);
    redirect(`/login?message=${error.message}`);
  }

  console.log(resData.user.user_metadata.role);
  const cookieStore = await cookies()
  cookieStore.set('access_token', resData.session.access_token)
  cookieStore.set('refresh_token', resData.session.refresh_token)
  cookieStore.set('role', resData.user.user_metadata.role)
  
  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const role = formData.get("role") as string;
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        name: formData.get("name") as string,
        role: role,
      },
    },
  };

  const { error } = await supabase.auth.signUp(data);
  if (
    role !== "fleet manager" &&
    role !== "customer" &&
    role !== "call centre" &&
    role !== "cost centre" 
  ) {
    redirect(`/signup?message=Role not found`);
  }

  if (error) {
    console.log(error);
    redirect("/signup?message=" + error.message);
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function getUser() {
  const supabase = await createClient();
  const { error, data } = await supabase.auth.getUser();

  if (error) {
    return redirect(`/error?error=${error.message}`);
  }

  const { data: user, error: error2 } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();

  if (error2) {
    return redirect(`/error?error=${error2.message}`);
  }

  data.user.user_metadata = { ...user };

  return data;
}

export async function acceptInvite(formData: FormData) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.verifyOtp({
    token: formData.get("access_token") as string,
    type: "invite",
    email: formData.get("email") as string,
  });

  console.log(data, error);

  if (error) {
    redirect(`/error?message=${error.message}`);
  }

  // revalidatePath("/", "layout");
  // redirect("/");
}

export async function signInWithEmail(formData: FormData) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.admin.inviteUserByEmail(
    formData.get("email") as string,

    {
      // redirectTo: "",
      // redirectTo: "http://localhost:3000/signup",
      data: {
        role: formData.get("role") as string,
      },
    }
  );
  if (error) {
    console.log(error);
    redirect(`/error?message=${error.message}`);
  } else {
    redirect("/");
  }
}


export async function ChangePassword(formData: FormData) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    redirect(`/error?message=${error.message}`);
  }
  const { data: user, error: errors } = await supabase.auth.updateUser({
    password: formData.get("password") as string,
  });
  if (errors) {
    redirect(`/error?message=${errors.message}`);
  }
}


export async function sendPasswordReset(email: string) {
  const supabase = await createClient();
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "",
  });
}
export async function sendPasswordResetComplete(email: string, newpassword: string, token: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.exchangeCodeForSession(token);

  if (error) {
    redirect(`/error?message=${error.message}`);
  }

  const { error: error2 } = await supabase.auth.updateUser({
    email: email,
    password: newpassword,
  });

  if (error2) {
    redirect(`/error?message=${error2.message}`);
  }

  redirect("/");

}


export async function getUserId() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    redirect(`/error?message=${error.message}`);
  }
  console.log("The data is", data.user?.id)
  return data.user.id;
}
