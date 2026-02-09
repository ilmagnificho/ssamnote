// Mock data for development before Supabase integration

import { Student, TimeBlock, Log, DomainTag } from "@/types/database";

export const MOCK_STUDENTS: Student[] = [
    { id: "s1", class_id: "c1", name: "김철수", birth_date: "2020-03-15", notes: null, created_at: "", updated_at: "" },
    { id: "s2", class_id: "c1", name: "이영희", birth_date: "2020-05-22", notes: null, created_at: "", updated_at: "" },
    { id: "s3", class_id: "c1", name: "박민준", birth_date: "2020-01-10", notes: null, created_at: "", updated_at: "" },
    { id: "s4", class_id: "c1", name: "정서윤", birth_date: "2020-07-08", notes: null, created_at: "", updated_at: "" },
    { id: "s5", class_id: "c1", name: "최지호", birth_date: "2020-02-28", notes: null, created_at: "", updated_at: "" },
    { id: "s6", class_id: "c1", name: "강하은", birth_date: "2020-09-14", notes: null, created_at: "", updated_at: "" },
    { id: "s7", class_id: "c1", name: "윤도현", birth_date: "2020-04-03", notes: null, created_at: "", updated_at: "" },
    { id: "s8", class_id: "c1", name: "임수아", birth_date: "2020-11-20", notes: null, created_at: "", updated_at: "" },
    { id: "s9", class_id: "c1", name: "한지민", birth_date: "2020-06-17", notes: null, created_at: "", updated_at: "" },
    { id: "s10", class_id: "c1", name: "오준서", birth_date: "2020-08-25", notes: null, created_at: "", updated_at: "" },
];

export const MOCK_TIME_BLOCKS: TimeBlock[] = [
    { id: "tb1", name: "등원", name_en: "Arrival", start_time: "09:00", end_time: "09:30", icon: "🏫", display_order: 1, is_active: true, created_at: "" },
    { id: "tb2", name: "오전간식", name_en: "Morning Snack", start_time: "09:30", end_time: "10:00", icon: "🍎", display_order: 2, is_active: true, created_at: "" },
    { id: "tb3", name: "자유놀이", name_en: "Free Play", start_time: "10:00", end_time: "11:30", icon: "🧩", display_order: 3, is_active: true, created_at: "" },
    { id: "tb4", name: "대소집단활동", name_en: "Group Activity", start_time: "11:30", end_time: "12:00", icon: "👥", display_order: 4, is_active: true, created_at: "" },
    { id: "tb5", name: "점심", name_en: "Lunch", start_time: "12:00", end_time: "13:00", icon: "🍚", display_order: 5, is_active: true, created_at: "" },
    { id: "tb6", name: "낮잠/휴식", name_en: "Nap/Rest", start_time: "13:00", end_time: "15:00", icon: "😴", display_order: 6, is_active: true, created_at: "" },
    { id: "tb7", name: "오후간식", name_en: "Afternoon Snack", start_time: "15:00", end_time: "15:30", icon: "🍪", display_order: 7, is_active: true, created_at: "" },
    { id: "tb8", name: "오후활동", name_en: "Afternoon Activity", start_time: "15:30", end_time: "17:00", icon: "🎨", display_order: 8, is_active: true, created_at: "" },
    { id: "tb9", name: "하원", name_en: "Departure", start_time: "17:00", end_time: "19:00", icon: "👋", display_order: 9, is_active: true, created_at: "" },
];

export const MOCK_DOMAIN_TAGS: DomainTag[] = [
    { id: "d1", name: "신체운동·건강", name_en: "Physical/Health", color: "#FF6B6B", display_order: 1, created_at: "" },
    { id: "d2", name: "의사소통", name_en: "Communication", color: "#4ECDC4", display_order: 2, created_at: "" },
    { id: "d3", name: "사회관계", name_en: "Social Relations", color: "#45B7D1", display_order: 3, created_at: "" },
    { id: "d4", name: "예술경험", name_en: "Art Experience", color: "#96CEB4", display_order: 4, created_at: "" },
    { id: "d5", name: "자연탐구", name_en: "Nature Inquiry", color: "#FFEAA7", display_order: 5, created_at: "" },
];

export const MOCK_LOGS: Log[] = [
    {
        id: "l1",
        user_id: "u1",
        class_id: "c1",
        date: "2026-02-09",
        block_id: "tb1",
        raw_content: "철수랑 영희가 밝게 인사하면서 등원함",
        refined_content: "김철수와 이영희가 밝은 표정으로 등원하며 교사와 친구들에게 적극적으로 인사하였다.",
        interpretation: "두 유아 모두 긍정적인 사회성 발달을 보이고 있으며, 또래 관계 형성에 적극적인 모습을 관찰할 수 있다.",
        student_ids: ["s1", "s2"],
        domain_tags: ["사회관계"],
        weather: "sunny",
        is_class_wide: false,
        created_at: "",
        updated_at: "",
    },
    {
        id: "l2",
        user_id: "u1",
        class_id: "c1",
        date: "2026-02-09",
        block_id: "tb3",
        raw_content: "민준이가 블록으로 높은 탑 쌓기",
        refined_content: "박민준이 다양한 크기의 블록을 활용하여 높은 탑을 쌓는 구성놀이에 집중하였다.",
        interpretation: "공간 지각 능력과 소근육 발달이 우수하며, 목표를 향한 집중력이 발달하고 있다.",
        student_ids: ["s3"],
        domain_tags: ["자연탐구", "신체운동·건강"],
        weather: "sunny",
        is_class_wide: false,
        created_at: "",
        updated_at: "",
    },
];

export const WEATHER_OPTIONS = [
    { value: "sunny", label: "맑음", icon: "☀️" },
    { value: "cloudy", label: "흐림", icon: "☁️" },
    { value: "rainy", label: "비", icon: "🌧️" },
    { value: "snowy", label: "눈", icon: "❄️" },
] as const;

export const MOCK_CLASS = {
    id: "c1",
    name: "꽃잎반",
    age_group: "만4세",
};
