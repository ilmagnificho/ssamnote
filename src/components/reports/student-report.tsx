"use client";

import { useState, useMemo } from "react";
import { format, startOfMonth, endOfMonth, addMonths, subMonths } from "date-fns";
import { ko } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Sparkles, Loader2, User } from "lucide-react";
import { Log, Student } from "@/types/database";
import { MOCK_LOGS, MOCK_DOMAIN_TAGS, MOCK_STUDENTS } from "@/lib/mock-data";

export function StudentReport() {
    const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()));
    const [selectedStudentId, setSelectedStudentId] = useState<string>(MOCK_STUDENTS[0]?.id || "");
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiReport, setAiReport] = useState<string | null>(null);

    // Get selected student
    const selectedStudent = MOCK_STUDENTS.find((s) => s.id === selectedStudentId);

    // Get month range
    const monthEnd = endOfMonth(currentMonth);

    // Filter logs for the selected student and month
    const studentLogs = useMemo(() => {
        const startStr = format(currentMonth, "yyyy-MM-dd");
        const endStr = format(monthEnd, "yyyy-MM-dd");
        return MOCK_LOGS.filter(
            (log) =>
                log.date >= startStr &&
                log.date <= endStr &&
                log.student_ids.includes(selectedStudentId)
        );
    }, [currentMonth, monthEnd, selectedStudentId]);

    // Group logs by domain
    const logsByDomain = useMemo(() => {
        const grouped: Record<string, Log[]> = {};
        studentLogs.forEach((log) => {
            log.domain_tags.forEach((tag) => {
                if (!grouped[tag]) grouped[tag] = [];
                grouped[tag].push(log);
            });
        });
        return grouped;
    }, [studentLogs]);

    // Navigate months
    const goToPreviousMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
        setAiReport(null);
    };

    const goToNextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
        setAiReport(null);
    };

    // Handle student change
    const handleStudentChange = (studentId: string) => {
        setSelectedStudentId(studentId);
        setAiReport(null);
    };

    // Generate AI report
    const generateReport = async () => {
        if (studentLogs.length === 0 || !selectedStudent) return;

        setIsGenerating(true);
        try {
            const logsText = studentLogs
                .map((log) => `[${log.date}] ${log.refined_content || log.raw_content}`)
                .join("\n");

            const response = await fetch("/api/transform", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    rawContent: `다음은 ${selectedStudent.name} 유아의 ${format(currentMonth, "yyyy년 M월")} 관찰 기록입니다. 
종합적인 발달 보고서를 작성해주세요. 각 영역별 발달 상황과 특이사항, 향후 지원 방향을 포함해주세요.

기록:
${logsText}`,
                    studentNames: [selectedStudent.name],
                    domainTags: Object.keys(logsByDomain),
                }),
            });

            if (response.ok) {
                const result = await response.json();
                setAiReport(result.refinedContent + "\n\n" + result.interpretation);
            }
        } catch (error) {
            console.error("Report generation error:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const getDomainColor = (tagName: string) =>
        MOCK_DOMAIN_TAGS.find((t) => t.name === tagName)?.color || "#888";

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
            {/* Header */}
            <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-gray-100 px-4 py-3">
                <div className="flex items-center justify-between mb-3">
                    <Button variant="ghost" size="icon" onClick={goToPreviousMonth}>
                        <ChevronLeft className="h-5 w-5" />
                    </Button>

                    <div className="text-center">
                        <h1 className="font-semibold text-lg">월간 발달 보고서</h1>
                        <p className="text-sm text-gray-500">
                            {format(currentMonth, "yyyy년 M월", { locale: ko })}
                        </p>
                    </div>

                    <Button variant="ghost" size="icon" onClick={goToNextMonth}>
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>

                {/* Student Selector */}
                <Select value={selectedStudentId} onValueChange={handleStudentChange}>
                    <SelectTrigger className="w-full">
                        <User className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="유아 선택" />
                    </SelectTrigger>
                    <SelectContent>
                        {MOCK_STUDENTS.map((student) => (
                            <SelectItem key={student.id} value={student.id}>
                                {student.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </header>

            <ScrollArea className="flex-1">
                <main className="px-4 py-6 max-w-2xl mx-auto space-y-6">
                    {/* Student Info Card */}
                    {selectedStudent && (
                        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                            <CardContent className="pt-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center text-2xl">
                                        👶
                                    </div>
                                    <div>
                                        <h2 className="font-semibold text-lg">{selectedStudent.name}</h2>
                                        <p className="text-sm text-gray-500">
                                            {studentLogs.length}건의 관찰 기록
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* AI Report Section */}
                    <Card className="border-green-200">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-green-500" />
                                AI 발달 보고서
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {aiReport ? (
                                <div className="space-y-3">
                                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                        {aiReport}
                                    </p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setAiReport(null)}
                                    >
                                        다시 생성
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    onClick={generateReport}
                                    disabled={isGenerating || studentLogs.length === 0}
                                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500"
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            보고서 생성 중...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="mr-2 h-4 w-4" />
                                            {studentLogs.length > 0
                                                ? "발달 보고서 생성하기"
                                                : "이번 달 기록이 없습니다"}
                                        </>
                                    )}
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    {/* Domain Breakdown */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">영역별 관찰 현황</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {MOCK_DOMAIN_TAGS.map((domain) => {
                                const domainLogs = logsByDomain[domain.name] || [];
                                return (
                                    <div key={domain.id} className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <Badge
                                                variant="outline"
                                                style={{
                                                    borderColor: domain.color || "#888",
                                                    color: domain.color || "#888",
                                                }}
                                            >
                                                {domain.name}
                                            </Badge>
                                            <span className="text-sm text-gray-600">
                                                {domainLogs.length}건
                                            </span>
                                        </div>
                                        {/* Progress bar */}
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all"
                                                style={{
                                                    width: `${Math.min((domainLogs.length / Math.max(studentLogs.length, 1)) * 100, 100)}%`,
                                                    backgroundColor: domain.color || "#888",
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>

                    {/* Recent Logs */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">최근 관찰 기록</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {studentLogs.slice(0, 5).map((log) => (
                                <div
                                    key={log.id}
                                    className="p-3 bg-gray-50 rounded-lg border border-gray-100"
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-gray-400">{log.date}</span>
                                        <div className="flex gap-1">
                                            {log.domain_tags.map((tag) => (
                                                <Badge
                                                    key={tag}
                                                    variant="outline"
                                                    className="text-xs px-1.5 py-0"
                                                    style={{
                                                        borderColor: getDomainColor(tag),
                                                        color: getDomainColor(tag),
                                                    }}
                                                >
                                                    {tag.split("·")[0]}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-700">
                                        {log.refined_content || log.raw_content}
                                    </p>
                                </div>
                            ))}
                            {studentLogs.length === 0 && (
                                <p className="text-sm text-gray-400 text-center py-4">
                                    이번 달 기록이 없습니다
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </main>
            </ScrollArea>
        </div>
    );
}
