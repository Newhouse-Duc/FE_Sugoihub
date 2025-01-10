/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui"
export default {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      // Định nghĩa các màu mặc định
      colors: {
        primary: '#213547', // Màu chính
        secondary: '#6c757d', // Màu phụ
        accent: '#1db954', // Màu nổi bật
        neutral: '#3d4451', // Màu trung tính
        background: '#ffffff', // Màu nền mặc định
        text: '#213547', // Màu chữ mặc định
      },
    },
  },
  plugins: [daisyui],
  // Cấu hình DaisyUI theme (nếu bạn muốn)
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#213547",         // Màu chính (primary)
          "secondary": "#6c757d",       // Màu phụ (secondary)
          "accent": "#1db954",          // Màu nổi bật (accent)
          "neutral": "#3d4451",         // Màu trung tính (neutral)
          "base-100": "#ffffff",        // Màu nền chính
          "base-content": "#213547",
        },
      },
    ],
  },
}