// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.19;

interface IIdRegistry {
    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX Structs XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    struct RegisterData {
        uint256 aid; // aizen id
        address custody; // custody address
        address recovery; // recovery address
    }

    struct RegisterDefaultRecoveryData {
        uint256 aid;
        address custody;
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

    // Admin Events
    /**
     * @notice Emit event when migration occurs - admin sets the idCounter
     *
     * @param oldCounter uint256 oldCounter - the old idCounter
     * @param newCounter uint256 newCounter - the new idCounter
     */
    event SetIdCounter(uint256 oldCounter, uint256 newCounter);

    /**
     * @notice Emit event when migration admin resets the aizen_id
     *
     * @param aid The reset aizen_id
     */
    event AdminReset(uint256 indexed aid);

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
    function idOf(address custody) external view returns (uint256 aid);

    /**
     * @notice Mapping of aizen_id to custody address that owns the aizen_id
     */
    function custodyOf(uint256 aid) external view returns (address custody);

    /**
     * @notice Mapping of aizen_id to recovery address
     */
    function recoveryOf(uint256 aid) external view returns (address recovery);

    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX FUNCTIONS XXXXXXXXXXX

    /**
     * @notice Register a new aizen_id for a given custody address & setup a recovery address
     * 1. Caller must be the IdGateway contract
     * 2. aid - counter incremented | extended later - external system can provide an id as well || fetch the id from contract and use it
     */
    function register(
        address to,
        address recovery
    ) external returns (uint256 aid);

    /**
     * @notice Set IdGateway address allowed to register aizen ids | Only callable by owner
     *
     * @param _idGateway address _idGateway - the new IdGateway address
     */
    function setIdGateway(address _idGateway) external;

    /**
     * @notice Freeze IdGateway | Only callable by owner
     */
    function freezeIdGateway() external;

    /** XXXXXXXXXXXXXXXXXXX TRANSFER LOGIC XXXXXXXXXXXXXXXXXXX */

    /**
     * @notice Transfer the custody of aizen_id from one address to another address
     * 1. The new address should not have an aizen_id assigned to it
     * 2. A signed Transfer message from the destination address must be provided
     *
     *
     */
    function transfer(
        address to,
        uint256 deadline,
        bytes calldata sig
    ) external;

    /**
     * @notice Transfer the custody of aizen_id from one address to another address and change the recovery address - safely receive aid from an untrusted address
     * 1. The new address should not have an aizen_id assigned to it
     * 2. A signed TransferAndChangeRecovery message from the destination address must be provided
     *
     * @param to address to - the new custody address
     * @param recovery address recovery - the new recovery address
     * @param deadline uint256 deadline - the Expiration timestamp for the signature
     * @param sig bytes sig - the signature of the message | EIP712 signature signed by the to (recipient/destiantion) address
     */
    function transferAndChangeRecovery(
        address to,
        address recovery,
        uint256 deadline,
        bytes calldata sig
    ) external;

    /**
     * @notice Transfer aizen id owned by from address to another address
     * 1. The new address must not have an aizen_id assigned to it
     * 2. Caller must provide two signatures - one signed by from/owner/custody address and one signed by to/recipient/destination address
     * @param from address from - the current custody address of aizen_id
     * @param to address to - the new custody address
     * @param fromDeadline uint256 fromDeadline - the Expiration timestamp for the from signature
     * @param toDeadline uint256 toDeadline - the Expiration timestamp for the to signature
     * @param fromSig bytes fromSig - the signature of the message | EIP712 signature signed by the from (owner/custody) address
     * @param toSig bytes toSig - the signature of the message | EIP712 signature signed by the to (recipient/destination) address
     */
    function transferFor(
        address from,
        address to,
        uint256 fromDeadline,
        bytes calldata fromSig,
        uint256 toDeadline,
        bytes calldata toSig
    ) external;

