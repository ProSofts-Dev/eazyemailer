import { getServerSession } from "next-auth";
import { authOptions } from "./config";

export async function getSession(): Promise<any> {
  return await getServerSession(authOptions);
}