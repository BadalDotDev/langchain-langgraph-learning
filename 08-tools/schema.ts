import { z } from "zod";

export const WeatherSchema = z.object({
  city: z.string().describe("City name"),

  unit: z.enum(["celsius", "fahrenheit"]).describe("Temperature unit"),
});

export const CalculatorSchema = z.object({
  a: z.number(),

  b: z.number(),

  operation: z.enum(["add", "subtract", "multiply", "divide"]),
});
