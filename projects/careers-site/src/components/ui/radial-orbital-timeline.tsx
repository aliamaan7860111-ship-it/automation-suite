"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowRight, Link as LinkIcon, Zap, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
  accentColor?: string;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
  className?: string;
}

const DEFAULT_COLORS = ["#38bdf8", "#60a5fa", "#34d399", "#fbbf24", "#c084fc"];

export default function RadialOrbitalTimeline({
  timelineData,
  className = "",
}: RadialOrbitalTimelineProps) {
  const [mounted, setMounted] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [autoRotate, setAutoRotate] = useState(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [autoPingNodeId, setAutoPingNodeId] = useState<number | null>(null);
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const angleRef = useRef(0);
  const rafRef = useRef<number>(0);
  const [, forceRender] = useState(0);

  const getColor = (index: number, item: TimelineItem) =>
    item.accentColor || DEFAULT_COLORS[index % DEFAULT_COLORS.length];

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Smooth rotation via requestAnimationFrame (no jank)
  useEffect(() => {
    if (!autoRotate) return;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const delta = now - lastTime;
      lastTime = now;
      // 6 degrees per second — smooth, dignified speed
      angleRef.current = (angleRef.current + (delta / 1000) * 6) % 360;
      forceRender((v) => v + 1);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [autoRotate]);

  // Sonar ping cycle
  useEffect(() => {
    if (!autoRotate) { setAutoPingNodeId(null); return; }
    const timer = setInterval(() => {
      setAutoPingNodeId((prev) => {
        if (timelineData.length === 0) return null;
        if (prev === null) return timelineData[0].id;
        const idx = timelineData.findIndex((item) => item.id === prev);
        return timelineData[(idx + 1) % timelineData.length].id;
      });
    }, 3000);
    return () => clearInterval(timer);
  }, [autoRotate, timelineData]);

  const handleContainerClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === containerRef.current || e.target === orbitRef.current) {
        setExpandedItems({});
        setActiveNodeId(null);
        setPulseEffect({});
        setAutoRotate(true);
      }
    },
    []
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setExpandedItems({});
        setActiveNodeId(null);
        setPulseEffect({});
        setAutoRotate(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => {
      const newState: Record<number, boolean> = {};
      if (prev[id]) {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
        return newState;
      }
      newState[id] = true;
      setActiveNodeId(id);
      setAutoRotate(false);

      const relatedItems = getRelatedItems(id);
      const newPulse: Record<number, boolean> = {};
      relatedItems.forEach((relId) => (newPulse[relId] = true));
      setPulseEffect(newPulse);

      centerViewOnNode(id);
      return newState;
    });
  };

  const centerViewOnNode = (nodeId: number) => {
    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    const targetAngle = (nodeIndex / timelineData.length) * 360;
    angleRef.current = 270 - targetAngle;
  };

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + angleRef.current) % 360;
    const radius = isMobile ? 120 : 200;
    const radian = (angle * Math.PI) / 180;
    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);
    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(0.5, Math.min(1, 0.5 + 0.5 * ((1 + Math.sin(radian)) / 2)));
    return { x, y, zIndex, opacity };
  };

  const getRelatedItems = (itemId: number): number[] => {
    const item = timelineData.find((i) => i.id === itemId);
    return item ? item.relatedIds : [];
  };

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false;
    return getRelatedItems(activeNodeId).includes(itemId);
  };

  const getStatusStyles = (status: TimelineItem["status"]): string => {
    switch (status) {
      case "completed": return "text-black bg-white border-white";
      case "in-progress": return "text-white bg-zinc-800 border-zinc-600";
      default: return "text-zinc-400 bg-white/5 border-white/10";
    }
  };

  if (!mounted) return <div className="w-full h-[340px] md:h-[480px] bg-[#050508]" />;

  const orbitSize = isMobile ? 240 : 400;
  const nodeSize = isMobile ? 36 : 44;

  return (
    <div
      className={`w-full h-[360px] md:h-[500px] flex items-center justify-center bg-[#050508] overflow-visible ${className}`}
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <div className="relative flex items-center justify-center overflow-visible" style={{ width: orbitSize + 120, height: orbitSize + 120 }}>
        <div
          className="absolute flex items-center justify-center overflow-visible"
          ref={orbitRef}
          style={{ width: orbitSize + 120, height: orbitSize + 120 }}
        >
          {/* ── Center Core ── */}
          <div className="absolute flex items-center justify-center z-10">
            <div className="absolute rounded-full border border-white/15 animate-ping opacity-50" style={{ width: nodeSize + 16, height: nodeSize + 16 }} />
            <div className="absolute rounded-full border border-white/8 animate-ping opacity-30" style={{ width: nodeSize + 32, height: nodeSize + 32, animationDelay: "0.5s" }} />
            <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-white shadow-[0_0_25px_rgba(255,255,255,0.5)]" />
          </div>

          {/* ── Orbit Ring ── */}
          <div
            className="absolute rounded-full border border-white/[0.06]"
            style={{ width: orbitSize, height: orbitSize }}
          />

          {/* ── Nodes ── */}
          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index, timelineData.length);
            const isExpanded = expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
            const isPulsing = pulseEffect[item.id];
            const isAutoPing = autoPingNodeId === item.id;
            const Icon = item.icon;
            const color = getColor(index, item);

            const nodeStyles: React.CSSProperties = {
              borderColor: isExpanded ? color : isRelated ? color : color,
              backgroundColor: isExpanded ? color : isAutoPing ? `${color}15` : "#0a0a0f",
              boxShadow: isExpanded
                ? `0 0 24px ${color}50, 0 0 48px ${color}20`
                : isAutoPing
                ? `0 0 16px ${color}35`
                : `0 0 0 1px ${color}25`,
              color: isExpanded ? "#000" : color,
              width: nodeSize,
              height: nodeSize,
            };

            return (
              <div
                key={item.id}
                ref={(el) => { nodeRefs.current[item.id] = el; }}
                className="absolute cursor-pointer"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px)`,
                  zIndex: isExpanded ? 200 : position.zIndex,
                  opacity: isExpanded ? 1 : position.opacity,
                  transition: "opacity 0.4s ease, z-index 0s",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(item.id);
                }}
              >
                {/* ── Glow halo ── */}
                <div
                  className={`absolute rounded-full pointer-events-none ${isPulsing ? "animate-pulse" : ""}`}
                  style={{
                    background: `radial-gradient(circle, ${color}${isExpanded ? "40" : isAutoPing ? "30" : "12"} 0%, transparent 70%)`,
                    width: nodeSize + 30,
                    height: nodeSize + 30,
                    left: -(30 / 2),
                    top: -(30 / 2),
                    transition: "background 0.5s ease",
                  }}
                />

                {/* ── Node circle ── */}
                <div
                  className={`rounded-full flex items-center justify-center border-[1.5px] transition-all duration-300 ${isExpanded ? "scale-[1.3]" : isAutoPing ? "scale-110" : "scale-100"}`}
                  style={nodeStyles}
                >
                  <Icon size={isMobile ? 13 : 16} strokeWidth={1.8} />
                </div>

                {/* ── Label (centered below node) ── */}
                <div
                  className="absolute left-1/2 text-center transition-colors duration-300 pointer-events-none"
                  style={{
                    top: nodeSize + 6,
                    transform: "translateX(-50%)",
                    width: isMobile ? 100 : 130,
                    color: isExpanded ? color : "rgb(113,113,122)",
                  }}
                >
                  <span className={`${isMobile ? "text-[9px]" : "text-[11px]"} font-medium tracking-wide leading-tight block`}>
                    {item.title}
                  </span>
                </div>

                {/* ── Expanded Card ── */}
                {isExpanded && (
                  <Card
                    className="absolute left-1/2 -translate-x-1/2 w-60 md:w-72 backdrop-blur-xl shadow-2xl shadow-black/70 overflow-visible rounded-xl md:rounded-2xl"
                    style={{
                      top: nodeSize + (isMobile ? 32 : 38),
                      backgroundColor: "rgba(10,10,18,0.96)",
                      borderColor: `${color}25`,
                      borderWidth: "1px",
                    }}
                  >
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3" style={{ backgroundColor: `${color}40` }} />

                    <button
                      className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors z-10"
                      onClick={(e) => { e.stopPropagation(); toggleItem(item.id); }}
                    >
                      <X size={10} className="text-zinc-400" />
                    </button>

                    <CardHeader className="pb-2 p-4 md:p-5 md:pb-2">
                      <Badge className={`px-2 text-[9px] md:text-xs w-fit ${getStatusStyles(item.status)}`}>
                        {item.status === "completed" ? "ACTIVE" : item.status === "in-progress" ? "IN PROGRESS" : "PENDING"}
                      </Badge>
                      <CardTitle className="text-xs md:text-sm mt-2 text-white">{item.title}</CardTitle>
                    </CardHeader>

                    <CardContent className="text-[10px] md:text-xs text-zinc-400 p-4 pt-0 md:p-5 md:pt-0 overflow-visible">
                      <p className="leading-relaxed">{item.content}</p>

                      <div className="mt-3 pt-2 border-t" style={{ borderColor: `${color}10` }}>
                        <div className="flex justify-between items-center text-[10px] mb-1.5 text-zinc-500">
                          <span className="flex items-center">
                            <Zap size={9} className="mr-1" style={{ color }} />
                            {item.date}
                          </span>
                        </div>
                        <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${item.energy}%`, background: `linear-gradient(90deg, ${color}60, ${color})` }}
                          />
                        </div>
                      </div>

                      {item.relatedIds.length > 0 && (
                        <div className="mt-3 pt-2 border-t" style={{ borderColor: `${color}10` }}>
                          <div className="flex items-center mb-2">
                            <LinkIcon size={9} className="text-zinc-500 mr-1" />
                            <h4 className="text-[9px] uppercase tracking-wider font-medium text-zinc-500">Connected Nodes</h4>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {item.relatedIds.map((relatedId) => {
                              const relatedItem = timelineData.find((i) => i.id === relatedId);
                              const relatedIndex = timelineData.findIndex((i) => i.id === relatedId);
                              const relatedColor = relatedItem ? getColor(relatedIndex, relatedItem) : "#fff";
                              return (
                                <span
                                  key={relatedId}
                                  className="inline-flex items-center h-6 px-2.5 text-[10px] rounded-md font-medium cursor-pointer hover:opacity-80 transition-all"
                                  style={{ border: `1px solid ${relatedColor}25`, backgroundColor: `${relatedColor}0a`, color: relatedColor }}
                                  onClick={(e) => { e.stopPropagation(); toggleItem(relatedId); }}
                                >
                                  {relatedItem?.title}
                                  <ArrowRight size={8} className="ml-1.5 opacity-60" />
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
