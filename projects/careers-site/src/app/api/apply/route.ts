import { NextRequest, NextResponse } from "next/server";
import { createApplication, type ApplicationPayload } from "@/lib/notion";

const VALID_POSITIONS = [
    "Marketing",
    "Sales",
    "Operations",
    "Creative / Content",
    "AI / Automation",
    "Not sure",
];

export async function POST(request: NextRequest) {
    try {
        const body: ApplicationPayload = await request.json();
        
        // --- Validation ---
        const errors: Record<string, string> = {};

        if (!body.fullName?.trim()) errors.fullName = "Full name is required";
        if (!body.age || isNaN(Number(body.age)) || Number(body.age) < 16 || Number(body.age) > 99)
            errors.age = "Valid age (16-99) is required";
        if (!body.location?.trim()) errors.location = "Country is required";
        if (!body.whatsapp || body.whatsapp.replace(/\D/g, "").length < 5)
            errors.whatsapp = "Valid WhatsApp number is required";
        if (!body.linkedIn?.trim()) errors.linkedIn = "Socials URL is required";
        else {
            try { new URL(body.linkedIn); } catch { errors.linkedIn = "Must be a valid URL"; }
        }
        if (!body.position || !VALID_POSITIONS.includes(body.position))
            errors.position = "Valid position is required";
        if (!body.whyUs?.trim()) errors.whyUs = "This field is required";
        if (!body.resumeLine?.trim()) errors.resumeLine = "Resume is required";
        else {
            try { new URL(body.resumeLine); } catch { errors.resumeLine = "Resume upload failed"; }
        }

        if (Object.keys(errors).length > 0) {
            return NextResponse.json({ success: false, errors }, { status: 400 });
        }

        const result = await createApplication(body);
        return NextResponse.json({ success: true, id: result.pageId, link: body.resumeLine }, { status: 201 });
    } catch (error: unknown) {
        const err = error as any;
        console.error("Application submission failed:", err);

        if (err.code) {
            console.error(`Notion Error Code: ${err.code}`);
            console.error(`Notion Error Message: ${err.message}`);
        }

        return NextResponse.json(
            {
                success: false,
                error: "Failed to submit application. Please try again.",
                details: err.message || "Unknown error",
            },
            { status: 500 }
        );
    }
}
