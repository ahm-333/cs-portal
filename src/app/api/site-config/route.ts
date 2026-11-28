import { NextResponse } from "next/server";
import { getEffectiveSiteSettings } from "@/lib/db/ensure-tables";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await getEffectiveSiteSettings();

  return NextResponse.json(
    {
      announcementEnabled: settings.announcementEnabled,
      announcementText: settings.announcementText,
      announcementAudience: settings.announcementAudience,
      vodafoneCashNumber: settings.vodafoneCashNumber,
      instaPayHandle: settings.instaPayHandle,
      registrationOpen: settings.registrationOpen,
      maxDevicesPerUser: settings.maxDevicesPerUser,
      aiDailyLimit: settings.aiDailyLimit,
    },
    {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    }
  );
}
