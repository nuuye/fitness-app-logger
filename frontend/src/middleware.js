// middleware/authMiddleware.js
import { NextResponse } from "next/server";
import { verifyTokenRequest } from "./services/user";

export default async function authMiddleware(req) {
    return NextResponse.next();
    // try {
    //     const token = req.cookies.get("jwtToken")?.value;
    //     console.log("Cookies received:", req.cookies);
    //     console.log("Token from cookie:", token);
    //     if (!token) {
    //         console.log("No token found, redirecting to /signin");
    //         const signinUrl = new URL("/signin", req.url);
    //         return NextResponse.redirect(signinUrl);
    //     }

    //     const isLogged = await verifyTokenRequest(token); // Pass token explicitly
    //     console.log("Token verification result:", isLogged);
    //     if (!isLogged) {
    //         console.log("Token invalid or verification failed, redirecting to /signin");
    //         const signinUrl = new URL("/signin", req.url);
    //         return NextResponse.redirect(signinUrl);
    //     }
    //     console.log("Token valid, proceeding to next");
    //     return NextResponse.next();
    // } catch (error) {
    //     console.error("Auth middleware error:", error);
    //     const signinUrl = new URL("/signin", req.url);
    //     return NextResponse.redirect(signinUrl);
    // }
}

// Define the paths where this middleware should run
export const config = {
    matcher: ["/dashboard/:path*", "/dashboard"], // Ensures middleware runs on /dashboard and subroutes
};
