#!/bin/bash

# CollectorPRO Testing Execution Script
# Automated testing for pre-launch validation

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="http://localhost:3000"
TEST_RESULTS_DIR="testing/results"
LOG_FILE="testing/test-execution.log"

# Create results directory
mkdir -p "$TEST_RESULTS_DIR"

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

success() {
    echo -e "${GREEN}✅ $1${NC}" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}⚠️ $1${NC}" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}❌ $1${NC}" | tee -a "$LOG_FILE"
}

# Test counter
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Test execution function
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_status="$3"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    log "Running test: $test_name"
    
    if eval "$test_command"; then
        success "PASSED: $test_name"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        error "FAILED: $test_name"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

# Performance test function
test_performance() {
    local endpoint="$1"
    local target_time="$2"
    local test_name="$3"
    
    log "Testing performance: $test_name"
    
    local start_time=$(date +%s%N)
    local response=$(curl -s -o /dev/null -w "%{http_code}" "$endpoint")
    local end_time=$(date +%s%N)
    
    local duration=$(( (end_time - start_time) / 1000000 ))  # Convert to milliseconds
    
    if [ "$response" = "200" ] && [ "$duration" -lt "$target_time" ]; then
        success "PASSED: $test_name (${duration}ms < ${target_time}ms)"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        error "FAILED: $test_name (${duration}ms >= ${target_time}ms or status $response)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
}

# Check if server is running
check_server() {
    log "Checking if CollectorPRO server is running..."
    
    if curl -s -o /dev/null -w "%{http_code}" "$BASE_URL" | grep -q "200"; then
        success "Server is running at $BASE_URL"
        return 0
    else
        error "Server is not running at $BASE_URL"
        error "Please start the server with: npm run dev"
        exit 1
    fi
}

# Phase 1: Core Functionality Testing
phase1_core_functionality() {
    log "=== Phase 1: Core Functionality Testing ==="
    
    # Test NBA TopShot API
    run_test "NBA TopShot API Connection" \
        "curl -s -o /dev/null -w '%{http_code}' '$BASE_URL/api/flow/marketplace' | grep -q '200'" \
        "200"
    
    # Test search performance
    test_performance "$BASE_URL/api/flow/marketplace" 200 "Search Performance"
    
    # Test filter performance
    test_performance "$BASE_URL/api/flow/marketplace" 200 "Filter Performance"
    
    # Test image loading
    test_performance "$BASE_URL/api/placeholder/48/48" 2000 "Image Loading"
    
    # Test pack activity API
    run_test "Pack Activity API" \
        "curl -s -o /dev/null -w '%{http_code}' '$BASE_URL/api/flow/packs' | grep -q '200'" \
        "200"
    
    # Test collections API
    run_test "Collections API" \
        "curl -s -o /dev/null -w '%{http_code}' '$BASE_URL/api/flow/collections' | grep -q '200'" \
        "200"
    
    # Test authentication (should fail without auth)
    run_test "Authentication Enforcement" \
        "curl -s -o /dev/null -w '%{http_code}' '$BASE_URL/api/flow/portfolio' | grep -q '400'" \
        "400"
}

# Phase 2: User Flow Testing
phase2_user_flows() {
    log "=== Phase 2: User Flow Testing ==="
    
    # Test landing page
    run_test "Landing Page Load" \
        "curl -s -o /dev/null -w '%{http_code}' '$BASE_URL' | grep -q '200'" \
        "200"
    
    # Test dashboard page
    run_test "Dashboard Page Load" \
        "curl -s -o /dev/null -w '%{http_code}' '$BASE_URL/dashboard' | grep -q '200'" \
        "200"
    
    # Test marketplace page
    run_test "Marketplace Page Load" \
        "curl -s -o /dev/null -w '%{http_code}' '$BASE_URL/marketplace' | grep -q '200'" \
        "200"
    
    # Test activity page
    run_test "Activity Page Load" \
        "curl -s -o /dev/null -w '%{http_code}' '$BASE_URL/activity' | grep -q '200'" \
        "200"
    
    # Test connect page
    run_test "Connect Page Load" \
        "curl -s -o /dev/null -w '%{http_code}' '$BASE_URL/connect' | grep -q '200'" \
        "200"
}

