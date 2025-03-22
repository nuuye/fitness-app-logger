import { ReactNode, useEffect, useState } from "react";
import { verifyTokenRequest } from "../../services/user";
import { useRouter } from "next/router";

interface authWrapperProps {
    children: ReactNode;
}

export default function AuthWrapper({ children }: authWrapperProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        const logginRequest = async () => {
            try {
                setIsLoading(true);
                const _isLoggedIn = await verifyTokenRequest();
                setIsLoggedIn(_isLoggedIn);
                if (!_isLoggedIn) {
                    router.push("/signin");
                }
                setIsLoading(false);
            } catch (err) {
                console.log(err);
            }
        };

        logginRequest();
    }, [router]);

    return <>{isLoggedIn ? children : null}</>;
}
