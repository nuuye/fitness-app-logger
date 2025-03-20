// middleware/authMiddleware.js
import { NextResponse } from "next/server";
import { verifyTokenRequest } from "./services/user";

export default async function authMiddleware(req) {
    try {
        const token = req.cookies.get("jwtToken")?.value;
        if (!token) {
            const signinUrl = new URL("/signin", req.url);
            return NextResponse.redirect(signinUrl);
        }

        const isLogged = await verifyTokenRequest(token); // Pass token explicitly
        if (!isLogged) {
            const signinUrl = new URL("/signin", req.url);
            return NextResponse.redirect(signinUrl);
        }

        return NextResponse.next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        const signinUrl = new URL("/signin", req.url);
        return NextResponse.redirect(signinUrl);
    }
}

// Define the paths where this middleware should run
export const config = {
    matcher: ["/dashboard/:path*", "/dashboard"], // Ensures middleware runs on /dashboard and subroutes
};
