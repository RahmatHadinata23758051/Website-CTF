import type { Category } from "../../types";

export function CategoryBadge({ category }: { category: Category }) {
  const getCategoryStyles = (cat: Category) => {
    switch (cat) {
      case "Web Exploitation":
        return "text-[#7B9FFF] border-[#7B9FFF]/15 bg-[#7B9FFF]/3";
      case "Pwn":
        return "text-cyber-crimson border-cyber-crimson/15 bg-cyber-crimson/3";
      case "Cryptography":
        return "text-cyber-cyan border-cyber-cyan/15 bg-cyber-cyan/3";
      case "Forensics":
        return "text-cyber-emerald border-cyber-emerald/15 bg-cyber-emerald/3";
      case "Reverse Engineering":
        return "text-[#FF9F7B] border-[#FF9F7B]/15 bg-[#FF9F7B]/3";
      default:
        return "text-fg-muted border-border-ui bg-surface/50";
    }
  };

  const getAbbreviation = (cat: Category) => {
    switch (cat) {
      case "Web Exploitation":
        return "Web";
      case "Pwn":
        return "Pwn";
      case "Cryptography":
        return "Crypto";
      case "Forensics":
        return "Forensics";
      case "Reverse Engineering":
        return "Reverse";
      case "Steganography":
        return "Steg";
      case "OSINT":
        return "OSINT";
      default:
        return cat;
    }
  };

  return (
    <span
      className={`font-mono text-[9px] uppercase tracking-[0.15em] border px-2.5 py-0.5 rounded-none font-bold select-none ${getCategoryStyles(
        category
      )}`}
    >
      {getAbbreviation(category)}
    </span>
  );
}
