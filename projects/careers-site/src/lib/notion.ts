import { Client } from "@notionhq/client";

if (!process.env.NOTION_API_KEY) {
    console.warn("Missing NOTION_API_KEY environment variable");
}

export const notion = new Client({
    auth: process.env.NOTION_API_KEY,
});

export const HIRING_DB = process.env.NOTION_HIRING_DB!;
export const INQUIRIES_DB = process.env.NOTION_INQUIRIES_DB!;

// ── Types ────────────────────────────────────────────────────

export interface ApplicationPayload {
    fullName: string;
    age: string;
    location: string;
    whatsapp: string;
    linkedIn: string;
    occupation: string;
    position: string;
    whyUs: string;
    resumeLine: string;
}

export interface InquiryPayload {
    fullName: string;
    email: string;
    phone: string;
    company: string;
    inquiryType: string;
    summary: string;
    document?: string;
}

// ── Helpers ──────────────────────────────────────────────────

function richText(content: string) {
    return { rich_text: [{ text: { content: content || "" } }] };
}

// ── Create Application → Hiring Profiles ─────────────────────

export async function createApplication(data: ApplicationPayload) {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const properties: any = {
            "Full Name": { title: [{ text: { content: data.fullName } }] },
            "Age": { number: parseInt(data.age, 10) },
            "Country": richText(data.location),
            "Current Occupation": richText(data.occupation),
            "WhatsApp Number": { number: parseInt(data.whatsapp.replace(/\D/g, ""), 10) },
            "Social Link": { url: data.linkedIn },
            "Target Scope": richText(data.position),
            "Why do you want to work with us specifically?": richText(data.whyUs),
        };

        if (data.resumeLine) {
            properties["Resume"] = { url: data.resumeLine };
        }

        const page = await notion.pages.create({
            parent: { database_id: HIRING_DB },
            properties,
        });
        return { success: true, pageId: page.id };
    } catch (error) {
        console.error("Notion createApplication error:", error);
        throw error;
    }
}


// ── Create Inquiry → Strategic Inquires ──────────────────────

export async function createInquiry(data: InquiryPayload) {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const properties: any = {
            "Full Name": { title: [{ text: { content: data.fullName } }] },
            "Email": { email: data.email },
            "Inquiry Type": { select: { name: data.inquiryType } },
            "Summary": richText(data.summary),
            "Submission Status": { select: { name: "New" } },
        };

        if (data.company) {
            properties["Company / Entity"] = richText(data.company);
        }
        if (data.phone) {
            const phoneInt = parseInt(data.phone.replace(/\D/g, ""), 10);
            if (!isNaN(phoneInt)) {
                properties["Phone"] = { number: phoneInt };
            }
        }
        if (data.document) {
            properties["Supporting Documents"] = {
                files: [
                    {
                        name: "Supporting Document",
                        type: "external",
                        external: {
                            url: data.document,
                        },
                    },
                ],
            };
        }

        const page = await notion.pages.create({
            parent: { database_id: INQUIRIES_DB },
            properties,
        });
        return { success: true, pageId: page.id };
    } catch (error) {
        console.error("Notion createInquiry error:", error);
        throw error;
    }
}
