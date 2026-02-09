"use client";

import { Badge } from "@/components/ui/badge";
import { DomainTag } from "@/types/database";
import { cn } from "@/lib/utils";

interface DomainTagSelectorProps {
    tags: DomainTag[];
    selectedTags: string[];
    onSelectionChange: (tags: string[]) => void;
}

export function DomainTagSelector({
    tags,
    selectedTags,
    onSelectionChange,
}: DomainTagSelectorProps) {
    const toggleTag = (tagName: string) => {
        if (selectedTags.includes(tagName)) {
            onSelectionChange(selectedTags.filter((t) => t !== tagName));
        } else {
            onSelectionChange([...selectedTags, tagName]);
        }
    };

    return (
        <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
                누리과정 영역
            </label>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => {
                    const isSelected = selectedTags.includes(tag.name);
                    return (
                        <Badge
                            key={tag.id}
                            variant="outline"
                            className={cn(
                                "cursor-pointer transition-all px-3 py-1.5 border-2",
                                isSelected
                                    ? "text-white border-transparent"
                                    : "hover:opacity-80"
                            )}
                            style={{
                                backgroundColor: isSelected ? tag.color || "#888" : "transparent",
                                borderColor: isSelected ? "transparent" : tag.color || "#888",
                                color: isSelected ? "white" : tag.color || "#888",
                            }}
                            onClick={() => toggleTag(tag.name)}
                        >
                            {tag.name}
                        </Badge>
                    );
                })}
            </div>
        </div>
    );
}
