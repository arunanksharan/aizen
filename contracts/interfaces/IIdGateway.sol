// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.19;

import {IIdRegistry} from "./IIdRegistry.sol";
import {IStorageRegistry} from "./IStorageRegistry.sol";

interface IdGateway {
    // ERRORS
    /**
     * @notice Revert if caller is not authorised
     */
    error Unauthorized();

    // EVENTS
    /**
     * @notice Emitted when the storage registry is updated
     *
     * @param oldStorageRegistry The old storage registry
     * @param newStorageRegistry The new storage registry
     */
    event SetStorageRegistry(
        address oldStorageRegistry,
        address newStorageRegistry
    );

    // CONSTANTS
    /**
     * @notice Version of contract specified in protocol version scheme
     */

    /**
     * @notice EIP712 Typehash for Register Signatures
     */
    function REGISTER_TYPEHASH() external view returns (bytes32);

    // STORAGE
    /**
     * @notice IdRegistry contract
     */
    function idRegistry() external view returns (IIdRegistry);

    function storageRegistry() external view returns (IStorageRegistry);

    // PRICE RELATED FUNCTIONS
    /**
     * @notice Get total price to register - equal to 1 storage unit
     *
     * @return Total price in wei
     */
    function price() external view returns (uint256);

    /**
     * @notice Calculate total price to register including additional storage units
     *
     * @param extraStorage Number of additional storage units
     *
     * @return Total price in wei
     */
    function price(uint256 extraStorage) external view returns (uint256);

    // REGISTRATION LOGIC
    /**
     * @notice Register a new Aizen ID (aid) to the caller | Caller should not already have an aid
     * @param recovery Address to recover aid in case of loss | set to 0x0 if not needed
     *
     * @return aid Address of the new aid registered aid against the caller address
     */
    function register(
        address recovery
    ) external payable returns (uint256 aid, uint256 overpayment);

    /**
     * @notice Register a new Aizen ID (aid) to the caller with additional storage | Caller should not already have an aid
     * @param recovery Address to recover aid in case of loss | set to 0x0 if not needed
     * @param extraStorage Number of additional storage units
     *
     * @return aid Address of the new aid registered aid against the caller address
     */
    function register(
        address recovery,
        uint256 extraStorage
    ) external payable returns (uint256 aid, uint256 overpayment);

    /**
     * @notice Register a new Aizen ID (aid) to any address (3rd party registration) | Address being registered should not already have an aid
     * 1. A signed message from the address to be registered is required
     * 2. This should approve to and recovery address
     *
     * @param to Address to register aid against
     * @param recovery Address to recover aid in case of loss | set to 0x0 if not needed
     * @param deadline Timestamp after which the signature is invalid
     * @param sig EIP712 Register Signature signed bby to address
     *
     * @return aid Address of the new aid registered aid against the to address
     */
    function registerFor(
        address to,
        address recovery,
        uint256 deadline,
        bytes calldata sig
    ) external payable returns (uint256 aid, uint256 overpayment);

    /**
     * @notice Register a new Aizen ID (aid) to any address (3rd party registration) with additioanl storage | Address being registered should not already have an aid
     * 1. A signed message from the address to be registered is required
     * 2. This should approve to and recovery address
     *
     * @param to Address to register aid against
     * @param recovery Address to recover aid in case of loss | set to 0x0 if not needed
     * @param deadline Timestamp after which the signature is invalid
     * @param sig EIP712 Register Signature signed bby to address
     * @param extraStorage Number of additional storage units
     *
     * @return aid Address of the new aid registered aid against the to address
     */
    function registerFor(
        address to,
        address recovery,
        uint256 deadline,
        bytes calldata sig,
        uint256 extraStorage
    ) external payable returns (uint256 aid, uint256 overpayment);

    // ADMIN FUNCTIONS
    /**
     * @notice Set the storage registry
     *
     * @param _storageRegistry Address of the new storage registry
     */

    function setStorageRegistry(address _storageRegistry) external;
}
