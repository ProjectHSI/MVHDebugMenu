// @ts-ignore
export default (ctx) => ({
    parser: false,
    map: ctx.env === "development" ? ctx.map : false,
    plugins: {
        cssnano: ctx.env === 'production' ? {} : false
    }
})