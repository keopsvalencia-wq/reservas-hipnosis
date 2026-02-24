import { NextResponse } from 'next/server';
import { getBusySlots } from '@/lib/google-calendar';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
        return NextResponse.json({ success: false, message: 'Falta la fecha' }, { status: 400 });
    }

    try {
        const busySlots = await getBusySlots(date);
        return NextResponse.json({ success: true, busySlots });
    } catch (error: any) {
        console.error('❌ Error in /api/availability:', error.message);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
