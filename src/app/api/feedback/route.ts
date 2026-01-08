import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { feedback } = await request.json();
        const webhookUrl = process.env.SLACK_WEBHOOK_URL || process.env.NEXT_PUBLIC_SLACK_WEBHOOK_URL;

        if (!webhookUrl) {
            console.error('Slack Webhook URL not configured');
            return NextResponse.json({ error: 'Feedback service unavailable' }, { status: 503 });
        }

        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: `🚀 *New Feedback from Antigravity User!*\n\n> ${feedback}`,
            }),
        });

        if (!response.ok) {
            throw new Error(`Slack API responded with status ${response.status}`);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error sending feedback to Slack:', error);
        return NextResponse.json({ error: 'Failed to send feedback' }, { status: 500 });
    }
}
