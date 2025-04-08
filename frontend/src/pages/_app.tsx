import "../styles/global.scss";
import Head from "next/head";
import theme from "../styles/theme";
import { ThemeProvider } from "@mui/material";
import "@fontsource/roboto";
import { UserProvider } from "../context/userContext";

export default function App({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>Fitlogs – Your fitness logger</title>
            </Head>
            <ThemeProvider theme={theme}>
                <UserProvider>
                    <Component {...pageProps} />
                </UserProvider>
            </ThemeProvider>
        </>
    );
}
