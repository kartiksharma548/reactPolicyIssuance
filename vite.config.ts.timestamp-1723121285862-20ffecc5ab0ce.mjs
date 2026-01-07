// vite.config.ts
import { defineConfig, loadEnv } from "file:///E:/Kartik/ReactApp/TMIBASLReact/node_modules/vite/dist/node/index.js";
import react from "file:///E:/Kartik/ReactApp/TMIBASLReact/node_modules/@vitejs/plugin-react/dist/index.mjs";
import tailwindcss from "file:///E:/Kartik/ReactApp/TMIBASLReact/node_modules/tailwindcss/lib/index.js";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    build: {
      cssMinify: false
      // Deactivate esbuild and use cssnano for CSS only
      // Other build options go here
    },
    plugins: [
      react({
        babel: {
          plugins: [
            [
              "babel-plugin-styled-components",
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
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxLYXJ0aWtcXFxcUmVhY3RBcHBcXFxcVE1JQkFTTFJlYWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJFOlxcXFxLYXJ0aWtcXFxcUmVhY3RBcHBcXFxcVE1JQkFTTFJlYWN0XFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9FOi9LYXJ0aWsvUmVhY3RBcHAvVE1JQkFTTFJlYWN0L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCB0YWlsd2luZGNzcyBmcm9tICd0YWlsd2luZGNzcydcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiB7XG4gICAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpKVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgYnVpbGQ6IHtcbiAgICAgICAgICAgIGNzc01pbmlmeTogZmFsc2UgLy8gRGVhY3RpdmF0ZSBlc2J1aWxkIGFuZCB1c2UgY3NzbmFubyBmb3IgQ1NTIG9ubHlcblxuICAgICAgICAgICAgLy8gT3RoZXIgYnVpbGQgb3B0aW9ucyBnbyBoZXJlXG4gICAgICAgIH0sXG4gICAgICAgIHBsdWdpbnM6IFtcbiAgICAgICAgICAgIHJlYWN0KHtcbiAgICAgICAgICAgICAgICBiYWJlbDoge1xuICAgICAgICAgICAgICAgICAgICBwbHVnaW5zOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2JhYmVsLXBsdWdpbi1zdHlsZWQtY29tcG9uZW50cycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5TmFtZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZU5hbWU6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgXSxcblxuICAgICAgICBiYXNlOiBlbnYuVklURV9SRUFDVF9BUFBfQkFTRV9QQVRILFxuXG4gICAgICAgIGNzczoge1xuICAgICAgICAgICAgcG9zdGNzczoge1xuICAgICAgICAgICAgICAgIHBsdWdpbnM6IFt0YWlsd2luZGNzcygpXVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBdVIsU0FBUyxjQUFjLGVBQWU7QUFDN1QsT0FBTyxXQUFXO0FBQ2xCLE9BQU8saUJBQWlCO0FBRXhCLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxNQUFNO0FBQ3RDLFFBQU0sTUFBTSxRQUFRLE1BQU0sUUFBUSxJQUFJLENBQUM7QUFFdkMsU0FBTztBQUFBLElBQ0gsT0FBTztBQUFBLE1BQ0gsV0FBVztBQUFBO0FBQUE7QUFBQSxJQUdmO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDTCxNQUFNO0FBQUEsUUFDRixPQUFPO0FBQUEsVUFDSCxTQUFTO0FBQUEsWUFDTDtBQUFBLGNBQ0k7QUFBQSxjQUNBO0FBQUEsZ0JBQ0ksYUFBYTtBQUFBLGdCQUNiLFVBQVU7QUFBQSxjQUNkO0FBQUEsWUFDSjtBQUFBLFVBQ0o7QUFBQSxRQUNKO0FBQUEsTUFDSixDQUFDO0FBQUEsSUFDTDtBQUFBLElBRUEsTUFBTSxJQUFJO0FBQUEsSUFFVixLQUFLO0FBQUEsTUFDRCxTQUFTO0FBQUEsUUFDTCxTQUFTLENBQUMsWUFBWSxDQUFDO0FBQUEsTUFDM0I7QUFBQSxJQUNKO0FBQUEsRUFDSjtBQUNKLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
