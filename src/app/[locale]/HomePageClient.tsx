"use client";

import { useState, Suspense, lazy } from "react";
import {
  ArrowRight,
  Award,
  BookOpen,
  Check,
  ChevronDown,
  Copy,
  Crown,
  Droplets,
  ExternalLink,
  Flame,
  Gamepad2,
  Gift,
  MessageCircle,
  Newspaper,
  Shield,
  Skull,
  Sparkles,
  Star,
  Sword,
  Wind,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

// Tools Grid 锚点 ID（与 tools.cards 8 张一一对应，与下方 8 个 <section id> 一致）
const TOOLS_SECTION_IDS = [
  "codes",
  "beginner-guide",
  "fruits-tier-list",
  "leveling-guide",
  "abilities-guide",
  "boss-guide",
  "update-news",
  "discord-community",
];

// 模块交替底色（奇数模块加一层浅底，视觉节奏）
function sectionBg(index: number) {
  return index % 2 === 1 ? "bg-white/[0.02]" : "";
}

// 模块级标题助手：眉行 + 标题（含主题名）+ 副标题/简介
function ModuleHeader({
  eyebrow,
  title,
  subtitle,
  intro,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  intro?: string;
}) {
  return (
    <div className="text-center mb-8 md:mb-12 scroll-reveal">
      <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-4 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
        <span className="text-xs font-semibold tracking-wider text-[hsl(var(--nav-theme-light))]">
          {eyebrow}
        </span>
      </div>
      <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">{title}</h2>
      {subtitle && (
        <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-2">
          {subtitle}
        </p>
      )}
      {intro && (
        <p className="text-sm md:text-base text-muted-foreground/80 max-w-3xl mx-auto">
          {intro}
        </p>
      )}
    </div>
  );
}

// 水果 Tier 层图标（每层不同图标）
const FRUIT_TIER_ICON: Record<string, typeof Crown> = {
  "S Tier": Crown,
  "A Tier": Star,
  "B Tier": Award,
};

// 能力卡图标（6 张各不相同）
const ABILITY_ICONS = [Zap, Flame, Droplets, Wind, Shield, Sword];

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  locale: string;
}

