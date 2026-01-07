import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd())

    return {
        build: {
            cssMinify: false // Deactivate esbuild and use cssnano for CSS only

            // Other build options go here
        },
        plugins: [
            react({
                babel: {
                    plugins: [
                        [
                            'babel-plugin-styled-components',
                            {
                                displayName: true,
                                fileName: false
                            }
                        ]
                    ]
                }
            })
        ],

        base: env.VITE_REACT_APP_BASE_PATH,

        css: {
            postcss: {
                plugins: [tailwindcss()]
            }
        }
    }
})
