import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import "./stories.css";

const displayFont = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-story-display",
});

const bodyFont = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-story-body",
});

export default function StoriesLayout({ children }: { children: React.ReactNode }) {
  return <div className={`stories-root ${displayFont.variable} ${bodyFont.variable}`}>{children}</div>;
}
