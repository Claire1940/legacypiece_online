"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, Play } from "lucide-react";

interface VideoFeatureProps {
  videoId: string;
  title: string;
}

/**
 * 视频区组件
 *
 * 自动播放策略：
 * - 使用 IntersectionObserver 监测视频区域进入视口（rootMargin 200px + threshold 0.25）
 * - 进入视口后加载 iframe 并自动播放（autoplay=1&mute=1&loop=1，mute 满足浏览器自动播放策略）
 * - 激活前显示 YouTube hqdefault 缩略图 + 播放按钮（点击作为后备启动方式）
 * - prefers-reduced-motion 用户不自动播放，仅保留点击启动
 * - 静态导出环境用普通 <img>（不支持 next/image 优化器）
 */
export function VideoFeature({ videoId, title }: VideoFeatureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [userStarted, setUserStarted] = useState(false);

  const watchUrl = useMemo(
    () => `https://www.youtube.com/watch?v=${videoId}`,
    [videoId],
  );

  const embedUrl = useMemo(
    () =>
      `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&playsinline=1&rel=0`,
    [videoId],
  );

  const thumbUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      // 尊重用户偏好：不自动播放，保留点击启动
      return;
    }

    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      // 环境不支持时回退到点击启动
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "200px", threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const showIframe = active || userStarted;

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-lg bg-black/40"
        style={{ paddingBottom: "56.25%" }}
      >
        {showIframe ? (
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setUserStarted(true)}
            className="absolute inset-0 w-full h-full group"
            aria-label={`Play video: ${title}`}
          >
            <img
              src={thumbUrl}
              alt={title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <span className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex items-center justify-center w-16 h-16 rounded-full bg-[hsl(var(--nav-theme))] group-hover:scale-110 transition-transform shadow-lg">
                <Play className="w-7 h-7 text-white ml-1" fill="currentColor" />
              </span>
            </span>
          </button>
        )}
      </div>

      <div className="flex justify-center">
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
        >
          Watch on YouTube
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
