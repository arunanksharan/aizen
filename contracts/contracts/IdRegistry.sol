// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.19;

import {SignatureChecker} from "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";

import {IIdRegistry} from "./interfaces/IIdRegistry.sol";
import {EIP712} from "./abstract/EIP712.sol";
import {Signatures} from "./abstract/Signatures.sol";
import {Nonces} from "./abstract/Nonces.sol";
import {Migration} from "./abstract/Migration.sol";

/**
 * @title Aizen Id Registry
 * @dev A contract for registering Aizen Ids against custody and recovery address
 *
 *
 *
 */

contract IdRegistry is IIdRegistry, Migration, Signatures, EIP712, Nonces {

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
     * @param _migrator - address of the migrator
     * 
     */
    
    constructor(address _migrator, address _initialOwner) Migration(24 hours, _migrator, _initialOwner) EIP712("Aizen IdRegistry", "1"){}

    // REGISTRATION LOGIC

    /**
     * @inheritdoc IIdRegistry
     * 
     * 1. Check if the contract is not paused - added as modifier - whenNotPaused
     * 2. Check if the idGateway is the caller/msg.sender
     * 3. Check if to address already has an aizen_id assigned to it
     * 4. Increment the idCounter before assignment to ensure no id is assigned 0 as well as no id is assigned twice
     */
    function register(address to, address recovery) external whenNotPaused returns (uint256 aid) {
        if (msg.sender != idGateway) revert Unauthorized();
        if (idOf[to] != 0) revert HasId();

        /** Safety Check - may be added ut idCounter is uint256 - will not overflow realistically */
        unchecked {
            aid = ++idCounter;
        }

        _unsafeRegister(aid, to, recovery);
    }

    /**
     * @dev Register the aid without any checks
     */
    function _unsafeRegister(uint256 id, address to, address recovery) internal {
        idOf[to] = id;
        custodyOf[id] = to;
        recoveryOf[id] = recovery;

        emit Register(to, id, recovery);
    }


    // TRANSFER LOGIC
    /**
     * @inheritdoc IIdRegistry
     * 
     */
    function transfer(address to, uint256 deadline, bytes calldata sig) external {

        _validateTransfer(msg.sender, to); 
        _verifyTransferSig({aid: fromId, to: to, deadline: deadline, signer: to, sig: sig});

        _unsafeTransfer(fromId, msg.sender, to);

    }

    /**
     * @inheritdoc IIdRegistry
     * 1. from address should have an id assigned to it
     * 2. from address should be the owner of this id - implicitly checked by the idOf[from] == fromId
     * 3. to address should not have any other id assigned to it
     */

    function _validateTransfer(address from, address to) internal view returns (uint256 fromId) {
        fromId = idOf[from];

        // This fromId should not be 0 => no id assigned to from address
        if (fromId == 0) revert HasNoId();

        // to address should not have any other id assigned to it
        if (idOf[to] != 0) revert HasId();
    }

    /**
     * @inheritdoc IIdRegistry
     * 1. Verify the signature
     * 2. Check if the deadline has not passed
     * 
     */
    function _verifyTransferSig(uint256 aid, address to, uint256 deadline, address signer, bytes memory sig) internal {
        _verifySig(
            _hashTypedDataV4(keccak256(abi.encode(TRANSFER_TYPEHASH, aid, to, _useNonce(signer), deadline))),
            signer,
            deadline,
            sig);
    }

    /**
     * @inheritdoc IIdRegistry
     * 1. Update the idOf and custodyOf mappings
     * 2. Emit the Transfer event
     */
    function _unsafeTransfer(uint256 id, address from, address to) internal whenNotPaused {
        idOf[to] = aid;
        custodyOf[id] = to;
        delete idOf[from];
        emit Transfer(from, to, id);
    }


// RECOVERY LOGIC

// MIGRATION LOGIC

}
