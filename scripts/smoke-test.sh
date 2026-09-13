#!/usr/bin/env bash
# Production smoke test — run after every deployment.
#   BASE_URL=https://your-domain.com API_URL=https://api.your-domain.com/api ./scripts/smoke-test.sh
# Exit code 0 = all green, 1 = at least one failure.
set -u

BASE="${BASE_URL:-http://localhost:3000}"
API="${API_URL:-http://localhost:4000/api}"
fail=0

check() {
  if [ "$1" = "$2" ]; then
    echo "PASS  $3"
  else
    echo "FAIL  $3 (expected $2, got $1)"
    fail=1
  fi
}

code() {
  curl -s -o /dev/null -w '%{http_code}' "$1"
}

echo "— Frontend ($BASE) —"
check "$(code "$BASE/")" 200 "home page renders"
check "$(code "$BASE/faculty/arjun-mehta")" 200 "faculty profile renders"
check "$(code "$BASE/nonexistent-check")" 404 "unknown route returns 404"
check "$(code "$BASE/robots.txt")" 200 "robots.txt served"
check "$(code "$BASE/sitemap.xml")" 200 "sitemap.xml served"
check "$(code "$BASE/opengraph-image")" 200 "OG image generated"

HOMEDOMAIN=$(curl -s "$BASE/" | grep -o 'rel="canonical" href="[^"]*"' | head -1)
echo "INFO  canonical: $HOMEDOMAIN (verify it is the REAL domain)"

echo "— Security headers —"
HDRS=$(curl -s -D - -o /dev/null "$BASE/")
echo "$HDRS" | grep -qi "x-frame-options" && echo "PASS  X-Frame-Options present" || { echo "FAIL  X-Frame-Options missing"; fail=1; }
echo "$HDRS" | grep -qi "x-content-type-options" && echo "PASS  X-Content-Type-Options present" || { echo "FAIL  X-Content-Type-Options missing"; fail=1; }
echo "$HDRS" | grep -qi "strict-transport-security" && echo "PASS  HSTS present" || { echo "FAIL  HSTS missing"; fail=1; }

echo "— API ($API) —"
check "$(code "$API/health")" 200 "health endpoint up"
DBSTATE=$(curl -s "$API/health" | grep -o '"database":"[a-z-]*"')
echo "INFO  $DBSTATE (must be \"connected\" in production)"
POST_CODE=$(curl -s -o /dev/null -w '%{http_code}' -X POST \
  -H 'Content-Type: application/json' \
  -d '{"email":"smoke@test.dev","category":"Other / General Support","message":"deployment smoke test"}' \
  "$API/support")
check "$POST_CODE" 201 "valid inquiry accepted"

if [ "$fail" = "0" ]; then
  echo "ALL CHECKS PASSED ✅"
else
  echo "SOME CHECKS FAILED ❌"
fi
exit $fail
