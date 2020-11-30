module.exports = {
  globals: {
    TEST: true,
    "ts-jest": {
      tsconfig: "<rootDir>/src/tsconfig.json",
    },
  },
  moduleFileExtensions: ["js", "json", "ts", "tsx"],
  rootDir: ".",
  roots: ["<rootDir>/test"],
  testEnvironment: "node",
  testRegex: ".test.[jt]s$",
  transform: {
    "^.+\\.[jt]sx?$": "ts-jest",
    ".+\\.(svg|css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$":
      "jest-transform-stub",
  },
};
