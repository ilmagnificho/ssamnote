"use client";

import { createClient } from "@/lib/supabase/client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const supabase = createClient();

        // Check if already logged in
        const checkUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (user) {
                router.push("/");
            }
        };
        checkUser();

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === "SIGNED_IN" && session) {
                router.push("/");
            }
        });

        return () => subscription.unsubscribe();
    }, [mounted, router]);

    if (!mounted) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">🌸 SsamNote</h1>
                    <p className="text-gray-400">로딩 중...</p>
                </div>
            </div>
        );
    }

    const supabase = createClient();

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        🌸 SsamNote
                    </h1>
                    <p className="text-gray-500">
                        어린이집 교사를 위한 스마트 관찰 기록
                    </p>
                </div>

                {/* Auth UI */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <Auth
                        supabaseClient={supabase}
                        appearance={{
                            theme: ThemeSupa,
                            variables: {
                                default: {
                                    colors: {
                                        brand: "#3b82f6",
                                        brandAccent: "#2563eb",
                                    },
                                    borderWidths: {
                                        buttonBorderWidth: "1px",
                                        inputBorderWidth: "1px",
                                    },
                                    radii: {
                                        borderRadiusButton: "0.5rem",
                                        buttonBorderRadius: "0.5rem",
                                        inputBorderRadius: "0.5rem",
                                    },
                                },
                            },
                        }}
                        localization={{
                            variables: {
                                sign_in: {
                                    email_label: "이메일",
                                    password_label: "비밀번호",
                                    button_label: "로그인",
                                    loading_button_label: "로그인 중...",
                                    email_input_placeholder: "이메일을 입력하세요",
                                    password_input_placeholder: "비밀번호를 입력하세요",
                                    link_text: "이미 계정이 있으신가요? 로그인",
                                },
                                sign_up: {
                                    email_label: "이메일",
                                    password_label: "비밀번호",
                                    button_label: "회원가입",
                                    loading_button_label: "회원가입 중...",
                                    email_input_placeholder: "이메일을 입력하세요",
                                    password_input_placeholder: "비밀번호를 입력하세요",
                                    link_text: "계정이 없으신가요? 회원가입",
                                },
                            },
                        }}
                        providers={[]}
                        redirectTo={`${window.location.origin}/auth/callback`}
                    />
                </div>

                <p className="text-center text-xs text-gray-400 mt-6">
                    로그인하면 서비스 이용약관에 동의하는 것으로 간주됩니다.
                </p>
            </div>
        </div>
    );
}