# Phase 3: Performance Testing
phase3_performance() {
    log "=== Phase 3: Performance Testing ==="
    
    # Test multiple concurrent requests
    log "Testing concurrent request handling..."
    
    local concurrent_requests=10
    local passed_concurrent=0
    
    for i in $(seq 1 $concurrent_requests); do
        if curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/flow/marketplace" | grep -q "200"; then
            passed_concurrent=$((passed_concurrent + 1))
        fi
    done
    
    if [ "$passed_concurrent" -eq "$concurrent_requests" ]; then
        success "PASSED: Concurrent Request Handling ($passed_concurrent/$concurrent_requests)"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        error "FAILED: Concurrent Request Handling ($passed_concurrent/$concurrent_requests)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    # Test response time consistency
    log "Testing response time consistency..."
    
    local times=()
    for i in $(seq 1 5); do
        local start_time=$(date +%s%N)
        curl -s -o /dev/null "$BASE_URL/api/flow/marketplace" > /dev/null
        local end_time=$(date +%s%N)
        local duration=$(( (end_time - start_time) / 1000000 ))
        times+=($duration)
    done
    
    # Calculate average and check consistency
    local sum=0
    for time in "${times[@]}"; do
        sum=$((sum + time))
    done
    local avg=$((sum / ${#times[@]}))
    
    # Check if all times are within 50% of average
    local consistent=true
    for time in "${times[@]}"; do
        if [ $time -gt $((avg * 3 / 2)) ] || [ $time -lt $((avg / 2)) ]; then
            consistent=false
            break
        fi
    done
    
    if [ "$consistent" = true ]; then
        success "PASSED: Response Time Consistency (avg: ${avg}ms)"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        error "FAILED: Response Time Consistency (avg: ${avg}ms, times: ${times[*]})"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
}

# Phase 4: Edge Case Testing
phase4_edge_cases() {
    log "=== Phase 4: Edge Case Testing ==="
    
    # Test invalid endpoints
    run_test "Invalid Endpoint Handling" \
        "curl -s -o /dev/null -w '%{http_code}' '$BASE_URL/api/nonexistent' | grep -q '404'" \
        "404"
    
    # Test malformed JSON
    run_test "Malformed JSON Handling" \
        "curl -s -X POST -H 'Content-Type: application/json' -d '{invalid json}' '$BASE_URL/api/flow/marketplace' | grep -q '400\|500'" \
        "400/500"
    
    # Test large payload
    log "Testing large payload handling..."
    local large_payload=$(printf '{"searchTerm":"%s"}' "$(printf 'a%.0s' {1..10000})")
    
    if curl -s -X POST -H "Content-Type: application/json" -d "$large_payload" "$BASE_URL/api/flow/marketplace" > /dev/null 2>&1; then
        success "PASSED: Large Payload Handling"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        error "FAILED: Large Payload Handling"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
}

# Phase 5: Browser Compatibility (Basic)
phase5_browser_compatibility() {
    log "=== Phase 5: Browser Compatibility Testing ==="
    
    # Test User-Agent handling
    log "Testing User-Agent handling..."
    
    # Test Chrome User-Agent
    if curl -s -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" \
        -o /dev/null -w "%{http_code}" "$BASE_URL" | grep -q "200"; then
        success "PASSED: Chrome User-Agent Handling"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        error "FAILED: Chrome User-Agent Handling"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    # Test Safari User-Agent
    if curl -s -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15" \
        -o /dev/null -w "%{http_code}" "$BASE_URL" | grep -q "200"; then
        success "PASSED: Safari User-Agent Handling"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        error "FAILED: Safari User-Agent Handling"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    # Test Mobile User-Agent
    if curl -s -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1" \
        -o /dev/null -w "%{http_code}" "$BASE_URL" | grep -q "200"; then
        success "PASSED: Mobile User-Agent Handling"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        error "FAILED: Mobile User-Agent Handling"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
}

# Generate test report
generate_report() {
    local report_file="$TEST_RESULTS_DIR/test-report-$(date +%Y%m%d-%H%M%S).md"
    
    log "Generating test report: $report_file"
    
    cat > "$report_file" << EOF
# CollectorPRO Test Execution Report

**Date:** $(date)
**Environment:** Local Development
**Base URL:** $BASE_URL

## Test Summary

- **Total Tests:** $TOTAL_TESTS
- **Passed:** $PASSED_TESTS
- **Failed:** $FAILED_TESTS
- **Pass Rate:** $((PASSED_TESTS * 100 / TOTAL_TESTS))%

## Test Results by Phase

### Phase 1: Core Functionality Testing
- API endpoints responding correctly
- Performance benchmarks met
- Error handling working properly

### Phase 2: User Flow Testing
- Page loading working correctly
- Navigation functioning properly

### Phase 3: Performance Testing
- Concurrent request handling tested
- Response time consistency validated

### Phase 4: Edge Case Testing
- Error handling for invalid requests
- Large payload handling tested

### Phase 5: Browser Compatibility Testing
- User-Agent handling tested
- Cross-browser compatibility validated

## Recommendations

$(if [ $FAILED_TESTS -eq 0 ]; then
    echo "- All tests passed! Ready for next phase of testing."
else
    echo "- $FAILED_TESTS tests failed. Review and fix issues before proceeding."
fi)

## Next Steps

1. Complete manual UI testing
2. Test with real user data
3. Perform security validation
4. Test production deployment

EOF

    success "Test report generated: $report_file"
}

# Main execution
main() {
    log "Starting CollectorPRO Testing Execution"
    log "======================================"
    
    # Check server
    check_server
    
    # Run test phases
    phase1_core_functionality
    phase2_user_flows
    phase3_performance
    phase4_edge_cases
    phase5_browser_compatibility
    
    # Generate report
    generate_report
    
    # Final summary
    log "=== Test Execution Complete ==="
    log "Total Tests: $TOTAL_TESTS"
    log "Passed: $PASSED_TESTS"
    log "Failed: $FAILED_TESTS"
    log "Pass Rate: $((PASSED_TESTS * 100 / TOTAL_TESTS))%"
    
    if [ $FAILED_TESTS -eq 0 ]; then
        success "All tests passed! CollectorPRO is ready for the next phase."
        exit 0
    else
        error "$FAILED_TESTS tests failed. Please review and fix issues."
        exit 1
    fi
}

# Run main function
main "$@" 