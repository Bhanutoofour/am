import { NextResponse } from "next/server";

const countryNames = new Intl.DisplayNames(["en"], { type: "region" });

function countryNameFromCode(countryCode: string) {
  try {
    return countryNames.of(countryCode) || "";
  } catch {
    return "";
  }
}

export async function GET(request: Request) {
  const headers = new Headers(request.headers);
  const countryCode =
    headers.get("x-vercel-ip-country") ||
    headers.get("cf-ipcountry") ||
    headers.get("x-country-code") ||
    "";
  const normalizedCode = countryCode.toUpperCase();

  return NextResponse.json({
    countryCode: normalizedCode,
    country: countryNameFromCode(normalizedCode),
  });
}
