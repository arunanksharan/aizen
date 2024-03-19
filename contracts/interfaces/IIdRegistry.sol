// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.19;

interface IIdRegistry {
    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX Structs XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    struct RegisterData {
        uint256 id; // aizen id
        address custody; // custody address
        address recovery; // recovery address
    }

    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX Errors XXXXXXXXXXX

    /// @dev Revert when caller is not authorized to perform a specific action
    error Unauthorized();

    /// @dev Revert when the provided id is already registered
    error AlreadyRegistered();

    /// @dev Revert when the caller should have an id but does not
    error HasNoId();

    /// @dev Revert when Gateway is disabled/frozen
    error GatewayFrozen();

    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX Events XXXXXXXXXXX
    /**
     * @notice Emitted when a new id is registered
     *         - `id` is the aizen id
     *         - Nodes listen for this event to update their local id registry
     * 1. Two register events cannot emit with the same id
     * 2. Two register events cannot emit with the same custody unless a transfer of custody has happened from Alice to Bob
     * @param to address indexed to - the custody address that the id is registered to
     * @param id uint256 indexed id - the aizen id registered
     * @param recovery address recovery - the address that can initiate recovery request for aizen id
     */
    event Register(address indexed to, uint256 indexed id, address recovery);

    /**
     * @notice Emit an event when the custody of an id is transferred from one address to another
     * 1. Nodes listen for this event to update their local id registry - change owner of current id to new owner - from `from` to `to` in address to aizen_id mapping
     * 2. If Alice is registered to id_alice - most recent event triggered - Register(alice, id_alice, ...) | then Transfer (bob, alice, id_bob) - cannot be emitted
     * 3. Transfer (alice, ..., id_alice) cannot be emitted unless the recent event with id_alice is Transfer(..., alice, id_alice) or Register(alice, id_alice, ...) | Alice cannot transfer the id_alice to any other address unless Alice has custody of id_alice
     * @param from address indexed from - the custody address that the id is transferred from
     * @param to address indexed to - the custody address that the id is transferred to | now owns the aizen_id
     * @param id uint256 indexed id - the aizen id transferred
     */
    event Transfer(
        address indexed from,
        address indexed to,
        uint256 indexed id
    );

    /**
     * @notice Emit an event when aizen_id is recovered using recovery address
     * 1. Nodes listen for this event to update their local id registry - change owner of current id to new owner - from `from` to `to` in address to aizen_id mapping
     *
     * @param from address indexed from - the custody address that previously owned the aizen_id
     * @param to address indexed to - the custody address that now owns the aizen_id
     * @param id uint256 indexed id - the aizen id recovered
     */
    event Recover(address indexed from, address indexed to, uint256 indexed id);

    /**
     * @notice Emit an event when the recovery address is changed
     *
     * @param id uint256 indexed id - the aizen id for which the recovery address is changed
     * @param recovery address indexed recovery - the new recovery address
     */
    event ChangeRecoveryAddress(uint256 indexed id, address indexed recovery);

    /**
     * @notice Emit an event when new IdGateway address is set
     *
     * @param oldIdGateway address oldIdGateway - the old IdGateway address
     * @param newIdGateway address newIdGateway - the new IdGateway address
     */
    event ChangeIdGateway(address oldIdGateway, address newIdGateway);

    /**
     * @notice Emit an event when the IdGateway is frozen
     *
     * @param idGateway address idGateway - the IdGateway address
     */
    event FreezeIdGateway(address idGateway);

    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX CONSTANTS XXXXXXXXXXX
    /**
     * @notice Defined for compatibility with tools like etherscan - detect id transfer as token transfer
     */
    function name() external view returns (string memory);

    /**
     * @notice Version of the id registry
     */
    function VERSION() external view returns (string memory);

    /**
     * @notice EIP712 typehash for Transfer signatures
     */
    function TRANSFER_TYPEHASH() external view returns (bytes32);

    /**
     * @notice EIP712 typehash for TransferAndChangeRecovery signatures
     */
    function TRANSFER_AND_CHANGE_RECOVERY_TYPEHASH()
        external
        view
        returns (bytes32);

    /**
     * @notice EIP712 typehash for ChangeRecoveryAddress signatures
     */
    function CHANGE_RECOVERY_ADDRESS_TYPEHASH() external view returns (bytes32);

    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX STORAGE XXXXXXXXXXX

    /**
     * @notice Address of the IdGateway contract - address allowed to register aizen ids
     */
    function idGateway() external view returns (address);

    /**
     * @notice Check if idGateway is disabled/frozen
     */
    function isIdGatewayFrozen() external view returns (bool);

    /**
     * @notice Last aizen_id issued
     */
    function idCounter() external view returns (uint256);

    /**
     * @notice Mapping of address to aizen_id | returns 0 if address does not have an aizen_id
     */
    function idOf(address custody) external view returns (uint256 id);

    /**
     * @notice Mapping of aizen_id to custody address that owns the aizen_id
     */
    function custodyOf(uint256 id) external view returns (address custody);

    /**
     * @notice Mapping of aizen_id to recovery address
     */
    function recoveryOf(uint256 id) external view returns (address recovery);
}
