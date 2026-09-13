import { redirect } from "next/navigation";

export default function StudentsRedirect() {
  redirect("/demo?role=student");
}
