export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: "TENANT" | "LANDLORD";
}

export interface LoginInput {
  email: string;
  password: string;
}
