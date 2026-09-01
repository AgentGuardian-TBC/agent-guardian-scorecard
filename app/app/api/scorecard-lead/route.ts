import { NextRequest, NextResponse } from 'next/server';

let leads: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, answers, ts } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const lead = {
      id: Math.random().toString(36).substr(2, 9),
      name: name || 'Anonymous',
      email,
      answers,
      ts,
      capturedAt: new Date().toISOString()
    };

    leads.push(lead);
    console.log(`✓ Lead captured: ${email}`);

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      message: 'Lead captured.'
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to process lead' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    leadsCount: leads.length,
    leads: leads.map(l => ({ email: l.email, ts: l.capturedAt }))
  });
}
