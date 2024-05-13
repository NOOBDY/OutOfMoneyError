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
    uint256[] project_arr;
    mapping(uint256 => Donate_project) project_map;

    uint256[] holder_arr;
    uint256[] user_arr;
    mapping(uint256 => User) user_map;
    //
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
    ) public onlyOwner {
        uint256 _id = project_arr.length;

        Donate_project storage p = project_map[_id];
        project_arr.push(_id);

        p.holder_id = _holder_id;
        p.name = _name;
        p.web = _web;
        p.state = 0;
        p.target_money = _target_money;
        p.get_money = 0;
        project_arr.push(_id);
    }

    function add_project_donor(
        uint256 _project_id,
        uint256 _user_id,
        uint256 _donate_money
    ) public onlyOwner {
        uint256 _donor_id = project_map[_project_id].donor_arr.length;
        project_map[_project_id].donor_map[_donor_id].user_id = _user_id;
        project_map[_project_id]
            .donor_map[_donor_id]
            .donate_money = _donate_money;
        project_map[_project_id].donor_arr.push(_user_id);
        project_map[_project_id].get_money += _donate_money;
    }

    function add_user(address _account) public onlyOwner {
        uint256 _id = user_arr.length;

        User storage u = user_map[_id];
        u.account = _account;
        user_map[_id];

        user_arr.push(_id);
    }

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
            project_map[_id].holder_id,
            project_map[_id].web,
            project_map[_id].state,
            project_map[_id].target_money,
            project_map[_id].get_money,
            project_map[_id].donor_arr
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
        // require(_account == address(_account), "Invalid address");

        for (uint256 i = 0; i < user_arr.length; i++) {
            if (user_map[user_arr[i]].account == _account) {
                return (true, i); //找到回傳true
            }
        }
        return (false, 0); //沒找到回傳false
    }

    function show_users_id() public view returns (uint256[] memory _user_arr) {
        return (user_arr);
    }
}