    /**
     * @notice Transfer the custody of aizen_id from one address to another address and change the recovery address - safely receive aid from an untrusted address
     * 1. The new address should not have an aizen_id assigned to it
     * 2. Caller must provide two signatures - one signed by from/owner/custody address and one signed by to/recipient/destination address
     *
     * @param from address from - the current custody address of aizen_id
     * @param to address to - the new custody address
     * @param fromDeadline uint256 fromDeadline - the Expiration timestamp for the from signature
     * @param toDeadline uint256 toDeadline - the Expiration timestamp for the to signature
     * @param fromSig bytes fromSig - the signature of the message | EIP712 signature signed by the from (owner/custody) address
     * @param toSig bytes toSig - the signature of the message | EIP712 signature signed by the to (recipient/destination) address
     */
    function transferAndChangeRecoveryFor(
        address from,
        address to,
        address recovery,
        uint256 fromDeadline,
        bytes calldata fromSig,
        uint256 toDeadline,
        bytes calldata toSig
    ) external;

    /** XXXXXXXXXXXXXXXXXXX RECOVERY LOGIC XXXXXXXXXXXXXXXXXXX */

    /**
     * @notice Change the recovery address of aizen_id owned by the caller
     *
     * @param recovery The address to set as the new recovery address | Set to 0x0 to disable recovery
     */
    function changeRecoveryAddress(address recovery) external;

    /**
     * @notice Change the recovery address of aizen_id owned by the caller
     * 1. Caller must provide a valid signature from the owner
     *
     * @param custody address custody - the current custody address of aizen_id
     * @param recovery address recovery - the new recovery address
     * @param deadline uint256 deadline - the Expiration timestamp for the signature
     * @param sig bytes sig - the signature of the message | EIP712 signature signed by the custody address
     */
    function changeRecoveryAddressFor(
        address custody,
        address recovery,
        uint256 deadline,
        bytes calldata sig
    ) external;

    /**
     * @notice Transfer the aizen_id from the from address to the to address
     * 1. Must be called by the recovery address
     * 2. The new address should not have an aizen_id assigned to it
     * A signed message from the to address must be provided
     *
     * @param from address from - the current custody address of aizen_id
     * @param to address to - the new custody address
     * @param toDeadline uint256 deadline - the Expiration timestamp for the signature
     * @param sig bytes sig - the signature of the message | EIP712 signature signed by the to (recipient/destination) address
     */

    function recover(
        address from,
        address to,
        uint256 toDeadline,
        bytes calldata sig
    ) external;

    /**
     * @notice Transfer the aizen_id from the from address to the to address
     * 1. Must be called by the recovery address
     * 2. Caller must provide a valid signature from the recovery as well as to address
     *
     * @param from address from - the current custody address of aizen_id
     * @param to address to - the new custody address
     * @param recoveryDeadline uint256 recoveryDeadline - the Expiration timestamp for the signature
     * @param toDeadline uint256 toDeadline - the Expiration timestamp for the signature
     * @param recoverySig bytes recoverySig - the signature of the message | EIP712 signature signed by the from (owner/custody) address
     * @param toSig bytes toSig - the signature of the message | EIP712 signature signed by the to (recipient/destination) address
     */

    function recoverFor(
        address from,
        address to,
        uint256 recoveryDeadline,
        bytes calldata recoverySig,
        uint256 toDeadline,
        bytes calldata toSig
    ) external;

    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX VIEWS FUNCTIONS XXXXXXXXXXX

    /**
     * @notice Verify a signature was produced by custody address owning the aizen_id
     *
     * @param custodyAddress The address to check the signature of
     * @param aid The aizen_id to check the signature for
     * @param digest The hash of the message to check the signature for | Digest signed by the custody address
     * @param sig The signature to check
     *
     * @return isValid True if the signature is valid, false otherwise
     */
    function verifyAizenIdSignature(
        address custodyAddress,
        uint256 aid,
        bytes32 digest,
        bytes calldata sig
    ) external view returns (bool isValid);
}
