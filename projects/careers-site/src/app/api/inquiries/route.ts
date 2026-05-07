import { NextRequest, NextResponse } from "next/server";
import { createInquiry, type InquiryPayload } from "@/lib/notion";

const VALID_TYPES = ["Acquisition", "Partnership", "Investment", "Other"];

export async function POST(request: NextRequest) {
    try {
        const body: InquiryPayload = await request.json();

        // --- Validation ---
        const errors: Record<string, string> = {};

        if (!body.fullName?.trim()) errors.fullName = "Full name is required";
        if (!body.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email))
            errors.email = "Valid email is required";
        if (!body.inquiryType || !VALID_TYPES.includes(body.inquiryType))
            errors.inquiryType = "Valid inquiry type is required";
        if (!body.summary?.trim()) errors.summary = "Summary is required";

        if (Object.keys(errors).length > 0) {
            return NextResponse.json({ success: false, errors }, { status: 400 });
        }

        const result = await createInquiry(body);
        return NextResponse.json({ success: true, id: result.pageId }, { status: 201 });
    } catch (error: unknown) {
        const err = error as any;
        console.error("Inquiry submission failed:", err);
        
        // Log Notion-specific error details if available
        if (err.code) {
            console.error(`Notion Error Code: ${err.code}`);
            console.error(`Notion Error Message: ${err.message}`);
        }

        return NextResponse.json(
            { 
                success: false, 
                error: "Failed to submit inquiry.",
                details: err.message || "Unknown error" 
            },
            { status: 500 }
        );
    }
}
