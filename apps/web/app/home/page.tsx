"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function HomePage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [token, setToken] = useState<string | null>(null)

    useEffect(() => {
        const tokenParam = searchParams.get("token")
        if (tokenParam) {
            // Lưu token vào localStorage hoặc Cookie
            localStorage.setItem("accessToken", tokenParam)
            setToken(tokenParam)

            // Xóa query param trên URL cho đẹp
            router.replace("/home")
        } else {
            // Check nếu đã có token trong storage thì load lên
            const savedToken = localStorage.getItem("accessToken");
            if (savedToken) setToken(savedToken);
        }
    }, [searchParams, router])

    return (
        <div className="flex flex-col items-center justify-center min-h-svh p-4">
            <h1 className="text-3xl font-bold mb-4">Home Page</h1>
            {token ? (
                <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded text-center">
                    <p className="font-bold">Đăng nhập thành công!</p>
                    <p className="text-sm mt-2 break-all">Token: {token.slice(0, 20)}...</p>
                    <button
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        onClick={() => {
                            localStorage.removeItem("accessToken");
                            setToken(null);
                            router.push("/");
                        }}
                    >
                        Đăng xuất
                    </button>
                </div>
            ) : (
                <p className="text-gray-500">Người dùng chưa đăng nhập.</p>
            )}
        </div>
    )
}
