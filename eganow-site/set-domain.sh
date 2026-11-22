#!/bin/bash
# Point canonical / og:url / sitemap / robots at your real domain.
# usage: ./set-domain.sh https://www.example.com
[ -z "$1" ] && { echo "usage: $0 https://your-domain"; exit 1; }
NEW="${1%/}"
cd "$(dirname "$0")"
find . -type f \( -name '*.html' -o -name 'sitemap.xml' -o -name 'robots.txt' \) -print0 | xargs -0 sed -i "s#https://eganow.framer.website#$NEW#g"
echo "Done. Domain set to $NEW"
