echo "Waiting for web server to become ready ..."
# shellcheck disable=SC2091
until $(curl --output /dev/null -X "GET" -H "accept: application/fhir+json" --silent --fail "$1/metadata"); do
    printf '.'
    sleep 5
done