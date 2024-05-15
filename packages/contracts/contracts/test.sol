// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract NoneMoney {
    struct User {
        address account;
        uint256 all_donate_money;
        uint256 all_get_money;
        uint256[] donate_project_arr;
        uint256[] have_project_arr;
    }

    struct Donor {
        uint256 user_id;
        uint256 donate_money;
    }

    struct Donate_project {
        string web;
        string name;
        uint256 state;
        uint256 target_money;
        uint256 get_money;
        uint256 holder_id;
        mapping(uint256 => Donor) donor_map; //donor data
        uint256[] donor_arr; //donor id
    }

    address owner;
    ///
    uint256[] donate_project_arr;
    mapping(uint256 => Donate_project) donate_project_map;
    ///
    uint256[] user_arr;
    mapping(uint256 => User) user_map;
    ///
    uint256[] holder_arr;
    ///
    modifier onlyOwner() {
        require(owner == msg.sender, "Only Owner"); //檢查是否為管理者
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function add_project(
        uint256 _holder_id,
        string memory _name,
        string memory _web,
        uint256 _target_money
    ) public  {
        uint256 _id = donate_project_arr.length;

        Donate_project storage p = donate_project_map[_id];

        p.holder_id = _holder_id;
        p.name = _name;
        p.web = _web;
        p.state = 0;
        p.target_money = _target_money;
        p.get_money = 0;

        donate_project_arr.push(_id);

        if (!_is_holder(_holder_id)) {
            holder_arr.push(_holder_id);
        }
    }

    function add_project_donor(
        uint256 _project_id,
        uint256 _user_id
    ) public payable {
        require(msg.value > 0, "Donation must be greater than 0");

        uint256 _donor_id = donate_project_map[_project_id].donor_arr.length;
        donate_project_map[_project_id].donor_map[_donor_id].user_id = _user_id;
        donate_project_map[_project_id]
            .donor_map[_donor_id]
            .donate_money = msg.value;
        donate_project_map[_project_id].donor_arr.push(_user_id);

        uint256 temp_money = donate_project_map[_project_id].get_money +
            msg.value;

        if (temp_money < donate_project_map[_project_id].target_money) {
            donate_project_map[_project_id].get_money = temp_money;
        } else {
            
            donate_project_map[_project_id].get_money = donate_project_map[
                _project_id
            ].target_money;

            uint256 _holder_id = donate_project_map[_project_id].holder_id;
            address payable holder_account = payable(user_map[_holder_id].account);
            holder_account.transfer(donate_project_map[_project_id].get_money);

            donate_project_map[_project_id].state = 1;
        }
    }

    function add_user(address  _account) public {
        uint256 _id = user_arr.length;

        User storage u = user_map[_id];
        u.account = _account;
        user_map[_id];

        user_arr.push(_id);
    }

    ///////search/////////

    function search_project_by_id(uint256 _id)
        public
        view
        returns (
            uint256 project_id,
            uint256 holder_id,
            string memory _web,
            uint256 state,
            uint256 target_money,
            uint256 get_money,
            uint256[] memory _donor_arr
        )
    {
        return (
            _id,
            donate_project_map[_id].holder_id,
            donate_project_map[_id].web,
            donate_project_map[_id].state,
            donate_project_map[_id].target_money,
            donate_project_map[_id].get_money,
            donate_project_map[_id].donor_arr
        );
    }

    function search_user_by_id(uint256 _id)
        public
        view
        returns (
            uint256 user_id,
            address _account,
            uint256 _donated_money,
            uint256 _get_money,
            uint256[] memory _donate_project_arr,
            uint256[] memory _have_project_arr
        )
    {
        return (
            _id,
            user_map[_id].account,
            user_map[_id].all_donate_money,
            user_map[_id].all_get_money,
            user_map[_id].donate_project_arr,
            user_map[_id].have_project_arr
        );
    }

    function search_userid_by_account(address _account)
        public
        view
        returns (bool find, uint256 _user_id)
    {
        for (uint256 i = 0; i < user_arr.length; i++) {
            if (user_map[user_arr[i]].account == _account) {
                return (true, i); //找到回傳true
            }
        }
        return (false, 0); //沒找到回傳false
    }

    ///////show all/////////

    function show_users_id() public view returns (uint256[] memory _user_arr) {
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
        returns (uint256[] memory _holder_arr)
    {
        return (holder_arr);
    }

    ///////private function////////

    function _is_holder(uint256 _id) private view returns (bool) {
        for (uint256 i = 0; i < holder_arr.length; i++) {
            if (holder_arr[i] == _id) {
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
