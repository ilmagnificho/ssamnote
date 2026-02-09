"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StudentSelector } from "./student-selector";
import { DomainTagSelector } from "./domain-tag-selector";
import { Student, DomainTag, TimeBlock, LogInput } from "@/types/database";
import { Loader2, Sparkles } from "lucide-react";

interface TransformResult {
    refinedContent: string;
    interpretation: string;
}

interface InputModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (input: LogInput, aiResult: TransformResult | null) => void;
    timeBlock: TimeBlock;
    students: Student[];
    domainTags: DomainTag[];
    date: string;
}

export function InputModal({
    isOpen,
    onClose,
    onSubmit,
    timeBlock,
    students,
    domainTags,
    date,
}: InputModalProps) {
    const [rawContent, setRawContent] = useState("");
    const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
    const [selectedDomainTags, setSelectedDomainTags] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [aiResult, setAiResult] = useState<TransformResult | null>(null);
    const [showPreview, setShowPreview] = useState(false);

    // Get selected student names for AI context
    const getSelectedStudentNames = () => {
        return selectedStudentIds
            .map((id) => students.find((s) => s.id === id)?.name)
            .filter(Boolean) as string[];
    };

    // Call AI transformation API
    const handleTransform = async () => {
        if (!rawContent.trim()) return;

        setIsSubmitting(true);
        try {
            const response = await fetch("/api/transform", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    rawContent: rawContent.trim(),
                    studentNames: getSelectedStudentNames(),
                    domainTags: selectedDomainTags,
                }),
            });

            if (!response.ok) {
                throw new Error("Transform failed");
            }

            const result = await response.json();
            setAiResult(result);
            setShowPreview(true);
        } catch (error) {
            console.error("AI transform error:", error);
            // Fallback: use raw content as refined content
            setAiResult({
                refinedContent: rawContent.trim(),
                interpretation: "",
            });
            setShowPreview(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Final save after preview
    const handleSave = async () => {
        const input: LogInput = {
            date,
            block_id: timeBlock.id,
            raw_content: rawContent.trim(),
            student_ids: selectedStudentIds,
            domain_tags: selectedDomainTags,
        };

        await onSubmit(input, aiResult);
        resetForm();
        onClose();
    };

    const resetForm = () => {
        setRawContent("");
        setSelectedStudentIds([]);
        setSelectedDomainTags([]);
        setAiResult(null);
        setShowPreview(false);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleBack = () => {
        setShowPreview(false);
        setAiResult(null);
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-lg">
                        <span className="text-2xl">{timeBlock.icon}</span>
                        <span>{timeBlock.name}</span>
                        <span className="text-sm text-gray-500 font-normal">
                            {timeBlock.start_time} - {timeBlock.end_time}
                        </span>
                    </DialogTitle>
                </DialogHeader>

                {!showPreview ? (
                    // Input Form
                    <>
                        <div className="space-y-6 py-4">
                            {/* Raw content input */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    오늘의 관찰 기록
                                </label>
                                <Textarea
                                    placeholder="예: 철수가 블록으로 높은 탑을 쌓았어요"
                                    value={rawContent}
                                    onChange={(e) => setRawContent(e.target.value)}
                                    className="min-h-[120px] resize-none"
                                />
                                <p className="text-xs text-gray-500">
                                    자연스럽게 적어주세요. AI가 평가 언어로 변환해드립니다.
                                </p>
                            </div>

                            {/* Student selector */}
                            <StudentSelector
                                students={students}
                                selectedIds={selectedStudentIds}
                                onSelectionChange={setSelectedStudentIds}
                            />

                            {/* Domain tag selector */}
                            <DomainTagSelector
                                tags={domainTags}
                                selectedTags={selectedDomainTags}
                                onSelectionChange={setSelectedDomainTags}
                            />
                        </div>

                        <DialogFooter className="gap-2">
                            <Button variant="outline" onClick={handleClose}>
                                취소
                            </Button>
                            <Button
                                onClick={handleTransform}
                                disabled={!rawContent.trim() || isSubmitting}
                                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        AI 변환 중...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        AI 변환하기
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </>
                ) : (
                    // Preview Form
                    <>
                        <div className="space-y-4 py-4">
                            {/* Original input */}
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500 mb-1">원본 메모</p>
                                <p className="text-sm text-gray-600">{rawContent}</p>
                            </div>

                            {/* AI refined content */}
                            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="h-4 w-4 text-purple-500" />
                                    <p className="text-xs font-medium text-purple-600">
                                        AI 변환 결과
                                    </p>
                                </div>
                                <Textarea
                                    value={aiResult?.refinedContent || ""}
                                    onChange={(e) =>
                                        setAiResult((prev) =>
                                            prev ? { ...prev, refinedContent: e.target.value } : null
                                        )
                                    }
                                    className="min-h-[80px] bg-white/50 border-purple-200"
                                />
                            </div>

                            {/* AI interpretation */}
                            {aiResult?.interpretation && (
                                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                                    <p className="text-xs text-blue-600 mb-1">📝 발달적 해석</p>
                                    <Textarea
                                        value={aiResult.interpretation}
                                        onChange={(e) =>
                                            setAiResult((prev) =>
                                                prev
                                                    ? { ...prev, interpretation: e.target.value }
                                                    : null
                                            )
                                        }
                                        className="min-h-[60px] bg-white/50 border-blue-200 text-sm"
                                    />
                                </div>
                            )}
                        </div>

                        <DialogFooter className="gap-2">
                            <Button variant="outline" onClick={handleBack}>
                                다시 작성
                            </Button>
                            <Button
                                onClick={handleSave}
                                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                            >
                                ✅ 저장하기
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
