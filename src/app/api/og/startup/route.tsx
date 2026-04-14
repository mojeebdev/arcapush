
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const name      = searchParams.get("name")     || "Untitled Product";
  const tagline   = searchParams.get("tagline")  || "A vibe-coded startup";
  const category  = searchParams.get("category") || "Other";
  const logo      = searchParams.get("logo")     || "";
  const banner    = searchParams.get("banner")   || "";
  const founder   = searchParams.get("founder")  || "";


  const shortTagline = tagline.length > 120 ? tagline.slice(0, 117) + "..." : tagline;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          background: "#0e0e0c",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* banner image as blurred bg — only if available */}
        {banner && (
          <img
            src={banner}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.08,
            }}
          />
        )}

        {/* accent top bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "#5b2bff",
            display: "flex",
          }}
        />

        {/* content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "60px 72px",
            height: "100%",
            position: "relative",
          }}
        >
          {/* top: arcapush wordmark */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#5b2bff",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              ARCAPUSH
            </span>
            {/* category chip */}
            <span
              style={{
                fontSize: "13px",
                color: "#888580",
                border: "1px solid #333",
                borderRadius: "20px",
                padding: "4px 14px",
                letterSpacing: "0.04em",
              }}
            >
              {category}
            </span>
          </div>

          {/* middle: logo + name + tagline */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
              {logo && (
                <img
                  src={logo}
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "16px",
                    objectFit: "cover",
                    border: "1px solid #2a2a28",
                  }}
                />
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span
                  style={{
                    fontSize: "52px",
                    fontWeight: 900,
                    color: "#f0ede8",
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {name}
                </span>
              </div>
            </div>

            <span
              style={{
                fontSize: "22px",
                color: "#888580",
                lineHeight: 1.5,
                maxWidth: "860px",
              }}
            >
              {shortTagline}
            </span>
          </div>

          {/* bottom: indexed badge + founder */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {/* indexed dot */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "#1a2a1a",
                  border: "1px solid #2a3a2a",
                  borderRadius: "20px",
                  padding: "6px 14px",
                }}
              >
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#4ade80",
                    display: "flex",
                  }}
                />
                <span style={{ fontSize: "13px", color: "#4ade80" }}>
                  Indexed on Arcapush
                </span>
              </div>
            </div>

            {founder && (
              <span style={{ fontSize: "14px", color: "#555552" }}>
                by {founder}
              </span>
            )}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}