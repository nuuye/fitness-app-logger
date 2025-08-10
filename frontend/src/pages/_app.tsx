import "../styles/global.scss";
import Head from "next/head";
import theme from "../styles/theme";
import { ThemeProvider } from "@mui/material";
import "@fontsource/roboto";
import { UserProvider } from "../context/userContext";
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>Fitlogs</title>
                <link rel="icon" type="image/png" href="/images/dumbbell_icon.png" />
                <link rel="shortcut icon" href="/images/dumbbell_icon.png" />
            </Head>
            <ThemeProvider theme={theme}>
                <SessionProvider session={pageProps.session}>
                    <UserProvider>
                        <Component {...pageProps} />
                    </UserProvider>
                </SessionProvider>
            </ThemeProvider>
        </>
    );
}
