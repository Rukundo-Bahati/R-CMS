import { Portal } from "@/contexts/AuthContext";

export interface CredentialRecord {
  email: string;
  password: string;
  role: Portal;
  name: string;
}

export const credentials: CredentialRecord[] = [
  {
    email: "president@church.com",
    password: "President@123",
    role: "president",
    name: "President",
  },
  {
    email: "grandmere@church.com",
    password: "GrandMere@123",
    role: "grand_pere_mere",
    name: "Grand Mère",
  },
  {
    email: "accountant@church.com",
    password: "Accountant@123",
    role: "accountant",
    name: "Church Accountant",
  },
  {
    email: "family@church.com",
    password: "Family@123",
    role: "family",
    name: "Family Member",
  },
  {
    email: "choir@church.com",
    password: "Choir@123",
    role: "choir",
    name: "Choir Member",
  },
  {
    email: "intercessor@church.com",
    password: "Intercessor@123",
    role: "intercessors",
    name: "Prayer Intercessor",
  },
  {
    email: "usher@church.com",
    password: "Usher@123",
    role: "ushers",
    name: "Church Usher",
  },
  {
    email: "pastor@church.com",
    password: "Pastor@123",
    role: "pastor",
    name: "Pastor",
  },
];

export function findCredential(email: string): CredentialRecord | undefined {
  return credentials.find((c) => c.email.toLowerCase() === email.toLowerCase());
}
