// Adds `req.admin`, filled by the requireAuth middleware.
declare global {
  namespace Express {
    interface Request {
      admin?: { id: string; email: string };
    }
  }
}

export {};
