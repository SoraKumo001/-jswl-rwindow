module.exports = {
  globals: {
    TEST: true,
    "ts-jest": {
      tsconfig: "<rootDir>/src/tsconfig.json",
    },
  },
  moduleFileExtensions: ["js", "json", "ts", "tsx"],
  rootDir: ".",
  roots: ["<rootDir>/src"],
  testEnvironment: "node",
  testRegex: ".test.[jt]s$",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    ".+\\.(svg|css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$":
      "jest-transform-stub",
  },
};
