export interface CreateRentalRequestInput {
  propertyId: string;
  moveInDate?: string;
  message?: string;
}

export type RentalStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ACTIVE"
  | "COMPLETED";
