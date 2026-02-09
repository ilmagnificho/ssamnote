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

interface InputModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (input: LogInput) => void;
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

    const handleSubmit = async () => {
        if (!rawContent.trim()) return;

        setIsSubmitting(true);

        const input: LogInput = {
            date,
            block_id: timeBlock.id,
            raw_content: rawContent.trim(),
            student_ids: selectedStudentIds,
            domain_tags: selectedDomainTags,
        };

        await onSubmit(input);

        // Reset form
        setRawContent("");
        setSelectedStudentIds([]);
        setSelectedDomainTags([]);
        setIsSubmitting(false);
        onClose();
    };

    const handleClose = () => {
        setRawContent("");
        setSelectedStudentIds([]);
        setSelectedDomainTags([]);
        onClose();
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
                        onClick={handleSubmit}
                        disabled={!rawContent.trim() || isSubmitting}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                    >
                        {isSubmitting ? "저장 중..." : "✨ AI 변환 후 저장"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
