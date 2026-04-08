import { Divider } from "@mui/material";
import type { JSX } from "react";


interface HeroProps {
    title?: string;
    subtitle?: string;
}

function Hero({ title="Discover new jobs with us", subtitle="Tell us about your experience and skills." }: HeroProps): JSX.Element {   
    return (
        <>
        <Divider />
        <section style={{ 
            backgroundColor: "var(--primary-color)",
            padding: "20px 50px", 
            textAlign: "center", 
            color: "white" }}>

            <h1>{title}</h1>
            <p>{subtitle}</p>

        </section>
        </>
    )
};
export default Hero;
