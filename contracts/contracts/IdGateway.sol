// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.19;

import {IIdRegistry} from "../interfaces/IIdRegistry.sol";
import {IStorageRegistry} from "../interfaces/IStorageRegistry.sol";
import {IIdGateway} from "../interfaces/IIdGateway.sol";
import {Guardians} from "../abstract/Guardians.sol";
import {TransferHelper} from "../libraries/TransferHelper.sol";
import {EIP712} from "../abstract/EIP712.sol";
import {Nonces} from "../abstract/Nonces.sol";
import {Signatures} from "../abstract/Signatures.sol";

/**
 * @title IdGateway for Aizen
 */
contract IdGateway is IIdGateway, Guardians, Signatures, EIP712, Nonces {
    using TransferHelper for address;

    // CONSTANTS

    /**
     * @inheritdoc IIdGateway
     */
    string public constant VERSION = "2024.03.20"; // YYYY.MM.DD

    /**
     * @inheritdoc IIdGateway
     */
    // ToDo: REGISTER_TYPEHASH slighlty different from register function signature - WHY?
    // REGISTER_TYPEHASH - on the entire data packet relevant to register - is not directly linked to register function signature
    bytes32 public constant REGISTER_TYPEHASH =
        keccak256(
            "Register(address to,address recovery,uint256 nonce,uint256 deadline)"
        );

    // IMMUTABLES

    /**
     * @inheritdoc IIdGateway
     */
    IIdRegistry public immutable idRegistry;

    // STORAGE
    /**
     * @inheritdoc IIdGateway
     */
    IStorageRegistry public storageRegistry;

    // CONSTRUCTOR

    /**
     * @notice Configure IdRegistry and StorageRegistry addresses
     * 1. Set owner of contract to provided _owner
     *
     * @param _idRegistry Address of IdRegistry
     * @param _storageRegistry Address of StorageRegistry
     * @param _initialOwner Address of initial owner
     */

    constructor(
        address _idRegistry,
        address _storageRegistry,
        address _initialOwner
    ) Guardians(_initialOwner) EIP712("Aizen IdGateway", "1") {
        idRegistry = IIdRegistry(_idRegistry);
        storageRegistry = IStorageRegistry(_storageRegistry);
        emit SetStorageRegistry(address(0), _storageRegistry);
    }

    // PRICE VIEW
    /**
     * @inheritdoc IIdGateway
     */

    function price() external view returns (uint256) {
        return storageRegistry.unitPrice();
    }

    /**
     * @inheritdoc IIdGateway
     */
    function price(uint256 extraStorage) external view returns (uint256) {
        return storageRegistry.price(1 + extraStorage);
    }

    // REGISTRATION LOGIC
    /**
     * @inheritdoc IIdGateway
     */
    function register(
        address recovery
    ) external payable returns (uint256, uint256) {
        return register(recovery, 0);
    }

    /**
     * @inheritdoc IIdGateway
     */
    function register(
        address recovery,
        uint256 extraStorage
    ) public payable whenNotPaused returns (uint256 aid, uint256 overpayment) {
        aid = idRegistry.register(msg.sender, recovery);
        overpayment = _rentStorage(aid, extraStorage, msg.value, msg.sender);
    }

    /**
     * @inheritdoc IIdGateway
     */
    function registerFor(
        address to,
        address recovery,
        uint256 deadline,
        bytes calldata sig
    ) external payable returns (uint256, uint256) {
        return registerFor(to, recovery, deadline, sig, 0);
    }

    /**
     * @inheritdoc IIdGateway
     */
    function registerFor(
        address to,
        address recovery,
        uint256 deadline,
        bytes calldata sig,
        uint256 extraStorage
    ) public payable whenNotPaused returns (uint256 aid, uint256 overpayment) {
        /* Revert if signature is invalid */
        _verifyRegisterSig({
            to: to,
            recovery: recovery,
            deadline: deadline,
            sig: sig
        });
        aid = idRegistry.register(to, recovery);
        overpayment = _rentStorage(aid, extraStorage, msg.value, msg.sender);
    }

    // ADMIN FUNCTIONS
    /**
     * @inheritdoc IIdGateway
     */
    function setStorageRegistry(address _storageRegistry) external onlyOwner {
        emit SetStorageRegistry(address(0), _storageRegistry);
        storageRegistry = IStorageRegistry(_storageRegistry);
    }

    // SIGNATURE VERIFICATION HELPER
    /**
     * @notice Verify the signature of the registerFor function
     * 1. Revert if signature is invalid
     *
     * @param to Address to register aid against
     * @param recovery Address to recover aid in case of loss | set to 0x0 if not needed
     * @param deadline Timestamp after which the signature is invalid
     * @param sig EIP712 Register Signature signed by to address
     */
    function _verifyRegisterSig(
        address to,
        address recovery,
        uint256 deadline,
        bytes calldata sig
    ) internal {
        _verifySig(
            _hashTypedDataV4(
                keccak256(
                    abi.encode(
                        REGISTER_TYPEHASH,
                        to,
                        recovery,
                        _useNonce[to],
                        deadline
                    )
                )
            ),
            to,
            deadline,
            sig
        );
    }

    // STORAGE RENTAL HELPER
    /**
     * @notice Rent storage for the aid
     * 1. Rent storage for the aid
     * 2. Return overpayment
     *
     * @param aid Address of the new aid registered aid against the caller address
     * @param extraUnits Number of additional storage units
     * @param payment Amount of ether sent
     * @param payer Address of the payer
     *
     * @return overpayment Amount of ether overpaid
     */
    function _rentStorage(
        uint256 aid,
        uint256 extraUnits,
        uint256 payment,
        address payer
    ) internal returns (uint256 overpayment) {
        overpayment = storageRegistry.rent{value: payment}(aid, 1 + extraUnits);

        if (overpayment > 0) {
            payer.sendNative(overpayment);
        }
    }

    // RECEIVE function
    receive() external payable {
        if (msg.sender != address(storageRegistry)) revert Unauthorized();
    }
}
