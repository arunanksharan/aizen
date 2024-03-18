// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.19;

import {INonces} from "../interfaces/INonces.sol";
import {Nonces as NoncesBase} from "@openzeppelin/contracts/utils/Nonces.sol";

abstract contract Nonces is INonces, NoncesBase {
    function useNonce() external returns (uint256) {
        return _useNonce(msg.sender);
    }
}
