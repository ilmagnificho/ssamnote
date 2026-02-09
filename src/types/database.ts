// Database types for SsamNote
// These types mirror the Supabase schema

export interface Profile {
    id: string;
    email: string;
    name: string | null;
    created_at: string;
    updated_at: string;
}

export interface Class {
    id: string;
    teacher_id: string;
    name: string;
    age_group: string | null;
    created_at: string;
    updated_at: string;
}

export interface Student {
    id: string;
    class_id: string;
    name: string;
    birth_date: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface TimeBlock {
    id: string;
    name: string;
    name_en: string;
    start_time: string | null;
    end_time: string | null;
    icon: string | null;
    display_order: number;
    is_active: boolean;
    created_at: string;
}

export interface Log {
    id: string;
    user_id: string;
    class_id: string;
    date: string;
    block_id: string | null;
    raw_content: string;
    refined_content: string | null;
    interpretation: string | null;
    student_ids: string[];
    domain_tags: string[];
    weather: string | null;
    is_class_wide: boolean;
    created_at: string;
    updated_at: string;
}

export interface DomainTag {
    id: string;
    name: string;
    name_en: string;
    color: string | null;
    display_order: number;
    created_at: string;
}

// Weather options
export type Weather = "sunny" | "cloudy" | "rainy" | "snowy";

// Domain tag names (Korean)
export const DOMAIN_TAGS = [
    "신체운동·건강",
    "의사소통",
    "사회관계",
    "예술경험",
    "자연탐구",
] as const;

export type DomainTagName = (typeof DOMAIN_TAGS)[number];

// Expanded types with relations
export interface LogWithRelations extends Log {
    time_block?: TimeBlock;
    students?: Student[];
}

export interface ClassWithStudents extends Class {
    students: Student[];
}

// Form input types
export interface LogInput {
    date: string;
    block_id: string;
    raw_content: string;
    student_ids: string[];
    domain_tags: string[];
    weather?: Weather;
}
