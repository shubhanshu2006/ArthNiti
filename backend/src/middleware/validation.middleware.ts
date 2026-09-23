import type { Request, Response, NextFunction } from "express";
import { type ZodSchema, ZodError } from "zod";

/**
 * Creates a validation middleware for the given Zod schemas.
 * Validates request body, params, and/or query against the provided schemas.
 *
 * Usage:
 *   router.post("/", validate({ body: myBodySchema }), handler);
 */
export function validate(schemas: {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
}) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      if (schemas.params) {
        req.params = schemas.params.parse(req.params) as typeof req.params;
      }
      if (schemas.query) {
        req.query = schemas.query.parse(req.query) as typeof req.query;
      }
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = err.issues.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        }));

        res.status(400).json({
          error: true,
          statusCode: 400,
          message: "Validation failed",
          details: errors,
        });
        return;
      }
      next(err);
    }
  };
}
