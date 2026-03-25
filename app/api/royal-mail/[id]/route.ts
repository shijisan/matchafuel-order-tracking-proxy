import { NextRequest, NextResponse } from "next/server";

export async function GET({ params }: { params: { id: string } }) {
    const mailPieceId = params.id;

    try {
        const res = await fetch(`https://api.royalmail.net/mailpieces/v2/${mailPieceId}/events`, {
            headers: {
                "X-Accept-RMG-Terms": "yes",
                "X-IBM-Client-Secret": `${process.env.RM_CLIENT_SECRET}`,
                "X-IBM-Client-Id": `${process.env.RM_CLIENT_ID}`,
                "accept": "application/json",
            }
        });

        if (!res.ok) {
            const errorData = await res.json();
            return NextResponse.json({ error: errorData }, { status: res.status });
        }

        return NextResponse.json({ message: "Success", res }, { status: 200 });

    } catch (err) {
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }

}