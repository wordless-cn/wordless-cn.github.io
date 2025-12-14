import { type LoaderFunctionArgs, redirect } from "react-router";

export async function homeLoader({ params }: LoaderFunctionArgs) {
  console.log("home loader", params);
  return redirect("/book/CET4_2");
}