export default function HomePageClient({
  latestArticles,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://legacypiece.online";

  const ROBLOX_URL = "https://www.roblox.com/games/8657732325/Legacy-Piece";
  const DISCORD_URL = "https://discord.com/invite/legacypiece";
  const YOUTUBE_URL = "https://www.youtube.com/watch?v=SLBUd8ULqs8";

  // Update News accordion state
  const [updateExpanded, setUpdateExpanded] = useState<number | null>(0);
  // Codes copy state
  const [copiedCode, setCopiedCode] = useState<number | null>(null);
  const mobileBannerAd = getPreferredMobileBannerSelection();

  const handleCopyCode = (code: string, index: number) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code).catch(() => {});
    }
    setCopiedCode(index);
    window.setTimeout(() => setCopiedCode(null), 2000);
  };

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Legacy Piece Wiki",
        description:
          "Complete Legacy Piece Wiki covering codes, fruits, abilities, bosses, leveling guides, weapons, races, updates, and progression strategies for Roblox players.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1280,
          height: 720,
          caption: "Legacy Piece - Roblox Anime Pirate RPG Adventure",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Legacy Piece Wiki",
        alternateName: "Legacy Piece",
        url: siteUrl,
        description:
          "Complete Legacy Piece Wiki resource hub for Roblox codes, fruits, abilities, bosses, leveling guides, weapons and update tips",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1280,
          height: 720,
          caption: "Legacy Piece Wiki - Roblox Anime Pirate RPG Adventure",
        },
        sameAs: [ROBLOX_URL],
      },
      {
        "@type": "VideoGame",
        name: "Legacy Piece",
        gamePlatform: ["PC", "Mac", "Mobile", "Roblox"],
        applicationCategory: "Game",
        genre: ["RPG", "Adventure", "Anime", "Pirate"],
        numberOfPlayers: { minValue: 1, maxValue: 20 },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: ROBLOX_URL,
        },
      },
      {
        "@type": "VideoObject",
        name: "Legacy Piece Beginner Guide 2026 - Best Fruits, Specs & Leveling",
        description:
          "Complete Legacy Piece beginner guide covering the fastest progression route, best fruits, specs, prestige and leveling strategies for Roblox players.",
        uploadDate: "2026-01-01",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/SLBUd8ULqs8",
        url: YOUTUBE_URL,
      },
    ],
  };

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("codes")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <Gift className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href={ROBLOX_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnSteamCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section - 紧跟 Hero 之后（容器上限 max-w-5xl，避免挤压广告） */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="SLBUd8ULqs8"
              title="Legacy Piece Beginner Guide 2026 - Best Fruits, Specs & Leveling"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 8 Navigation Cards（紧接视频区，位于 Latest Updates 之前） */}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionId = TOOLS_SECTION_IDS[index];
              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold">
                    {card.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Latest Updates Section（模板自带，保留不动） */}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={12}
      />

      {/* Module 1: Legacy Piece Codes */}
      <section id="codes" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.legacyPieceCodes.eyebrow}
            title={t.modules.legacyPieceCodes.title}
            subtitle={t.modules.legacyPieceCodes.subtitle}
            intro={t.modules.legacyPieceCodes.intro}
          />
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.legacyPieceCodes.items.map((item: any, index: number) => {
              const copied = copiedCode === index;
              return (
                <div
                  key={index}
                  className="flex flex-col p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <code className="px-3 py-1.5 rounded-md bg-[hsl(var(--nav-theme)/0.12)] border border-[hsl(var(--nav-theme)/0.3)] text-sm font-mono font-semibold text-[hsl(var(--nav-theme-light))]">
                      {item.code}
                    </code>
                    <button
                      onClick={() => handleCopyCode(item.code, index)}
                      aria-label="Copy code"
                      className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-border hover:bg-white/10 transition-colors text-muted-foreground"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <span className="inline-flex w-fit items-center gap-1.5 text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-2">
                    <Gift className="w-3 h-3 text-[hsl(var(--nav-theme-light))]" />
                    {item.rewards}
                  </span>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 广告位 4: 第一模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 2: Legacy Piece Beginner Guide */}
      <section
        id="beginner-guide"
        className={`scroll-mt-24 px-4 py-14 md:py-20 ${sectionBg(1)}`}
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.legacyPieceBeginnerGuide.eyebrow}
            title={t.modules.legacyPieceBeginnerGuide.title}
            subtitle={t.modules.legacyPieceBeginnerGuide.subtitle}
            intro={t.modules.legacyPieceBeginnerGuide.intro}
          />
          <div className="scroll-reveal space-y-3 md:space-y-4 mb-8 md:mb-10">
            {t.modules.legacyPieceBeginnerGuide.steps.map(
              (step: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                    <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
          <div className="scroll-reveal p-4 md:p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <BookOpen className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold text-base md:text-lg">Quick Tips</h3>
            </div>
            <ul className="space-y-2">
              {t.modules.legacyPieceBeginnerGuide.quickTips.map(
                (tip: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground text-sm">{tip}</span>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* Module 3: Legacy Piece Fruits Tier List */}
      <section id="fruits-tier-list" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.legacyPieceFruitsTierList.eyebrow}
            title={t.modules.legacyPieceFruitsTierList.title}
            subtitle={t.modules.legacyPieceFruitsTierList.subtitle}
            intro={t.modules.legacyPieceFruitsTierList.intro}
          />
          <div className="scroll-reveal space-y-6">
            {t.modules.legacyPieceFruitsTierList.tiers.map(
              (tier: any, ti: number) => {
                const TierIcon =
                  FRUIT_TIER_ICON[tier.tier] || Star;
                return (
                  <div
                    key={ti}
                    className="p-5 md:p-6 bg-white/5 border border-border rounded-xl"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.15)]">
                        <TierIcon className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                      </div>
                      <h3 className="text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                        {tier.tier}
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {tier.fruits.map((fruit: any, fi: number) => (
                        <div
                          key={fi}
                          className="p-4 bg-white/5 border border-border rounded-lg hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                        >
                          <h4 className="font-bold mb-1">{fruit.name}</h4>
                          <p className="text-xs text-[hsl(var(--nav-theme-light))] mb-2">
                            {fruit.type}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {fruit.use}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* 广告位 5: 移动端横幅 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* Module 4: Legacy Piece Leveling Guide */}
      <section
        id="leveling-guide"
        className={`scroll-mt-24 px-4 py-14 md:py-20 ${sectionBg(3)}`}
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.legacyPieceLevelingGuide.eyebrow}
            title={t.modules.legacyPieceLevelingGuide.title}
            subtitle={t.modules.legacyPieceLevelingGuide.subtitle}
            intro={t.modules.legacyPieceLevelingGuide.intro}
          />
          <div className="scroll-reveal space-y-3 md:space-y-4 mb-8">
            {t.modules.legacyPieceLevelingGuide.steps.map(
              (step: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                    <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
          <div className="scroll-reveal flex flex-wrap gap-3 justify-center">
            {t.modules.legacyPieceLevelingGuide.milestones.map(
              (m: string, i: number) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm"
                >
                  <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
                  {m}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 5: Legacy Piece Abilities Guide */}
      <section id="abilities-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.legacyPieceAbilitiesGuide.eyebrow}
            title={t.modules.legacyPieceAbilitiesGuide.title}
            subtitle={t.modules.legacyPieceAbilitiesGuide.subtitle}
            intro={t.modules.legacyPieceAbilitiesGuide.intro}
          />
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.legacyPieceAbilitiesGuide.items.map(
              (item: any, index: number) => {
                const AbilityIcon = ABILITY_ICONS[index % ABILITY_ICONS.length];
                return (
                  <div
                    key={index}
                    className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.12)]">
                        <AbilityIcon className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                        {item.type}
                      </span>
                    </div>
                    <h3 className="font-bold mb-2">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* Module 6: Legacy Piece Boss Guide */}
      <section
        id="boss-guide"
        className={`scroll-mt-24 px-4 py-14 md:py-20 ${sectionBg(5)}`}
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.legacyPieceBossGuide.eyebrow}
            title={t.modules.legacyPieceBossGuide.title}
            subtitle={t.modules.legacyPieceBossGuide.subtitle}
            intro={t.modules.legacyPieceBossGuide.intro}
          />
          {/* 桌面端表格头 */}
          <div
            className="scroll-reveal hidden md:grid grid-cols-[2fr_2fr_1.2fr_2.2fr] gap-4 px-5 py-3 mb-2 rounded-xl bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-xs font-semibold tracking-wider text-[hsl(var(--nav-theme-light))] uppercase"
          >
            <span>{t.modules.legacyPieceBossGuide.headers.boss}</span>
            <span>{t.modules.legacyPieceBossGuide.headers.location}</span>
            <span>{t.modules.legacyPieceBossGuide.headers.level}</span>
            <span>{t.modules.legacyPieceBossGuide.headers.drops}</span>
          </div>
          <div className="scroll-reveal space-y-3">
            {t.modules.legacyPieceBossGuide.bosses.map(
              (boss: any, index: number) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-[2fr_2fr_1.2fr_2.2fr] gap-2 md:gap-4 p-4 md:px-5 md:py-4 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Skull className="w-4 h-4 text-[hsl(var(--nav-theme-light))] md:hidden" />
                    <span className="font-bold flex items-center gap-2">
                      <Skull className="w-4 h-4 text-[hsl(var(--nav-theme-light))] hidden md:block" />
                      {boss.name}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground md:flex md:items-center">
                    <span className="md:hidden text-xs text-muted-foreground/60 mr-1">Location:</span>
                    {boss.location}
                  </span>
                  <span className="text-sm md:flex md:items-center">
                    <span className="md:hidden text-xs text-muted-foreground/60 mr-1">Level:</span>
                    <span className="inline-flex w-fit items-center px-2 py-0.5 rounded-md bg-[hsl(var(--nav-theme)/0.12)] border border-[hsl(var(--nav-theme)/0.3)] text-xs font-semibold text-[hsl(var(--nav-theme-light))]">
                      {boss.level}
                    </span>
                  </span>
                  <span className="text-sm text-muted-foreground md:flex md:items-center">
                    <span className="md:hidden text-xs text-muted-foreground/60 mr-1">Drops:</span>
                    {boss.drops}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* 广告位 6: 移动端横幅 320×50 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* Module 7: Legacy Piece Update News */}
      <section id="update-news" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.legacyPieceUpdateNews.eyebrow}
            title={t.modules.legacyPieceUpdateNews.title}
            subtitle={t.modules.legacyPieceUpdateNews.subtitle}
            intro={t.modules.legacyPieceUpdateNews.intro}
          />
          <div className="scroll-reveal space-y-3">
            {t.modules.legacyPieceUpdateNews.updates.map(
              (update: any, index: number) => {
                const open = updateExpanded === index;
                return (
                  <div
                    key={index}
                    className="border border-border rounded-xl overflow-hidden bg-white/5"
                  >
                    <button
                      onClick={() =>
                        setUpdateExpanded(open ? null : index)
                      }
                      className="w-full flex items-center justify-between gap-3 p-5 text-left hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.12)]">
                          <Newspaper className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                        </div>
                        <div>
                          <span className="block text-xs font-semibold tracking-wider text-[hsl(var(--nav-theme-light))] uppercase mb-0.5">
                            {update.version}
                          </span>
                          <span className="font-semibold text-sm md:text-base">
                            {update.title}
                          </span>
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
                      />
                    </button>
                    {open && (
                      <div className="px-5 pb-5 text-sm text-muted-foreground">
                        {update.summary}
                      </div>
                    )}
                  </div>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* Module 8: Legacy Piece Discord Community */}
      <section
        id="discord-community"
        className={`scroll-mt-24 px-4 py-14 md:py-20 ${sectionBg(7)}`}
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.legacyPieceDiscordCommunity.eyebrow}
            title={t.modules.legacyPieceDiscordCommunity.title}
            subtitle={t.modules.legacyPieceDiscordCommunity.subtitle}
            intro={t.modules.legacyPieceDiscordCommunity.intro}
          />
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.legacyPieceDiscordCommunity.channels.map(
              (ch: any, index: number) => {
                const isDiscord = String(ch.href).includes("discord");
                const ChannelIcon = isDiscord ? MessageCircle : Gamepad2;
                return (
                  <a
                    key={index}
                    href={ch.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-4 p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] hover:bg-[hsl(var(--nav-theme)/0.05)] transition-colors"
                  >
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.12)] group-hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors">
                      <ChannelIcon className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold">{ch.name}</h3>
                        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {ch.description}
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[hsl(var(--nav-theme-light))]">
                        {ch.cta}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </a>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href={DISCORD_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition inline-flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/ShrinesLegacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition inline-flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    {t.footer.twitter}
                  </a>
                </li>
                <li>
                  <a
                    href={ROBLOX_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition inline-flex items-center gap-1.5"
                  >
                    <Gamepad2 className="w-3.5 h-3.5" />
                    {t.footer.roblox}
                  </a>
                </li>
                <li>
                  <a
                    href={YOUTUBE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition inline-flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    {t.footer.youtube}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
