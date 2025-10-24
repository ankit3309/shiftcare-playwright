# ShiftCare Playwright Test Suite

This repository contains end-to-end tests for the ShiftCare application using Playwright. The test suite covers admin and carer workflows including shift creation, editing, deletion, and verification across different user roles.

## 📋 Prerequisites

- Node.js (version 16 or higher)
- npm (comes with Node.js)
- Git

## 🚀 Initial Setup

### 1. Initialize Project

```bash
# Initialize npm project
npm init -y

# Install Playwright
npm install --save-dev @playwright/test

# Install additional dependencies
npm install dotenv cross-env
```

### 2. Install Playwright Browsers

```bash
# Install browser binaries
npx playwright install
```

### 3. Environment Configuration

Create a `.env` file in the root directory with your ShiftCare credentials for both staging and production environments:

```env
# Staging Environment
SHIFTCARE_STAGING_BASE_URL=https://app-stg.shiftcare.com
SHIFTCARE_STAGING_EMAIL=barwalankit12345+staging@gmail.com
SHIFTCARE_STAGING_PASSWORD=InvalidPassword
SHIFTCARE_STAGING_CARER_EMAIL=barwalankit12345+johncarer@gmail.com
SHIFTCARE_STAGING_CARER_PASSWORD=InvalidPassword

# Production Environment
SHIFTCARE_PRODUCTION_BASE_URL=https://app.shiftcare.com
SHIFTCARE_PRODUCTION_EMAIL=barwalankit12345+automationprod@gmail.com
SHIFTCARE_PRODUCTION_PASSWORD=InvalidPassword
SHIFTCARE_PRODUCTION_CARER_EMAIL=barwalankit12345+johnprod@gmail.com
SHIFTCARE_PRODUCTION_CARER_PASSWORD=InvalidPassword
```

**⚠️ Important:** The credentials are configured for staging and production environments. Update them as needed for your specific setup.

### 4. Project Structure

```
shiftcare-playwright/
├── .env                          # Environment variables
├── auth.json                     # Saved authentication state
├── package.json                  # Project dependencies
├── playwright.config.js         # Playwright configuration
├── pages/                        # Page Object Model classes
│   ├── LoginPage.js             # Login page interactions
│   ├── ShiftPage.js             # Shift management page interactions
│   └── ProfilePage.js           # User profile page interactions
├── tests/                        # Test files
│   ├── Auth.setup.spec.js       # Authentication setup
│   ├── Shift.spec.js            # Shift management tests
│   └── Profile.spec.js           # Profile management tests
├── playwright-report/            # Test reports (generated)
└── test-results/                 # Test artifacts (generated)
```

## 🧪 Test Configuration

### Playwright Configuration (`playwright.config.js`)

The project uses multiple Playwright projects for different test scenarios:

- **`setup`**: Runs authentication setup and saves admin state to `auth.json`
- **`chromium`**: Runs all tests with saved authentication state

Key features:
- **Parallel execution**: `fullyParallel: true` with `workers: 2`
- **Authentication state**: Reuses saved login state for faster test execution
- **reCAPTCHA handling**: Automated reCAPTCHA interaction
- **Cross-role testing**: Admin and carer workflow verification

## 🎯 Test Scenarios

### 1. Authentication Setup (`Auth.setup.spec.js`)
- Logs in as admin user
- Saves authentication state to `auth.json`
- Handles reCAPTCHA challenges

### 2. Shift Management Tests (`Shift.spec.js`)

#### Test 01: Create and Verify Shift
- Admin creates a new shift
- Admin verifies shift creation
- Carer logs in and verifies shift visibility

#### Test 02: Edit and Verify Shift
- Admin creates a shift
- Admin edits shift details
- Admin verifies shift update
- Carer logs in and verifies updated shift

#### Test 03: Create and Delete Shift
- Admin creates a shift
- Admin verifies shift creation
- Admin deletes the shift

### 3. Profile Management Tests (`Profile.spec.js`)

#### Test 01: Update Profile Name
- Admin navigates to main dashboard
- Admin clicks user menu and profile link (opens new tab)
- Admin switches to new tab and edits profile name
- Admin verifies profile name update
- Admin reverts profile name to original
- Properly handles new tab scenario and cleanup

#### Test 02: Invalid Login Credentials
- Attempts login with invalid password
- Verifies error message for invalid credentials
- Ensures proper error handling

