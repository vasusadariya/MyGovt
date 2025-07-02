#!/usr/bin/env ts-node

import { execSync } from "child_process"

console.log("🚀 Running comprehensive test suite...")

const tests = [
  {
    name: "Type Check",
    command: "npm run type-check",
    description: "Checking TypeScript types",
  },
  {
    name: "Linting",
    command: "npm run lint",
    description: "Running ESLint",
  },
  {
    name: "Unit Tests",
    command: "npm run test",
    description: "Running unit tests",
  },
  {
    name: "Integration Tests",
    command: "npm run test tests/integration",
    description: "Running integration tests",
  },
  {
    name: "Build Test",
    command: "npm run build",
    description: "Testing production build",
  },
]

let passed = 0
let failed = 0

for (const test of tests) {
  console.log(`\n📋 ${test.description}...`)
  try {
    execSync(test.command, { stdio: "inherit" })
    console.log(`✅ ${test.name} passed`)
    passed++
  } catch (error) {
    console.error(`❌ ${test.name} failed`,error)
    failed++
  }
}

console.log(`\n📊 Test Results:`)
console.log(`✅ Passed: ${passed}`)
console.log(`❌ Failed: ${failed}`)
console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`)

if (failed === 0) {
  console.log(`\n🎉 All tests passed! Ready for deployment.`)
  process.exit(0)
} else {
  console.log(`\n 😢 Some tests failed. Please fix them and try again.`)
  process.exit(1)
}
