"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  HiOutlineHome,
  HiOutlineSquares2X2,
  HiOutlineLightBulb,
  HiOutlineUser,
  HiHome,
  HiSquares2X2,
  HiLightBulb,
  HiOutlineChartBar,
  HiChartBar,
} from "react-icons/hi2";

const NAV_ITEMS = [
  { href: "/",         label: "Home",     Icon: HiOutlineHome,         ActiveIcon: HiHome         },
  { href: "/registry", label: "Registry", Icon: HiOutlineSquares2X2,   ActiveIcon: HiSquares2X2   },
  { href: "/submit",     label: "List",      Icon: HiOutlineLightBulb, ActiveIcon: HiLightBulb,   isAccent: true },
  { href: "/pricing",    label: "Boost",     Icon: HiOutlineUser,      ActiveIcon: HiOutlineUser      },
  ...(status === "authenticated"
      ? [{ href: "/dashboard", label: "Dashboard", Icon: HiOutlineChartBar, ActiveIcon: HiChartBar }]
      : []   ),
];

export function MobileNav() {
  const pathname = usePathname();
  const { status } = useSession();

  return (
    <>
      {/* Spacer so content doesn't hide behind nav */}
      <div className="h-16 lg:hidden" />

      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50"
        style={{
          background:    "rgba(247,246,242,0.94)",
          backdropFilter:"blur(16px)",
          borderTop:     "1px solid var(--border)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <div style={{ display: "flex", alignItems: "stretch" }}>
          {NAV_ITEMS.map(({ href, label, Icon, ActiveIcon, isAccent }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href));
            const Ico    = active ? ActiveIcon : Icon;

            if (isAccent) {
              return (
                <Link
                  key={href}
                  href={href}
                  style={{
                    flex:           1,
                    display:        "flex",
                    flexDirection:  "column",
                    alignItems:     "center",
                    justifyContent: "center",
                    padding:        "10px 4px",
                    textDecoration: "none",
                    gap:            "3px",
                  }}
                >
                  <div
                    style={{
                      width:          "36px",
                      height:         "36px",
                      borderRadius:   "12px",
                      background:     "var(--accent)",
                      display:        "flex",
                      alignItems:     "center",
                      justifyContent: "center",
                      marginBottom:   "2px",
                    }}
                  >
                    <Ico style={{ width: "18px", height: "18px", color: "#fff" }} />
                  </div>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "8px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)" }}>
                    {label}
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={href}
                href={href}
                style={{
                  flex:           1,
                  display:        "flex",
                  flexDirection:  "column",
                  alignItems:     "center",
                  justifyContent: "center",
                  padding:        "12px 4px 8px",
                  textDecoration: "none",
                  gap:            "3px",
                }}
              >
                <Ico
                  style={{
                    width:  "20px",
                    height: "20px",
                    color:  active ? "var(--accent)" : "var(--text-tertiary)",
                    transition: "color 0.15s",
                  }}
                />
                <span
                  style={{
                    fontFamily:    "var(--font-mono)",
                    fontSize:      "8px",
                    fontWeight:    600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color:         active ? "var(--accent)" : "var(--text-tertiary)",
                    transition:    "color 0.15s",
                  }}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}