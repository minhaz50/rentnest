// A small helper so controllers can just do: throw new ApiError(404, "Not found")
export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}
