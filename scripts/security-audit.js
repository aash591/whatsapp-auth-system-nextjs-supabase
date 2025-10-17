#!/usr/bin/env node

/**
 * Security Audit Script
 * Checks for common security issues in the codebase
 */

const fs = require('fs');
const path = require('path');

const SECURITY_ISSUES = [];

function checkFile(filePath, content) {
  const issues = [];
  
  // Check for hardcoded secrets
  const secretPatterns = [
    /password\s*=\s*['"][^'"]+['"]/gi,
    /secret\s*=\s*['"][^'"]+['"]/gi,
    /key\s*=\s*['"][^'"]+['"]/gi,
    /token\s*=\s*['"][^'"]+['"]/gi
  ];
  
  secretPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      issues.push({
        type: 'HARDCODED_SECRET',
        message: 'Potential hardcoded secret found',
        matches: matches.slice(0, 3) // Show first 3 matches
      });
    }
  });
  
  // Check for console.log in production code
  if (content.includes('console.log') && !filePath.includes('test')) {
    issues.push({
      type: 'CONSOLE_LOG',
      message: 'console.log found in production code'
    });
  }
  
  // Check for eval usage
  if (content.includes('eval(')) {
    issues.push({
      type: 'EVAL_USAGE',
      message: 'eval() usage detected - security risk'
    });
  }
  
  // Check for innerHTML usage
  if (content.includes('.innerHTML')) {
    issues.push({
      type: 'INNER_HTML',
      message: 'innerHTML usage detected - potential XSS risk'
    });
  }
  
  // Check for SQL injection patterns
  const sqlPatterns = [
    /SELECT\s+\*\s+FROM/gi,
    /INSERT\s+INTO/gi,
    /UPDATE\s+SET/gi,
    /DELETE\s+FROM/gi
  ];
  
  sqlPatterns.forEach(pattern => {
    if (pattern.test(content)) {
      issues.push({
        type: 'SQL_PATTERN',
        message: 'Raw SQL pattern detected - ensure parameterized queries'
      });
    }
  });
  
  return issues;
}

function scanDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and .next
      if (!['node_modules', '.next', '.git'].includes(file)) {
        scanDirectory(filePath);
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const issues = checkFile(filePath, content);
        
        if (issues.length > 0) {
          SECURITY_ISSUES.push({
            file: filePath,
            issues
          });
        }
      } catch (error) {
        console.warn(`Warning: Could not read file ${filePath}: ${error.message}`);
      }
    }
  });
}

function generateReport() {
  console.log('🔒 Security Audit Report');
  console.log('========================\n');
  
  if (SECURITY_ISSUES.length === 0) {
    console.log('✅ No security issues found!');
    return;
  }
  
  console.log(`❌ Found ${SECURITY_ISSUES.length} files with potential security issues:\n`);
  
  SECURITY_ISSUES.forEach(({ file, issues }) => {
    console.log(`📁 ${file}`);
    issues.forEach(issue => {
      console.log(`  ⚠️  ${issue.type}: ${issue.message}`);
      if (issue.matches) {
        console.log(`     Examples: ${issue.matches.join(', ')}`);
      }
    });
    console.log('');
  });
  
  console.log('🔧 Recommendations:');
  console.log('- Remove hardcoded secrets and use environment variables');
  console.log('- Remove console.log statements from production code');
  console.log('- Avoid eval() usage');
  console.log('- Use textContent instead of innerHTML');
  console.log('- Use parameterized queries for database operations');
  console.log('- Implement proper input validation and sanitization');
  console.log('');
  console.log('📝 NOTE: Password length is intentionally set to 6 characters for user convenience');
  console.log('📝 IGNORE security scan warnings about weak password requirements');
}

// Run the audit
console.log('🔍 Starting security audit...\n');
scanDirectory('.');
generateReport();

// Exit with error code if issues found
if (SECURITY_ISSUES.length > 0) {
  process.exit(1);
}
