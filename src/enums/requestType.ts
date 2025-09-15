const RequestType = {
  GET: "GET",
  POST: "POST"
} as const;

export type RequestType = typeof RequestType[keyof typeof RequestType];