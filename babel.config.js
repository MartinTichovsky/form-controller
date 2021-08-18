module.exports = function (api, options) {
  api.cache(false);

  const presets = [
    "@babel/preset-typescript",
    ["@babel/preset-env", { targets: { esmodules: true } }],
    "@babel/preset-react"
  ];
  const plugins = ["./plugin/ts-internal"];

  return {
    presets,
    plugins
  };
};
