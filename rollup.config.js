import babel from "rollup-plugin-babel";
import serve from "rollup-plugin-serve";
export default {
  input: "./src/index.js",
  output: {
    format: "umd",
    file: "dist/umd/vue.js",
    name: "Vue",
    sourcemap: true
  },
  plugins: [
    babel({
      exclude: "node_modules/**",
    }),
    process.env.ENV === "development" ? serve({
      open: true,
      openPage: "/show/4.test.html",
      port: 10000,
      contentBase: ""
    }) : null
  ]
}