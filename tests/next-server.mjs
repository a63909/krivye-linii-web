export { NextResponse } from "next/server.js";
export const deferred = [];
export function after(callback) { deferred.push(callback); }