## 🏃‍♂️ Running Tests

### Environment-Specific Testing

The test suite supports both **staging** and **production** environments:

#### Staging Environment
```bash
# Run all tests on staging
npm run test:staging


# Run staging tests with visible browser
npm run test:staging:headed

# Run staging tests in UI mode
npm run test:staging:ui
```

#### Production Environment
```bash
# Run all tests on production
npm run test:production

# Run production tests with visible browser
npm run test:production:headed

# Run production tests in UI mode
npm run test:production:ui
```

### General Command Line Interface

```bash
# Run all tests (default staging)
npx playwright test

# Run tests in headed mode (see browser)
npx playwright test --headed

# Run tests with specific project
npx playwright test --project=chromium
```

### UI Mode (Interactive)

```bash
# Open Playwright UI (default staging)
npx playwright test --ui

# Run staging tests in UI mode
npm run test:staging:ui

# Run production tests in UI mode
npm run test:production:ui

# Run tests in UI mode with specific project
npx playwright test --ui --project=chromium
```

### Test Reports

```bash
# Generate HTML report
npx playwright show-report

# Show last test report
npx playwright show-report playwright-report
```

## 🔧 Advanced Usage

### Running Tests in Parallel

The configuration supports parallel execution:

```bash
# Run with 2 workers (default)
npx playwright test --workers=2

# Run with 4 workers
npx playwright test --workers=4

# Run tests sequentially
npx playwright test --workers=1
```

### Debugging Tests

```bash
# Debug specific test
npx playwright test tests/Shift.spec.js -g "01" --debug
npx playwright test tests/Profile.spec.js -g "01" --debug

# Debug with browser inspector
npx playwright test --debug --headed
```

### Environment-Specific Testing

```bash
# Run tests against different environment
SHIFTCARE_BASE_URL=https://app-prod.shiftcare.com npx playwright test

# Run with different credentials
SHIFTCARE_EMAIL=test@example.com npx playwright test
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. Authentication Failures
```bash
# Regenerate auth state
npx playwright test tests/Auth.setup.spec.js --project=setup
```

#### 2. reCAPTCHA Issues
- Tests automatically handle reCAPTCHA challenges
- If reCAPTCHA fails, tests will retry with page reload
- Check network connectivity if reCAPTCHA consistently fails

#### 3. Test Timeouts
```bash
# Increase timeout for slow tests
npx playwright test --timeout=60000
```

#### 4. Browser Installation Issues
```bash
# Reinstall browsers
npx playwright install --force
```

### Debugging Tips

1. **Use UI Mode**: `npx playwright test --ui` for interactive debugging
2. **Check Reports**: `npx playwright show-report` for detailed test results
3. **Screenshots**: Failed tests automatically capture screenshots
4. **Traces**: Test traces are saved for debugging (enable in config)

## 📊 Test Results

### Expected Test Flow

1. **Setup Phase**: Admin authentication and state saving
2. **Test Execution**: Parallel execution of shift and profile management scenarios
3. **Verification**: Cross-role verification (admin → carer) and profile updates
4. **Cleanup**: Automatic context cleanup and isolation

### Performance Metrics

- **Setup Time**: ~20 seconds (one-time authentication)
- **Test Execution**: ~15-45 seconds per test scenario
- **Parallel Execution**: 2-3x faster than sequential execution

## 🔒 Security Notes

- **Credentials**: Never commit `.env` file to version control
- **Authentication State**: `auth.json` contains sensitive session data
- **Environment Variables**: Use different credentials for different environments
- **Session Isolation**: Tests use separate browser contexts for security

## 📝 Contributing

### Adding New Tests

1. Create new test file in `tests/` directory
2. Follow existing naming convention: `*.spec.js`
3. Use Page Object Model pattern in `pages/` directory
4. Update `playwright.config.js` if new project configuration needed

### Code Style

- Use async/await for all Playwright operations
- Follow Page Object Model pattern
- Add proper error handling and timeouts
- Include descriptive test names and comments

## 📞 Support

For issues related to:
- **Test failures**: Check test reports and screenshots
- **Authentication**: Verify credentials in `.env` file
- **Environment**: Ensure correct `SHIFTCARE_BASE_URL`
- **Playwright**: Check [Playwright documentation](https://playwright.dev/)

## 📄 License

This project is for internal testing purposes. Please ensure compliance with ShiftCare's terms of service when running tests.
