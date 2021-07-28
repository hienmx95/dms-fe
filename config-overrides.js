const {override, fixBabelImports, addLessLoader} = require("customize-cra");

module.exports = override(
    fixBabelImports("import", {
        libraryName: "antd",
        libraryDirectory: "es",
        style: true,
    }),
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: {
            '@primary-color': '#a32f4a',
            '@link-color': '#a32f4a',
            '@font-size-base': '12px',
            '@card-head-padding': '8px',
            '@card-padding-base': '10px',
        },
    }),
);
