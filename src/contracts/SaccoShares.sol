// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SaccoShares {
    mapping(address => uint256) public shares;
    uint256 public totalShares;

    uint256 public constant MINIMUM_SHARES = 2;
    uint256 public constant SHARE_PRICE = 0.001 ether; // 0.001 BTC per share

    event SharesPurchased(address indexed member, uint256 shares, uint256 amount);

    function _purchaseShares(address _member, uint256 _shares) internal {
        shares[_member] += _shares;
        totalShares += _shares;
        emit SharesPurchased(_member, _shares, _shares * SHARE_PRICE);
    }

    function transferShares(address to, uint256 amount) public {
        require(shares[msg.sender] >= amount, "Insufficient shares");
        shares[msg.sender] -= amount;
        shares[to] += amount;
    }

    function getShareBalance(address _member) public view returns (uint256) {
        return shares[_member];
    }

    function allShares() public view returns (uint256) {
        return totalShares;
    }
}