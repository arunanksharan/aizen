// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.19;

import {SignatureChecker} from "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";

import {IIdRegistry} from "./interfaces/IIdRegistry.sol";
import {EIP712} from "./abstract/EIP712.sol";
import {Signatures} from "./abstract/Signatures.sol";
import {Nonces} from "./abstract/Nonces.sol";

/**
 * @title Aizen Id Registry
 * @dev A contract for registering Aizen Ids against custody and recovery address
 *
 *
 *
 */

contract IdRegistry is IIdRegistry, Signatures, EIP712, Nonces {

    // XXXXXXXXXXXXXXXXXXXXXXX CONSTANTS XXXXXXXXXXXXXXXXXXXXXXX

    /**
     * @inheritdoc IIdRegistry
     */
    string public constant name = "Aizen AID";

    /**
     * @inheritdoc IIdRegistry
     */
    string public constant VERSION = "2024.03.19"      // YYYY-MM-DD

    /**
     * @inheritdoc IIdRegistry
     */
    bytes32 public constant TRANSFER_TYPEHASH = keccak256("Transfer(uint256 aid,address to,uint256 nonce,uint256 deadline)");

    /**
     * @inheritdoc IIdRegistry
     */
    bytes32 public constant TRANSFER_AND_CHANGE_RECOVERY_TYPEHASH = keccak256("TransferAndChangeRecovery(uint256 aid,address to,address recovery,uint256 nonce,uint256 deadline)");

    /**
     * @inheritdoc IIdRegistry
     */
    bytes32 public constant CHANGE_RECOVERY_ADDRESS_TYPEHASH = keccak256("ChangeRecoveryAddress(uint256 aid,address from,address to,uint256 nonce,uint256 deadline)");


    // XXXXXXXXXXXXXXXXXXXXXXX STORAGE XXXXXXXXXXX
    /**
     * @inheritdoc IIdRegistry
     */
    address public idGateway;

    /**
     * @inheritdoc IIdRegistry
     */
    bool public gatewayFrozen;

    /**
     * @inheritdoc IIdRegistry
     */
    uint256 public idCounter;

    /**
     * @inheritdoc IIdRegistry
     */
    mapping(address custody => uint256 aid) public idOf;

    /**
     * @inheritdoc IIdRegistry
     */
    mapping(uint256 aid => address custody) public custodyOf;

    /**
     * @inheritdoc IIdRegistry
     */
    mapping(uint256 aid => address recovery) public recoveryOf;

// XXXXXXXXXXXXXXXXXXXXXXX CONSTRUCTOR XXXXXXXXXXX
    /** 
     * @notice Set owner of this contract to provided owner
     * @param _initialOwner - initial address of the owner
     * 
     */
    
    constructor(address _initialOwner) EIP712("Aizen IdRegistry", "1"){}

    // To set initial owner - Guardians

}
