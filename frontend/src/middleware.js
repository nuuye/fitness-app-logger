// middleware/authMiddleware.js
import { NextResponse } from "next/server";
import { verifyTokenRequest } from "./services/user";

export default async function authMiddleware(req) {
    try {
        const token = req.cookies.get("jwtToken")?.value || null;

        const isLogged = await verifyTokenRequest(token);

        if (!token || !isLogged) {
            const signinUrl = new URL("/signin", req.url);
            return NextResponse.redirect(signinUrl);
        }
        // If token is valid, proceed with the request
        return NextResponse.next();
    } catch (error) {
        const signinUrl = new URL("/signin", req.url);
        return NextResponse.redirect(signinUrl);
    }
}

// Define the paths where this middleware should run
export const config = {
    matcher: ["/dashboard/:path*", "/dashboard"], // Ensures middleware runs on /dashboard and subroutes
};
