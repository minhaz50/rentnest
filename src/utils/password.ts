import bcrypt from "bcryptjs";

export const hashPassword = (plainText: string) => {
  return bcrypt.hash(plainText, 10);
};

export const comparePassword = (plainText: string, hashed: string) => {
  return bcrypt.compare(plainText, hashed);
};
