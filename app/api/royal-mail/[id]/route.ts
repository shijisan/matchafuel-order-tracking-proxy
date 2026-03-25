import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest, 
    { params }: { params: Promise<{ id: string }> }
) {
    const {id: mailPieceId} = await params;

    const origin = req.headers.get("origin") || "";
    const allowedOrigins = ["https://matchafuel.com", "https://www.matchafuel.com"];
    
    // Check if the request is coming from your site
    const isAllowed = allowedOrigins.includes(origin);

    try {
        const res = await fetch(`https://api.royalmail.net/mailpieces/v2/${mailPieceId}/events`, {
            headers: {
                "X-Accept-RMG-Terms": "yes",
                "X-IBM-Client-Secret": `${process.env.RM_CLIENT_SECRET}`,
                "X-IBM-Client-Id": `${process.env.RM_CLIENT_ID}`,
                "accept": "application/json",
            }
        });

        const data = await res.json();

        const response = NextResponse.json(data, { status: res.status });

        if (isAllowed) {
            response.headers.set("Access-Control-Allow-Origin", origin);
            response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
            response.headers.set("Access-Control-Allow-Headers", "Content-Type, X-Accept-RMG-Terms");
        }

        return response;


    } catch (err) {
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }

}

export async function OPTIONS(request: NextRequest) {
    const origin = request.headers.get("origin") || "";
    return new NextResponse(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, X-Accept-RMG-Terms",
        },
    });
}