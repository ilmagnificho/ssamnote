"use client";

import { useState, useMemo } from "react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks } from "date-fns";
import { ko } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight, Sparkles, Loader2 } from "lucide-react";
import { Log } from "@/types/database";
import { MOCK_LOGS, MOCK_DOMAIN_TAGS, MOCK_CLASS, MOCK_STUDENTS } from "@/lib/mock-data";

export function WeeklySummary() {
    const [currentWeekStart, setCurrentWeekStart] = useState(() =>
        startOfWeek(new Date(), { weekStartsOn: 1 })
    );
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiSummary, setAiSummary] = useState<string | null>(null);

    // Get the week range
    const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
    const daysOfWeek = eachDayOfInterval({ start: currentWeekStart, end: weekEnd });

    // Filter logs for the current week
    const weeklyLogs = useMemo(() => {
        const startStr = format(currentWeekStart, "yyyy-MM-dd");
        const endStr = format(weekEnd, "yyyy-MM-dd");
        return MOCK_LOGS.filter((log) => log.date >= startStr && log.date <= endStr);
    }, [currentWeekStart, weekEnd]);

    // Group logs by domain
    const logsByDomain = useMemo(() => {
        const grouped: Record<string, Log[]> = {};
        weeklyLogs.forEach((log) => {
            log.domain_tags.forEach((tag) => {
                if (!grouped[tag]) grouped[tag] = [];
                grouped[tag].push(log);
            });
        });
        return grouped;
    }, [weeklyLogs]);

    // Group logs by day
    const logsByDay = useMemo(() => {
        const grouped: Record<string, Log[]> = {};
        daysOfWeek.forEach((day) => {
            const dateStr = format(day, "yyyy-MM-dd");
            grouped[dateStr] = weeklyLogs.filter((log) => log.date === dateStr);
        });
        return grouped;
    }, [weeklyLogs, daysOfWeek]);

    // Navigate weeks
    const goToPreviousWeek = () => {
        setCurrentWeekStart(subWeeks(currentWeekStart, 1));
        setAiSummary(null);
    };

    const goToNextWeek = () => {
        setCurrentWeekStart(addWeeks(currentWeekStart, 1));
        setAiSummary(null);
    };

    // Generate AI summary
    const generateSummary = async () => {
        if (weeklyLogs.length === 0) return;

        setIsGenerating(true);
        try {
            const logsText = weeklyLogs
                .map((log) => log.refined_content || log.raw_content)
                .join("\n- ");

            const response = await fetch("/api/transform", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    rawContent: `다음은 이번 주 관찰 기록입니다. 주간 요약을 작성해주세요:\n- ${logsText}`,
                    studentNames: [],
                    domainTags: Object.keys(logsByDomain),
                }),
            });

            if (response.ok) {
                const result = await response.json();
                setAiSummary(result.refinedContent);
            }
        } catch (error) {
            console.error("Summary generation error:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const getDomainColor = (tagName: string) =>
        MOCK_DOMAIN_TAGS.find((t) => t.name === tagName)?.color || "#888";

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
            {/* Header */}
            <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-gray-100 px-4 py-3">
                <div className="flex items-center justify-between">
                    <Button variant="ghost" size="icon" onClick={goToPreviousWeek}>
                        <ChevronLeft className="h-5 w-5" />
                    </Button>

                    <div className="text-center">
                        <h1 className="font-semibold text-lg">주간 요약</h1>
                        <p className="text-sm text-gray-500">
                            {format(currentWeekStart, "M월 d일", { locale: ko })} -{" "}
                            {format(weekEnd, "M월 d일", { locale: ko })}
                        </p>
                    </div>

                    <Button variant="ghost" size="icon" onClick={goToNextWeek}>
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>

                <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="text-xl">🌸</span>
                    <span className="font-medium text-gray-700">{MOCK_CLASS.name}</span>
                    <Badge variant="secondary">{weeklyLogs.length}건 기록</Badge>
                </div>
            </header>

            <ScrollArea className="flex-1">
                <main className="px-4 py-6 max-w-2xl mx-auto space-y-6">
                    {/* AI Summary Section */}
                    <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-purple-500" />
                                AI 주간 요약
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {aiSummary ? (
                                <p className="text-sm text-gray-700 leading-relaxed">{aiSummary}</p>
                            ) : (
                                <Button
                                    onClick={generateSummary}
                                    disabled={isGenerating || weeklyLogs.length === 0}
                                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            요약 생성 중...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="mr-2 h-4 w-4" />
                                            {weeklyLogs.length > 0
                                                ? "주간 요약 생성하기"
                                                : "이번 주 기록이 없습니다"}
                                        </>
                                    )}
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    {/* Domain Summary */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">영역별 활동</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {Object.entries(logsByDomain).map(([domain, logs]) => (
                                <div key={domain} className="flex items-center justify-between">
                                    <Badge
                                        variant="outline"
                                        style={{
                                            borderColor: getDomainColor(domain),
                                            color: getDomainColor(domain),
                                        }}
                                    >
                                        {domain}
                                    </Badge>
                                    <span className="text-sm text-gray-600">{logs.length}건</span>
                                </div>
                            ))}
                            {Object.keys(logsByDomain).length === 0 && (
                                <p className="text-sm text-gray-400 text-center py-4">
                                    이번 주 기록이 없습니다
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Daily Breakdown */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">일별 기록</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {daysOfWeek.map((day) => {
                                const dateStr = format(day, "yyyy-MM-dd");
                                const dayLogs = logsByDay[dateStr] || [];
                                const isToday = dateStr === format(new Date(), "yyyy-MM-dd");

                                return (
                                    <div
                                        key={dateStr}
                                        className={`flex items-center justify-between p-2 rounded-lg ${isToday ? "bg-blue-50" : "hover:bg-gray-50"
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium w-16">
                                                {format(day, "E", { locale: ko })}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {format(day, "M/d")}
                                            </span>
                                        </div>
                                        <Badge variant={dayLogs.length > 0 ? "default" : "secondary"}>
                                            {dayLogs.length}건
                                        </Badge>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                </main>
            </ScrollArea>
        </div>
    );
}
