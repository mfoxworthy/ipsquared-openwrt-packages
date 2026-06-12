#!/bin/sh
# nfwa-fetch.sh <base_url> <endpoint>
#
# Downloads all pages of a paginated Netify API endpoint and outputs each
# page's JSON as a single compact line to stdout.
#
# Called by netify-plugin-fwa via a single popen() so that the per-page
# uclient-fetch calls fork from sh (tiny) rather than from netifyd (141MB).
#
# Usage: nfwa-fetch.sh https://api.netify.ai/api/v1 /lookup/applications

BASE="$1"
ENDPOINT="$2"
page=1
total=1

while [ "$page" -le "$total" ]; do
    data=$(uclient-fetch -q -T 30 -O - \
        "${BASE}${ENDPOINT}?settings_limit=100&page=${page}" 2>/dev/null) || exit 1
    [ -z "$data" ] && exit 1

    if [ "$page" = 1 ]; then
        t=$(printf '%s' "$data" | jsonfilter -e '@.data_info.total_pages' 2>/dev/null)
        [ -n "$t" ] && [ "$t" -gt 0 ] 2>/dev/null && total=$t
    fi

    # Compact to a single line so C++ can parse one JSON object per fgets line
    printf '%s' "$data" | tr -d '\n'
    printf '\n'

    page=$(( page + 1 ))
done
