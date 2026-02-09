"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Student } from "@/types/database";
import { cn } from "@/lib/utils";

interface StudentSelectorProps {
    students: Student[];
    selectedIds: string[];
    onSelectionChange: (ids: string[]) => void;
}

export function StudentSelector({
    students,
    selectedIds,
    onSelectionChange,
}: StudentSelectorProps) {
    const [isAllSelected, setIsAllSelected] = useState(false);

    const toggleStudent = (studentId: string) => {
        if (isAllSelected) {
            setIsAllSelected(false);
        }

        if (selectedIds.includes(studentId)) {
            onSelectionChange(selectedIds.filter((id) => id !== studentId));
        } else {
            onSelectionChange([...selectedIds, studentId]);
        }
    };

    const toggleAll = () => {
        if (isAllSelected) {
            setIsAllSelected(false);
            onSelectionChange([]);
        } else {
            setIsAllSelected(true);
            onSelectionChange(students.map((s) => s.id));
        }
    };

    return (
        <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
                관련 유아 선택
            </label>
            <div className="flex flex-wrap gap-2">
                {/* All toggle */}
                <Badge
                    variant={isAllSelected ? "default" : "outline"}
                    className={cn(
                        "cursor-pointer transition-all px-3 py-1.5",
                        isAllSelected
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-gray-100"
                    )}
                    onClick={toggleAll}
                >
                    👥 전체
                </Badge>

                {/* Individual students */}
                {students.map((student) => (
                    <Badge
                        key={student.id}
                        variant={selectedIds.includes(student.id) ? "default" : "outline"}
                        className={cn(
                            "cursor-pointer transition-all px-3 py-1.5",
                            selectedIds.includes(student.id)
                                ? "bg-blue-500 text-white hover:bg-blue-600"
                                : "hover:bg-gray-100"
                        )}
                        onClick={() => toggleStudent(student.id)}
                    >
                        {student.name}
                    </Badge>
                ))}
            </div>
            {selectedIds.length > 0 && !isAllSelected && (
                <p className="text-xs text-gray-500">
                    {selectedIds.length}명 선택됨
                </p>
            )}
        </div>
    );
}
