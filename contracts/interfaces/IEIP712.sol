// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.19;

interface IEIP712 {
    // EIP 712 Helper functions
    /** Domain Spearator - helper view to read EIP712 domain separator */
    function domainSeparatorV4() external view returns (bytes32);

    /** Hash EIP712 typedData onchain
     * @param structHash - typed data hash
     * @return bytes32 - hash of the typed data | message digest
     */
    function hashTypedDataV4(
        bytes32 structHash
    ) external view returns (bytes32);
}
