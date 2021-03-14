module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    clearMocks: true,
    moduleDirectories: ["node_modules", 'src'],
    moduleNameMapper: {
      "@exmpl/(.*)": "<rootDir>/src/$1"
    },
  };