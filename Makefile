clean:
	-rm -rf ./packages/*/dist
	-rm -rf ./packages/api/src/__generated__
	-rm -rf ./packages/core/@generated/*


build: clean
	-pnpm run build --force
