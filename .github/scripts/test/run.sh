#!/bin/sh
set -e  # immediately fail script on any command error
DIR=$(dirname "$0")
cp .env.sample $DIR/.env
cd $DIR
export SERVER_IMAGE="$1"
docker-compose up -d
docker-compose exec -T test yarn db:setup
docker-compose exec -T test yarn test:server
docker-compose exec -T test yarn test:services
docker-compose down
