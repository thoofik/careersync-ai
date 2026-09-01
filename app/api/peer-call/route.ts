import { db } from "@/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

const callIdOk = (value: unknown): value is string =>
  typeof value === "string" && /^[a-zA-Z0-9_-]{1,80}$/.test(value);

export async function POST(request: Request) {
  if (!db) {
    return NextResponse.json({ error: "Firebase Admin is not configured." }, { status: 500 });
  }

  const body = await request.json();
  const callId = body?.callId;
  if (!callIdOk(callId)) {
    return NextResponse.json({ error: "Invalid call." }, { status: 400 });
  }

  const ref = db.collection("peer-calls").doc(callId);

  if (body?.ice?.collection === "hostIce" || body?.ice?.collection === "guestIce") {
    await ref.collection(body.ice.collection).add(body.ice.data || {});
    return NextResponse.json({ ok: true });
  }

  const data = { ...(body?.data || {}) };
  if (data.answer === null) {
    data.answer = FieldValue.delete();
  }

  await ref.set(data, { merge: true });
  return NextResponse.json({ ok: true });
}
