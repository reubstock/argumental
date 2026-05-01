import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { addCharity, getAllCharities } from "@/lib/charities";

export async function GET() {
  return NextResponse.json({ charities: getAllCharities() });
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Body must be an object" }, { status: 400 });
  }
  const b = body as Record<string, unknown>;

  // Required string fields
  for (const field of ["name", "url", "focus", "mission"]) {
    if (typeof b[field] !== "string" || (b[field] as string).trim() === "") {
      return NextResponse.json(
        { error: `Missing or empty required field: ${field}` },
        { status: 400 },
      );
    }
  }

  // URL sanity: must be http(s)
  const url = (b.url as string).trim();
  if (!/^https?:\/\//i.test(url)) {
    return NextResponse.json(
      { error: "url must start with http:// or https://" },
      { status: 400 },
    );
  }

  // Optional hero image: if provided, allow http(s) or local /charities/...
  const heroRaw = typeof b.heroImage === "string" ? b.heroImage.trim() : "";
  if (heroRaw && !/^(https?:\/\/|\/)/.test(heroRaw)) {
    return NextResponse.json(
      { error: "heroImage must be a URL or a path beginning with /" },
      { status: 400 },
    );
  }

  const charity = addCharity({
    name: b.name as string,
    url,
    focus: b.focus as string,
    mission: b.mission as string,
    metric: typeof b.metric === "string" ? b.metric : undefined,
    heroImage: heroRaw || undefined,
    id: typeof b.id === "string" ? b.id : undefined,
  });

  // Re-render /charities so the new entry shows up on next request
  revalidatePath("/charities");

  return NextResponse.json({ charity }, { status: 201 });
}
