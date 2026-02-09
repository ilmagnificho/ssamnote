"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TimeBlock as TimeBlockType, Log, Student } from "@/types/database";
import { MOCK_DOMAIN_TAGS } from "@/lib/mock-data";
import { Plus } from "lucide-react";

interface TimeBlockProps {
    block: TimeBlockType;
    logs: Log[];
    students: Student[];
    onAddLog: () => void;
}

export function TimeBlock({ block, logs, students, onAddLog }: TimeBlockProps) {
    // Get student names from IDs
    const getStudentNames = (studentIds: string[]) => {
        return studentIds
            .map((id) => students.find((s) => s.id === id)?.name)
            .filter(Boolean)
            .join(", ");
    };

    // Get domain tag color
    const getTagColor = (tagName: string) => {
        return MOCK_DOMAIN_TAGS.find((t) => t.name === tagName)?.color || "#888";
    };

    return (
        <div className="relative pl-8">
            {/* Timeline line */}
            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200" />

            {/* Time indicator */}
            <div className="absolute left-0 top-2 w-6 h-6 rounded-full bg-white border-2 border-blue-400 flex items-center justify-center text-xs z-10">
                {block.icon}
            </div>

            <Card className="mb-4 overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                    {/* Block header */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-800">{block.name}</span>
                            <span className="text-xs text-gray-400">
                                {block.start_time} - {block.end_time}
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onAddLog}
                            className="h-8 w-8 p-0 rounded-full hover:bg-blue-50"
                        >
                            <Plus className="h-4 w-4 text-blue-500" />
                        </Button>
                    </div>

                    {/* Logs list */}
                    {logs.length > 0 ? (
                        <div className="space-y-3">
                            {logs.map((log) => (
                                <div
                                    key={log.id}
                                    className="p-3 bg-gray-50 rounded-lg border border-gray-100"
                                >
                                    {/* Refined content */}
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        {log.refined_content || log.raw_content}
                                    </p>

                                    {/* Interpretation */}
                                    {log.interpretation && (
                                        <p className="text-xs text-blue-600 mt-2 italic">
                                            📝 {log.interpretation}
                                        </p>
                                    )}

                                    {/* Tags row */}
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        {/* Student tags */}
                                        {log.student_ids.length > 0 && (
                                            <Badge variant="secondary" className="text-xs">
                                                👤 {getStudentNames(log.student_ids)}
                                            </Badge>
                                        )}

                                        {/* Domain tags */}
                                        {log.domain_tags.map((tag) => (
                                            <Badge
                                                key={tag}
                                                variant="outline"
                                                className="text-xs border"
                                                style={{
                                                    borderColor: getTagColor(tag),
                                                    color: getTagColor(tag),
                                                }}
                                            >
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Empty state */
                        <button
                            onClick={onAddLog}
                            className="w-full py-4 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 hover:border-blue-300 hover:text-blue-400 transition-colors text-sm"
                        >
                            + 기록 추가
                        </button>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
