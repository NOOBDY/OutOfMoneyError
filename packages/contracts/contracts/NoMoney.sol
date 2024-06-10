// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./Info.sol";

contract NoneMoney is INoneMoney, FunctionInfo {
    modifier onlyOwner() {
        require(owner == msg.sender, "Only Owner"); //檢查是否為管理者
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addProject(
        string memory _name,
        string memory _description,
        uint256 _start_date,
        uint256 _deadline,
        uint256 _target_money
    ) public {
        address _holder_account = msg.sender;

        require(bytes(_name).length > 0, "Project name is required");
        require(
            _target_money >= 1000000000000000,
            "Set _target_money must be greater than 1000000000000000"
        );

        require(_deadline > 0, "Set _deadline must be greater than 0");
        require(
            _start_date <= _deadline,
            "_start_date should less then _deadline"
        );

        uint256 _id = donateProject_arr.length;

        DonateProject storage p = donateProject_map[_id];

        p.holder_account = _holder_account;
        p.name = _name;
        p.description = _description;
        p.state = State.CAN_DONATE;
        p.start_date = _start_date;
        p.deadline = _deadline;
        p.get_money = 0;
        p.target_money = _target_money;
        p.get_money = 0;

        donateProject_arr.push(_id);

        if (!_is_holder(_holder_account)) {
            holder_arr.push(_holder_account);
        }
    }

    function donate(uint256 _project_id) public payable {
        require(msg.value > 0, "Donation must be greater than 0");
        require(_project_id >= 0, "Project ID is not exist");
        require(
            _project_id < donateProject_arr.length,
            "Project ID is not exist"
        );

        uint256 input_money = msg.value;
        address payable _donor_account = payable(msg.sender);

        DonateProject storage project = donateProject_map[_project_id];

        require(project.state == State.CAN_DONATE, "this can't donate");

        uint256 temp_money = project.get_money + input_money;
        uint256 target_money = project.target_money;

        if (project.donor_map[_donor_account].donate_money == 0) {
            project.donor_arr.push(_donor_account);
        }

        if (
            (temp_money < target_money) && (project.state == State.CAN_DONATE)
        ) {
            project.donor_map[_donor_account].donate_money += input_money;
            project.get_money = temp_money;
        } else if (project.state == State.CAN_DONATE) {
            project.get_money = target_money;

            if ((temp_money - target_money) > 0) {
                (bool success_donor, ) = _donor_account.call{
                    value: (temp_money - target_money)
                }("");
                emit return_money(success_donor);

                if (!success_donor) {
                    revert("return money error");
                }
            }

            project.donor_map[_donor_account].donate_money +=
                input_money -
                (temp_money - target_money);

            project.state = State.FINISH;
        }
    }

    function settleOverdueProject(
        uint256 _project_id,
        uint256 _now_time
    ) public payable returns (bool clear_success, uint256 addtional_money) {
        require(_project_id >= 0, "Project ID is not exist");
        require(
            _project_id < donateProject_arr.length,
            "Project ID is not exist"
        );

        DonateProject storage project = donateProject_map[_project_id];
        address _donor_account = msg.sender;

        require(project.deadline < _now_time, "Project not Overdue");

        require(
            _is_donor(_project_id, _donor_account),
            "is not this project donor"
        );
        require(
            !project.donor_map[_donor_account].is_return,
            "this donor can't settle this project"
        );
        require(project.state == State.CAN_DONATE, "this project can't settle");

        uint256 all_return = _get_donate_money(_project_id, _donor_account);

        address payable clear_donor = payable(_donor_account);
        (bool success_return, ) = clear_donor.call{value: (all_return)}("");

        emit return_money(success_return);
        if (!success_return) {
            revert("error return");
        }

        project.donor_map[_donor_account].is_return = true;

        if (_is_settled(_project_id)) {
            project.state = State.EXPIRED_SETTLED_FINISH;
        }

        return (true, all_return);
    }

    function settleFinishProject(
        uint256 _project_id
    ) public payable returns (bool clear_success, uint256 get_money) {
        require(_project_id >= 0, "Project ID is not exist");
        require(
            _project_id < donateProject_arr.length,
            "Project ID is not exist"
        );

        DonateProject storage project = donateProject_map[_project_id];

        require(
            _is_holder(_project_id, msg.sender),
            "is not this project donor"
        );
        require(project.state == State.FINISH, "this project can't settle");

        address payable _holder_account = payable(msg.sender);

        (bool success_return, ) = _holder_account.call{
            value: ((project.get_money / 100) * 95)
        }("");

        emit return_money(success_return);
        if (!success_return) {
            revert("error return , contract balance not enough to pay");
        }

        return (true, 0);
    }

    //////////////get///////////////

    function getSettleableProjectCountAddition(
        uint256 _now_time
    )
        public
        view
        returns (
            bool have_settled_project,
            uint256 project_count,
            uint256 sum_return
        )
    {
        address _donor_account = msg.sender;
        uint256[] memory _filterDeadline_id_arr = _showProjectsAfterDeadline(
            _now_time
        );
        uint256 k = _filterDeadline_id_arr.length;

        uint256 _project_count = 0;
        uint256 _sum_return = 0;
        bool _have_settled_project = false;

        for (uint256 i = 0; i < k; i++) {
            uint256 _project_id = _filterDeadline_id_arr[i];
            bool flag = _is_donor(_filterDeadline_id_arr[i], _donor_account);

            if (flag) {
                _sum_return += _get_donate_money(_project_id, _donor_account);
                _project_count += 1;
                _have_settled_project = true;
            }
        }

        return (_have_settled_project, _project_count, _sum_return);
    }

    ////////////////////
    function getProjectByID(
        uint256 _project_id
    ) public view returns (ReturnProject memory return_project) {
        require(_project_id >= 0, "Project ID is not exist");
        require(
            _project_id < donateProject_arr.length,
            "Project ID is not exist"
        );
        uint256[] memory _arr = new uint256[](1);
        _arr[0] = _project_id;
        ReturnProject[] memory return_p = _copy_data(_arr);

        return (return_p[0]);
    }

    /////////show////////////

    function showSettledProjectByAccount(
        uint256 _now_time
    ) public view returns (ReturnProject[] memory return_project) {
        address _donor_account = msg.sender;

        uint256[] memory _filterDeadline_id_arr = _showProjectsAfterDeadline(
            _now_time
        );
        uint256 length = _filterDeadline_id_arr.length;
        uint256 k = 0;

        uint256[] memory _settled_project_id_arr = new uint256[](length);

        for (uint256 i = 0; i < length; i++) {
            if (_is_donor(_filterDeadline_id_arr[i], _donor_account)) {
                _settled_project_id_arr[k] = _filterDeadline_id_arr[i];
                k += 1;
            }
        }

        uint256[] memory _have_project_arr = new uint256[](k);

        for (uint256 i = 0; i < k; i++) {
            _have_project_arr[i] = _settled_project_id_arr[i];
        }

        ReturnProject[] memory return_p = _copy_data(_have_project_arr);

        return (return_p);
    }

    function showProjectByHolders(
        address _account
    ) public view returns (ReturnProject[] memory return_project) {
        require(
            _account != address(0),
            "Holder account cannot be zero address"
        );
        uint256[] memory _arr = _showProjectByHolders(_account);

        ReturnProject[] memory return_p = _copy_data(_arr);

        return (return_p);
    }

    function showAvailableProject(
        uint256 _now_time
    ) public view returns (ReturnProject[] memory return_project) {
        uint256[] memory _filterDeadline_id_arr = _showAvailableProject(
            _now_time
        );
        ReturnProject[] memory return_p = _copy_data(_filterDeadline_id_arr);
        return (return_p);
    }

    function showAllProject()
        public
        view
        returns (ReturnProject[] memory return_project)
    {
        uint256[] memory _arr = _showDonateProjectsID();

        ReturnProject[] memory return_p = _copy_data(_arr);

        return (return_p);
    }

    function sortProjectDonorByDonateMoney(
        uint256 _project_id
    )
        public
        view
        returns (
            address[] memory sorted_donor_arr,
            uint256[] memory sorted_donate_money_arr
        )
    {
        require(
            _project_id < donateProject_arr.length,
            "Project does not exist"
        );

        require(donateProject_arr.length > 0, "Project does not have donor");

        DonateProject storage project = donateProject_map[_project_id];
        uint256 donor_count = project.donor_arr.length;

        // 用來存儲捐款者地址和捐款金額的陣列
        address[] memory donor_arr = new address[](donor_count);
        uint256[] memory donate_money_arr = new uint256[](donor_count);

        // 填充陣列
        for (uint256 i = 0; i < donor_count; i++) {
            address donor = project.donor_arr[i];
            donor_arr[i] = donor;
            donate_money_arr[i] = project.donor_map[donor].donate_money;
        }

        // 排序捐款金額及其對應的捐款者地址
        for (uint256 i = 0; i < donor_count - 1; i++) {
            for (uint256 j = 0; j < donor_count - 1 - i; j++) {
                if (donate_money_arr[j] < donate_money_arr[j + 1]) {
                    // 交換金額
                    uint256 temp_money = donate_money_arr[j];
                    donate_money_arr[j] = donate_money_arr[j + 1];
                    donate_money_arr[j + 1] = temp_money;

                    // 交換地址
                    address temp_donor = donor_arr[j];
                    donor_arr[j] = donor_arr[j + 1];
                    donor_arr[j + 1] = temp_donor;
                }
            }
        }

        return (donor_arr, donate_money_arr);
    }

    //////////////////

    function getContractBalance() external view returns (uint256) {
        return address(this).balance; //合約金額
    }

    function getCurrentTimestamp() public view returns (uint256) {
        return block.timestamp; //合約時間
    }

    ///////////////////

    function _copy_data(
        uint256[] memory _project_id_arr
    ) private view returns (ReturnProject[] memory return_project) {
        uint256 k = _project_id_arr.length;

        ReturnProject[] memory return_p = new ReturnProject[](k);

        for (uint256 i = 0; i < k; i++) {
            uint256 _id = _project_id_arr[i];
            return_p[i].id = _id;
            return_p[i].name = donateProject_map[_id].name;
            return_p[i].description = donateProject_map[_id].description;
            return_p[i].state = donateProject_map[_id].state;
            return_p[i].start_date = donateProject_map[_id].start_date;
            return_p[i].deadline = donateProject_map[_id].deadline;
            return_p[i].target_money = donateProject_map[_id].target_money;
            return_p[i].get_money = donateProject_map[_id].get_money;
            return_p[i].holder_account = donateProject_map[_id].holder_account;
            return_p[i].donor_arr = donateProject_map[_id].donor_arr;
        }

        return (return_p);
    }
}
