clean:
	-rm -rf ./packages/*/dist
	-rm -rf ./apps/*/.next
	-rm -rf ./packages/api/src/__generated__
	-rm -rf ./packages/core/@generated/*

clean-modules: clean
	-rm -rf ./packages/*/node_modules
	-rm -rf ./apps/*/node_modules
	-rm -rf ./node_modules
	-pnpm install

build: clean
	-pnpm run build --force

clean-e2e: clean-modules env-e2e
	-pnpm dlx playwright uninstall
	-(cd ./apps/starter && pnpm playwright install --with-deps)
	-pnpm run test:e2e

env-e2e:
	-export DEBUG=pw:api
	-export CI=true
