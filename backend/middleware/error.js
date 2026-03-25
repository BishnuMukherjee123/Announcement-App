/**
 * Central Error Dispatcher Middleware
 * @description Standardizes the JSON payload format anytime the application errors. 
 * Prevents hideous HTML stack trace renders spilling over externally to clients making an API.
 */
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Explicit local log tracking
  
  // Normalize 200 codes (if a route manually threw an exception but forgot to update the status code)
  // Revert it purely back to 500 (Internal System Fail)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode; 
  res.status(statusCode);
  
  // Conditionally restrict raw Error stacks in production preventing massive code architecture leaks. 
  res.json({
    success: false,
    error: err.message || "Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

/**
 * 404 Fallback Boundary
 * @description Triggers exclusively if a frontend request queries a URL ending point that doesn't exist among the routers.
 * Ensures an explicit 404 failure with message formatting over Express' default browser response timeout behavior.
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); 
};
