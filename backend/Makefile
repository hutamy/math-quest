.PHONY: dep up down generate migrate run watch test

dep:
	npm install

up: 
	docker-compose up -d

down:
	docker-compose down

generate:
	npm run prisma:generate

migrate: 
	npm run prisma:migrate
	npm run prisma:seed

run:
	npm run dev

watch: 
	npm run watch

test: 
	npx tap test/*.test.ts