// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {EventsGame1} from "./EventsGame1.sol";
import {EventsGame2} from "./EventsGame2.sol";
import {EventsGame3} from "./EventsGame3.sol";
import {EventsGame4} from "./EventsGame4.sol";
import {EventsGame5} from "./EventsGame5.sol";

contract DeployEventGames is Script {

    struct Target {
        string id;
        string abi;
        address addr;
    }

    function run() external {

        Target[] memory targets = new Target[](5);


        // --- deploy ---
        vm.startBroadcast();
        EventsGame1 game1 = new EventsGame1();
        targets[0] = Target({id: "game1", abi: './EventsGame1.json', addr: address(game1)});

        EventsGame2 game2 = new EventsGame2();
        targets[1] = Target({id: "game2", abi: './EventsGame2.json', addr: address(game2)});

        EventsGame3 game3 = new EventsGame3();
        targets[2] = Target({id: "game3", abi: './EventsGame3.json', addr: address(game3)});

        EventsGame4 game4 = new EventsGame4();
        targets[3] = Target({id: "game4", abi: './EventsGame4.json', addr: address(game4)});

        EventsGame5 game5 = new EventsGame5();
        targets[4] = Target({id: "game5", abi: './EventsGame5.json', addr: address(game5)});
        vm.stopBroadcast();

        // --- manifest ---
        string memory json = createManifestJson(targets);
        string memory js = createManifestJs(json);
        string memory jspath = string.concat(vm.projectRoot(), '/src/week5b/manifest.js');
        vm.writeFile(jspath, js);
    }

    function createManifestJson(Target[] memory targets) private returns (string memory) {
        string memory s = '[';

        for (uint i = 0; i < targets.length; i++) {

            string memory k = vm.toString(i);

            vm.serializeAddress(k, "address", targets[i].addr);
            vm.serializeString(k, "abi", targets[i].abi);

            s = string.concat(s,
                vm.serializeString(k, "id", targets[i].id)
            );

            if (i < targets.length - 1) {
                s = string.concat(s, ',');
            }
        }

        s = string .concat(s, ']');

        return s;
    }

    function createManifestJs(string memory json) private pure returns (string memory) {
        string memory s = string.concat('export const manifest = ', json);
        return s;
    }

}