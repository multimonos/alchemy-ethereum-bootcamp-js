
.PHONY: week1 week2 week3 week4 week4-deploy week4-sol week5 week5b week6 week7 week8


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
	@forge script ./src/week4/Counter.s.sol --json --broadcast --rpc-url=$(ANVIL_URL) --private-key=$(ANVIL0_PKEY)
	@cp ./out/Counter.sol/Counter.json ./src/week4/counter-abi.json
	echo "Copy contract address to week04/contract-address.js"
week4-sol:
	@forge test --watch --mc CounterTest
week5:
	@forge test --mc "Game*" --watch -vv
week5b-up:
	@anvil
week5b-deploy:
	@forge clean
	@forge script ./src/week5b/DeployEventGames.s.sol -vv --broadcast --rpc-url=$(ANVIL_URL) --private-key=$(ANVIL0_PKEY)
	@for i in {1..5}; do cp "./out/EventsGame$$i.sol/EventsGame$$i.json" ./src/week5b; done;
	@tree ./src/week5b
	@cat ./src/week5b/manifest.json
week5b:
	# no parallel required or ethers' nonces freak out.
	@vitest watch src/week5b/* --no-file-parallelism
week5-escrow:
	@forge test --mc "Escrow*" --watch -vv
week5-escrow-deploy:
	@forge build ./src/week5-escrow/Escrow.sol
	@cp ./out/Escrow.sol/Escrow.json ./src/week5-escrow/Escrow.json
	@tree ./src/week5-escrow
	@vitest watch src/week5-escrow/*
week6:
	@forge test --mc "(Party|DeadMansSwitch|Multisig|Collectible|Token|Bucket)Test" --watch -vvv
week6-js:
	@vitest watch src/week6/*
week7-up:
	@anvil
week7-deploy:
	@forge clean
	@forge script ./src/week7/DeployStorage.s.sol --json --broadcast --rpc-url=$(ANVIL_URL) --private-key=$(ANVIL0_PKEY)
	@cp ./out/Storage.sol/Storage.json ./src/week7/storage_abi.json
	[ -f "src/week7/contract_address.js" ] && "found contract_address.js" || echo 'export const contractAddress = "";' > src/week7/contract_address.js
	echo "Copy contract address to week04/contract-address.js"
week7-js:
	@vitest watch src/week7/*
week7-sol:
	@forge test --mc "(Storage)Test" --watch -vvv

# week 7 / delegation
w7-proxy:
	@forge test --mc "(Proxy)Test" --watch -vvvvv
w7-libs:
	@forge test --mc "(Libraries)Test" --watch -vvv

# week 7 / upgradeable contracts
w7-upgradeble-setup:
	@forge clean
	@forge install foundry-rs/forge-std
	@forge install OpenZeppelin/openzeppelin-foundry-upgrades
	@forge install OpenZeppelin/openzeppelin-contracts-upgradeable
	@forge remappings > remappings.txt