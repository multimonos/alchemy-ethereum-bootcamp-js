// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {console} from "forge-std/console.sol";


contract ConfigFactory {

    struct Config {
        string id;
        string PrivateKeyVarname;
        string ProxyAdminAddressVarname;
        address ProxyContractAddress;
    }

    mapping(uint256 chainid => Config config) private _configs;

    constructor() {
        _configs[11155111] = Config({
            id: 'sepolia',
            PrivateKeyVarname: 'DEV1_PKEY',
            ProxyAdminAddressVarname: 'DEV1_ADDRESS',
            ProxyContractAddress: 0x20967CC44BD6458E63BA5A655ecc3f4dAea89F86

        });

        _configs[31337] = Config({
            id: 'anvil',
            PrivateKeyVarname: 'ANVIL1_PKEY',
            ProxyAdminAddressVarname: 'ANVIL1_ADDRESS',
            ProxyContractAddress: 0x712516e61C8B383dF4A63CFe83d7701Bce54B03e
        });
    }

    function get(uint chainId) public view returns (Config memory) {
        Config memory config = _configs[chainId];
        return config;
    }

    function log(Config memory config) public pure {
        console.log('Config : {');
        console.log('  id: %s', config.id);
        console.log('  PrivateKeyVarname: %s', config.PrivateKeyVarname);
        console.log('  ProxyAdminAddressVarname: %s', config.ProxyAdminAddressVarname);
        console.log('}');
    }
}
