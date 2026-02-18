"use client";

import { Share2, Loader2 } from "lucide-react";
import { useState } from "react";

interface ShareStoryProps {
  title: string;
  slug: string;
  imageUrl: string | null;
  content: string;
  createdAt: Date;
  author: string;
}

export default function ShareStoryButton({
  title,
  slug,
  imageUrl,
  content,
  createdAt,
  author,
}: ShareStoryProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const getFirstImage = (html: string) => {
    if (!html) return null;
    const cleanHtml = html.split('\\"').join('"');
    const match = cleanHtml.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (!match) return null;
    return match[1].replace(/^[\\"]+|[\\"]+$/g, "").trim();
  };

  const stripHtml = (html: string) => {
    return html
      .replace(/<[^>]*>?/gm, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  const generateAndShare = async () => {
    setIsGenerating(true);

    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 1. Arka Plan
    ctx.fillStyle = "#F8F7F2";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    try {
      // --- MARKA YAZISI (BE LOG.) ---
      const brandBaseText = "BE LOG";
      const brandDot = ".";
      ctx.font = "bold 64px ui-monospace, monospace";
      ctx.letterSpacing = "2px";

      const baseWidth = ctx.measureText(brandBaseText).width;
      const dotWidth = ctx.measureText(brandDot).width;
      const totalWidth = baseWidth + dotWidth;

      const startX = (canvas.width - totalWidth) / 2;
      const brandY = 160;

      ctx.fillStyle = "#020617";
      ctx.textAlign = "left";
      ctx.fillText(brandBaseText, startX, brandY);

      ctx.fillStyle = "#f92743";
      ctx.fillText(brandDot, startX + baseWidth, brandY);
      ctx.letterSpacing = "0px";

      // 2. Kart Tasarımı
      const cardX = 80;
      const cardY = 250;
      const cardWidth = 920;
      const cardHeight = 1300; // Yükseklik 1420'den 1300'e indirildi

      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "rgba(0,0,0,0.06)";
      ctx.shadowBlur = 40;
      ctx.shadowOffsetY = 15;
      ctx.fillRect(cardX, cardY, cardWidth, cardHeight);
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // 3. Görsel Alanı
      const finalImageUrl = imageUrl || getFirstImage(content);
      if (finalImageUrl) {
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.src = finalImageUrl;
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
        ctx.drawImage(
          img,
          0,
          0,
          img.width,
          img.height,
          cardX,
          cardY,
          cardWidth,
          550,
        );
      }

      const cardPadding = 140;
      const maxContentWidth = cardWidth - (cardPadding - cardX) * 2;

      // 4. Tarih
      ctx.fillStyle = "#F92743";
      ctx.font = "bold 30px ui-monospace, monospace";
      const dateText = new Intl.DateTimeFormat("tr-TR").format(
        new Date(createdAt),
      );
      ctx.fillText(dateText.toUpperCase(), cardPadding, 880);

      // 5. Başlık
      ctx.fillStyle = "#020617";
      ctx.font = "700 42px Inter, system-ui, sans-serif";
      let words = title.split(" ");
      let line = "";
      let y = 980;

      for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + " ";
        let metrics = ctx.measureText(testLine);
        if (metrics.width > maxContentWidth && n > 0) {
          ctx.fillText(line, cardPadding, y);
          line = words[n] + " ";
          y += 90;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, cardPadding, y);

      // 6. İçerik
      ctx.fillStyle = "#334155";
      ctx.font = "400 36px Georgia, serif";
      let snippet = stripHtml(content).substring(0, 250) + "...";
      let snippetWords = snippet.split(" ");
      let snippetLine = "";
      let sy = y + 100;

      for (let n = 0; n < snippetWords.length; n++) {
        let testLine = snippetLine + snippetWords[n] + " ";
        let metrics = ctx.measureText(testLine);
        if (metrics.width > maxContentWidth && n > 0) {
          ctx.fillText(snippetLine, cardPadding, sy);
          snippetLine = snippetWords[n] + " ";
          sy += 65;
          // Kart yüksekliğine göre kesme sınırı (cardY + cardHeight - footer payı)
          if (sy > 1400) break;
        } else {
          snippetLine = testLine;
        }
      }
      ctx.fillText(snippetLine, cardPadding, sy);

      // 7. Footer (Yeni yüksekliğe göre yukarı çekildi)
      const footerLineY = cardY + cardHeight - 120; // Kartın altından 120px yukarıda
      ctx.strokeStyle = "#F1F5F9";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cardPadding, footerLineY);
      ctx.lineTo(cardPadding + maxContentWidth, footerLineY);
      ctx.stroke();

      ctx.fillStyle = "#020617";
      ctx.font = "500 32px Inter, system-ui, sans-serif";
      ctx.fillText(author, cardPadding, footerLineY + 65);

      // 8. Paylaşım
      const dataUrl = canvas.toDataURL("image/png");
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "be-log-story.png", { type: "image/png" });

      if (navigator.share) {
        await navigator.share({
          files: [file],
          title: title,
          url: `${window.location.origin}/blog/${slug}`,
        });
      } else {
        const link = document.createElement("a");
        link.download = `${slug}.png`;
        link.href = dataUrl;
        link.click();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={generateAndShare}
      disabled={isGenerating}
      className="p-2 text-slate-400 hover:text-[#f92743] rounded-lg transition-all"
    >
      {isGenerating ? (
        <Loader2 size={20} className="animate-spin" />
      ) : (
        <Share2 size={20} />
      )}
    </button>
  );
}
