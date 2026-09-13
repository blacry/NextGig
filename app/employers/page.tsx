import { redirect } from "next/navigation";

export default function EmployersRedirect() {
  redirect("/demo?role=recruiter");
}
