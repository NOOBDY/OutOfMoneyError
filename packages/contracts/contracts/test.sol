// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract NoneMoney {
    /// id == address (address 相同者不可重複註冊，address 是唯一的)
    struct User {
        uint256 all_donate_money;
        uint256 all_get_money;
        uint256[] donate_project_arr;
        uint256[] have_project_arr;
    }

    struct Donor {
        uint256 donate_money;
    }

    struct Donate_project {
        string web;
        string name;
        uint256 state;
        uint256 target_money;
        uint256 get_money;
        address holder_account;
        mapping(address => Donor) donor_map; //donor data
        address[] donor_arr; //donor id
    }

    address owner;
    ///project 不可以holder address為id，因為user <-> project 一對多
    uint256[] donate_project_arr;
    mapping(uint256 => Donate_project) donate_project_map;
    ///
    address[] user_arr;
    mapping(address => User) user_map;
    ///
    address[] holder_arr;
    ///
    modifier onlyOwner() {
        require(owner == msg.sender, "Only Owner"); //檢查是否為管理者
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function add_project(
        address _holder_account,
        string memory _name,
        string memory _web,
        uint256 _target_money
    ) public  {
        
        uint256 _id = donate_project_arr.length;

        Donate_project storage p = donate_project_map[_id];

        p.holder_account = _holder_account;
        p.name = _name;
        p.web = _web;
        p.state = 0;
        p.target_money = _target_money;
        p.get_money = 0;

        donate_project_arr.push(_id);

        if (!_is_holder(_holder_account)) {
            holder_arr.push(_holder_account);
        }
    }

    function add_project_donor(
        uint256 _project_id,
        address _donor_address
    ) public payable {
        require(msg.value > 0, "Donation must be greater than 0");

        donate_project_map[_project_id]
            .donor_map[_donor_address]
            .donate_money = msg.value;

        donate_project_map[_project_id].donor_arr.push(_donor_address);

        uint256 temp_money = donate_project_map[_project_id].get_money +
            msg.value;

        if (temp_money < donate_project_map[_project_id].target_money) {
            donate_project_map[_project_id].get_money = temp_money;
        } else {
            
            donate_project_map[_project_id].get_money = donate_project_map[
                _project_id
            ].target_money;

            address payable holder_account = payable(donate_project_map[_project_id].holder_account);
            holder_account.transfer(donate_project_map[_project_id].get_money);

            donate_project_map[_project_id].state = 1;
        }
    }

    function add_user(address  _account) public {

        user_map[_account].all_donate_money= 0;
        user_map[_account].all_get_money = 0;

        user_arr.push(_account);
    }

    ///////search/////////

    function search_project_by_id(uint256 _id)
        public
        view
        returns (
            uint256 project_id,
            address holder_account,
            string memory _web,
            uint256 state,
            uint256 target_money,
            uint256 get_money,
            address[] memory _donor_arr
        )
    {
        return (
            _id,
            donate_project_map[_id].holder_account,
            donate_project_map[_id].web,
            donate_project_map[_id].state,
            donate_project_map[_id].target_money,
            donate_project_map[_id].get_money,
            donate_project_map[_id].donor_arr
        );
    }

    function search_user(address _user_address)
        public
        view
        returns (
            address user_address,
            uint256 _donated_money,
            uint256 _get_money,
            uint256[] memory _donate_project_arr,
            uint256[] memory _have_project_arr
        )
    {
        return (
            _user_address,
            user_map[_user_address].all_donate_money,
            user_map[_user_address].all_get_money,
            user_map[_user_address].donate_project_arr,
            user_map[_user_address].have_project_arr
        );
    }

    ///////show all/////////

    function show_users_id() public view returns (address[] memory _user_arr) {
        return (user_arr);
    }

    function show_donate_projects_id()
        public
        view
        returns (uint256[] memory _donate_projects_arr)
    {
        return (donate_project_arr);
    }

    function show_holders_id()
        public
        view
        returns (address[] memory _holder_arr)
    {
        return (holder_arr);
    }

    ///////private function////////

    function _is_holder(address _address) private view returns (bool) {
        for (uint256 i = 0; i < holder_arr.length; i++) {
            if (holder_arr[i] == _address) {
                return (true); //找到回傳true
            }
        }
        return (false);
    }

    /////////////////////////

    function get_contract_balance() public view returns( uint256){
        return address(this).balance; //合約金額
    }

    /////////////
    function transferToOwner() external  {

        address payable trs = payable(owner);
        trs.transfer(address(this).balance);
    }
    //////////
}
