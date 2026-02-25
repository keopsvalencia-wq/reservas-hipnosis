import { NextResponse } from 'next/server';
import { getBusySlots, getBusyRange } from '@/lib/google-calendar';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    try {
        if (start && end) {
            const busySlots = await getBusyRange(start, end);
            return NextResponse.json({ success: true, busySlots });
        }

        if (!date) {
            return NextResponse.json({ success: false, message: 'Falta la fecha o el rango (start/end)' }, { status: 400 });
        }

        const busySlots = await getBusySlots(date);
        return NextResponse.json({ success: true, busySlots });
    } catch (error: any) {
        console.error('❌ Error in /api/availability:', error.message);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
