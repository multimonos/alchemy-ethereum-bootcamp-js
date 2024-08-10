
.PHONY: week1 week2 week3 week4 week4-deploy week4-sol week5 week6 week7 week8


week1:
	@vitest watch src/week1/*
week2:
	@vitest watch src/week2/*
week3:
	@vitest watch src/week3/*
week4:
	@vitest watch src/week4/*
week4-deploy:
	@forge clean
	@forge script ./src/week04/Counter.s.sol --json --broadcast --rpc-url=$(ANVIL_URL) --private-key=$(ANVIL0_PKEY)
	@cp ./out/Counter.sol/Counter.json ./src/week04/counter-abi.json
	echo "Copy contract address to week04/contract-address.js"
week4-sol:
	@forge test --watch --mc CounterTest
week5:
	@vitest watch src/week5/*
week6:
	@vitest watch src/week6/*
week7:
	@vitest watch src/week7/*
week8:
	@vitest watch src/week8/*
