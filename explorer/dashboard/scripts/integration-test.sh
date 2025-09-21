#!/bin/bash
# SocialBlock Explorer Integration Test Script
# Tests the integration between the explorer dashboard and backend services

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
EXPLORER_URL="http://localhost:3000"
NODE_RPC="http://localhost:26657"
NODE_REST="http://localhost:1317"
ARP_AGENT="http://localhost:8080"
INDEXER_API="http://localhost:3001"

# Test timeout
TIMEOUT=30

echo -e "${BLUE}🚀 Starting SocialBlock Explorer Integration Tests${NC}"
echo "================================================="

# Function to check if a service is responding
check_service() {
    local service_name=$1
    local url=$2
    local expected_status=${3:-200}
    
    echo -n "Testing $service_name... "
    
    if curl -s -f -m $TIMEOUT "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ OK${NC}"
        return 0
    else
        echo -e "${RED}❌ FAILED${NC}"
        return 1
    fi
}

# Function to check JSON response
check_json_response() {
    local service_name=$1
    local url=$2
    local expected_field=$3
    
    echo -n "Testing $service_name JSON response... "
    
    response=$(curl -s -m $TIMEOUT "$url" 2>/dev/null)
    
    if echo "$response" | jq -e ".$expected_field" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ OK${NC}"
        return 0
    else
        echo -e "${RED}❌ FAILED${NC}"
        echo "Response: $response"
        return 1
    fi
}

# Function to test WebSocket connection
test_websocket() {
    local url=$1
    echo -n "Testing WebSocket connection... "
    
    # Use a simple WebSocket test (requires websocat or similar tool)
    if command -v websocat > /dev/null; then
        if timeout 10 websocat -n1 "$url" < /dev/null > /dev/null 2>&1; then
            echo -e "${GREEN}✅ OK${NC}"
            return 0
        fi
    fi
    
    echo -e "${YELLOW}⚠️  SKIPPED (websocat not available)${NC}"
    return 0
}

# Test counter
total_tests=0
passed_tests=0

run_test() {
    local test_name=$1
    shift
    total_tests=$((total_tests + 1))
    
    echo ""
    echo -e "${BLUE}🧪 Test: $test_name${NC}"
    
    if "$@"; then
        passed_tests=$((passed_tests + 1))
    fi
}

echo ""
echo -e "${YELLOW}📋 Prerequisites Check${NC}"
echo "========================"

# Check if required tools are available
if ! command -v curl > /dev/null; then
    echo -e "${RED}❌ curl is required but not installed${NC}"
    exit 1
fi

if ! command -v jq > /dev/null; then
    echo -e "${RED}❌ jq is required but not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All required tools available${NC}"

echo ""
echo -e "${YELLOW}🔍 Service Health Checks${NC}"
echo "========================="

# Test 1: Explorer UI Health
run_test "Explorer UI Health Check" \
    check_service "Explorer UI" "$EXPLORER_URL/health"

# Test 2: Node RPC Status
run_test "Node RPC Status" \
    check_json_response "Node RPC" "$NODE_RPC/status" "result.node_info"

# Test 3: Node REST API
run_test "Node REST API" \
    check_json_response "Node REST" "$NODE_REST/cosmos/base/tendermint/v1beta1/node_info" "default_node_info"

# Test 4: ARP Agent Health (if API key is available)
if [ ! -z "$ARP_AGENT_API_KEY" ]; then
    run_test "ARP Agent Health" \
        check_service "ARP Agent" "$ARP_AGENT/health"
else
    echo -e "${YELLOW}⚠️  Skipping ARP Agent test (no API key)${NC}"
fi

# Test 5: Indexer API
run_test "Indexer API" \
    check_service "Indexer API" "$INDEXER_API/health"

echo ""
echo -e "${YELLOW}🔗 Proxy Integration Tests${NC}"
echo "=========================="

# Test 6: Explorer API Proxy
run_test "Explorer API Proxy" \
    check_json_response "API Proxy" "$EXPLORER_URL/api/cosmos/base/tendermint/v1beta1/node_info" "default_node_info"

# Test 7: Explorer RPC Proxy
run_test "Explorer RPC Proxy" \
    check_json_response "RPC Proxy" "$EXPLORER_URL/rpc/status" "result.node_info"

# Test 8: Explorer ARP Proxy (if API key is available)
if [ ! -z "$ARP_AGENT_API_KEY" ]; then
    run_test "Explorer ARP Proxy" \
        check_service "ARP Proxy" "$EXPLORER_URL/arp/health"
fi

# Test 9: Explorer Indexer Proxy
run_test "Explorer Indexer Proxy" \
    check_service "Indexer Proxy" "$EXPLORER_URL/indexer/health"

echo ""
echo -e "${YELLOW}📡 Real-time Features${NC}"
echo "====================="

# Test 10: WebSocket Connection
run_test "WebSocket Connection" \
    test_websocket "ws://localhost:3000/ws/websocket"

echo ""
echo -e "${YELLOW}🌐 Frontend Tests${NC}"
echo "=================="

# Test 11: Explorer UI Loads
run_test "Explorer UI Loads" \
    check_service "Explorer Main Page" "$EXPLORER_URL"

# Test 12: Static Assets
run_test "Static Assets" \
    check_service "CSS Assets" "$EXPLORER_URL/assets/index.css" "200"

echo ""
echo -e "${YELLOW}📊 Data Integration Tests${NC}"
echo "========================="

# Test 13: Latest Block Data
run_test "Latest Block Data" \
    check_json_response "Latest Block" "$EXPLORER_URL/api/cosmos/base/tendermint/v1beta1/blocks/latest" "block.header"

# Test 14: Validator Data
run_test "Validator Data" \
    check_json_response "Validators" "$EXPLORER_URL/api/cosmos/staking/v1beta1/validators" "validators"

# Test 15: Node Status via Proxy
run_test "Node Status via Proxy" \
    check_json_response "Node Status" "$EXPLORER_URL/rpc/status" "result.sync_info"

echo ""
echo "================================================="
echo -e "${BLUE}📈 Test Results Summary${NC}"
echo "================================================="

if [ $passed_tests -eq $total_tests ]; then
    echo -e "${GREEN}✅ All tests passed! ($passed_tests/$total_tests)${NC}"
    echo -e "${GREEN}🎉 SocialBlock Explorer integration is working correctly!${NC}"
    exit 0
else
    echo -e "${RED}❌ Some tests failed ($passed_tests/$total_tests passed)${NC}"
    echo -e "${YELLOW}💡 Check the service logs for more details:${NC}"
    echo "   - Explorer: docker compose logs explorer-ui"
    echo "   - Node: docker compose logs node"
    echo "   - ARP Agent: docker compose logs arp-agent"
    echo "   - Indexer: docker compose logs indexer"
    exit 1
fi
