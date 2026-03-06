clean:
	-rm -rf ./packages/*/dist
	-rm -rf ./apps/*/.next
	-rm -rf ./packages/api/src/__generated__
	-rm -rf ./packages/core/@generated/*
	-rm -rf ./apps/*/.faststore
	-rm -rf ./packages/*/.faststore
	-rm -rf ./packages/*/.next

clean-modules: clean
	-rm -rf ./packages/*/node_modules
	-rm -rf ./apps/*/node_modules
	-rm -rf ./node_modules
	-rm -rf ./pnpm-lock.yaml
	-pnpm cache delete
	-pnpm install --force
	-$(MAKE) build

build: clean
	(cd ./packages/components && pnpm build)
	(cd ./packages/ui && pnpm build)
	(cd ./packages/sdk && pnpm build)
	(cd ./packages/api && pnpm build)
	(cd ./packages/cli && pnpm build)

clean-e2e: clean-modules env-e2e
	-pnpm dlx playwright uninstall
	-(cd ./apps/starter && pnpm playwright install --with-deps)
	-pnpm run test:e2e

env-e2e:
	-export DEBUG=pw:api
	-export CI=true
