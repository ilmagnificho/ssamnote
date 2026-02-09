"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TimeBlock } from "./time-block";
import { InputModal } from "./input-modal";
import {
    TimeBlock as TimeBlockType,
    Log,
    LogInput,
} from "@/types/database";
import {
    MOCK_STUDENTS,
    MOCK_TIME_BLOCKS,
    MOCK_DOMAIN_TAGS,
    MOCK_LOGS,
    MOCK_CLASS,
    WEATHER_OPTIONS,
} from "@/lib/mock-data";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function TimelineFeed() {
    // State
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [weather, setWeather] = useState<string>("sunny");
    const [logs, setLogs] = useState<Log[]>(MOCK_LOGS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBlock, setSelectedBlock] = useState<TimeBlockType | null>(null);

    // Format date string for filtering
    const dateString = format(selectedDate, "yyyy-MM-dd");

    // Filter logs by date
    const logsForDate = useMemo(() => {
        return logs.filter((log) => log.date === dateString);
    }, [logs, dateString]);

    // Get logs for a specific block
    const getLogsForBlock = (blockId: string) => {
        return logsForDate.filter((log) => log.block_id === blockId);
    };

    // Handle opening modal for a block
    const handleAddLog = (block: TimeBlockType) => {
        setSelectedBlock(block);
        setIsModalOpen(true);
    };

    // Handle log submission (mock for now, will connect to AI in Phase 3)
    const handleLogSubmit = async (input: LogInput) => {
        // Create new log with mock refined content
        const newLog: Log = {
            id: `l${Date.now()}`,
            user_id: "u1",
            class_id: MOCK_CLASS.id,
            date: input.date,
            block_id: input.block_id,
            raw_content: input.raw_content,
            refined_content: input.raw_content, // Will be AI-transformed in Phase 3
            interpretation: null,
            student_ids: input.student_ids,
            domain_tags: input.domain_tags,
            weather: weather,
            is_class_wide: input.student_ids.length === 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        setLogs((prev) => [...prev, newLog]);
    };

    // Navigate dates
    const goToPreviousDay = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() - 1);
        setSelectedDate(newDate);
    };

    const goToNextDay = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + 1);
        setSelectedDate(newDate);
    };

    const currentWeather = WEATHER_OPTIONS.find((w) => w.value === weather);

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {/* Header */}
            <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-gray-100 px-4 py-3">
                {/* Date row */}
                <div className="flex items-center justify-between mb-2">
                    <Button variant="ghost" size="icon" onClick={goToPreviousDay}>
                        <ChevronLeft className="h-5 w-5" />
                    </Button>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                className="font-semibold text-lg hover:bg-blue-50"
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {format(selectedDate, "yyyy년 M월 d일 (EEE)", { locale: ko })}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="center">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={(date) => date && setSelectedDate(date)}
                                locale={ko}
                            />
                        </PopoverContent>
                    </Popover>

                    <Button variant="ghost" size="icon" onClick={goToNextDay}>
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>

                {/* Class name and weather row */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">🌸</span>
                        <span className="font-medium text-gray-700">{MOCK_CLASS.name}</span>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                            {MOCK_CLASS.age_group}
                        </span>
                    </div>

                    {/* Weather selector */}
                    <div className="flex gap-1">
                        {WEATHER_OPTIONS.map((w) => (
                            <button
                                key={w.value}
                                onClick={() => setWeather(w.value)}
                                className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center transition-all text-lg",
                                    weather === w.value
                                        ? "bg-blue-100 scale-110"
                                        : "hover:bg-gray-100"
                                )}
                                title={w.label}
                            >
                                {w.icon}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* Timeline content */}
            <ScrollArea className="flex-1">
                <main className="px-4 py-6 max-w-2xl mx-auto">
                    {MOCK_TIME_BLOCKS.filter((b) => b.is_active).map((block) => (
                        <TimeBlock
                            key={block.id}
                            block={block}
                            logs={getLogsForBlock(block.id)}
                            students={MOCK_STUDENTS}
                            onAddLog={() => handleAddLog(block)}
                        />
                    ))}
                </main>
            </ScrollArea>

            {/* Input Modal */}
            {selectedBlock && (
                <InputModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedBlock(null);
                    }}
                    onSubmit={handleLogSubmit}
                    timeBlock={selectedBlock}
                    students={MOCK_STUDENTS}
                    domainTags={MOCK_DOMAIN_TAGS}
                    date={dateString}
                />
            )}
        </div>
    );
}
