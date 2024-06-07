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
        // address _holder_account,
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
        require(_deadline > 0, "Set _target_money must be greater than 0");

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

    function addProjectDonor(
        uint256 _project_id
    ) public payable returns (bool pay_success, uint256 pay_money) {
        require(msg.value > 0, "Donation must be greater than 20");
        require(_project_id >= 0, "Project ID is not exist");
        require(
            _project_id < donateProject_arr.length,
            "Project ID is not exist"
        );

        uint256 input_money = msg.value;
        address payable _donor_account = payable(msg.sender);

        DonateProject storage project = donateProject_map[_project_id];

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

            return (true, input_money);
        } else if (project.state == State.CAN_DONATE) {
            project.get_money = target_money;

            if ((temp_money - target_money) > 0) {
                (bool success_donor, ) = _donor_account.call{
                    value: (temp_money - target_money)
                }("");
                emit return_money(success_donor);
            }

            project.donor_map[_donor_account].donate_money +=
                input_money -
                (temp_money - target_money);

            project.state = State.FINISH;
        }
    }

    function settleOverdueProject(
        uint256 _project_id
    ) public payable returns (bool clear_success, uint256 addtional_money) {
        require(_project_id >= 0, "Project ID is not exist");
        require(
            _project_id < donateProject_arr.length,
            "Project ID is not exist"
        );

        DonateProject storage project = donateProject_map[_project_id];
        address _donor_account = msg.sender;

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
            revert("error return , contract balance not enough to pay");
        }

        project.donor_map[_donor_account].is_return = true;

        if (_is_settled(_project_id)) {
            project.state = State.EXPIRED_SETTLED_FINIDH;
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

    function getSettleableProjectCountAddition()
        public
        view
        returns (
            bool have_settled_project,
            uint256 project_count,
            uint256 sum_return
        )
    {
        address _donor_account = msg.sender;
        uint256[] memory _filterDeadline_id_arr = _showProjectsAfterDeadline();
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

    function getProjectByID(
        uint256 _project_id
    )
        public
        view
        returns (
            string memory name,
            string memory description,
            address holder_account,
            State state,
            uint256 start_date,
            uint256 deadline,
            uint256 target_money,
            uint256 get_money,
            address[] memory donor_arr
        )
    {
        require(_project_id >= 0, "Project ID is not exist");
        require(
            _project_id < donateProject_arr.length,
            "Project ID is not exist"
        );

        DonateProject storage project = donateProject_map[_project_id];

        return (
            project.name,
            project.description,
            project.holder_account,
            project.state,
            project.start_date,
            project.deadline,
            project.target_money,
            project.get_money,
            project.donor_arr
        );
    }

    /////////show////////////

    function showSettledProjectByAccount()
        public
        view
        returns (
            uint256[] memory project_id_arr,
            string[] memory name_arr,
            uint256[] memory start_date_arr,
            uint256[] memory deadline_arr,
            uint256[] memory get_money,
            uint256[] memory donor_donate_money
        )
    {
        address _donor_account = msg.sender;
        ShowProjectinfo memory info;

        uint256[] memory _filterDeadline_id_arr = _showProjectsAfterDeadline();
        uint256 length = _filterDeadline_id_arr.length;
        uint256 k = 0;

        info._settled_project_id_arr = new uint256[](length);

        for (uint256 i = 0; i < length; i++) {
            if (_is_donor(_filterDeadline_id_arr[i], _donor_account)) {
                info._settled_project_id_arr[k] = _filterDeadline_id_arr[i];
                k += 1;
            }
        }

        info._project_id_arr = new uint256[](k);
        info._name_arr = new string[](k);
        info._start_date_arr = new uint256[](k);
        info._deadline_arr = new uint256[](k);
        info._get_money_arr = new uint256[](k);

        info._donor_donate_money = new uint256[](k);

        for (uint256 i = 0; i < k; i++) {
            uint256 _project_id = info._settled_project_id_arr[i];

            info._project_id_arr[i] = _project_id;
            info._name_arr[i] = donateProject_map[_project_id].name;
            info._start_date_arr[i] = donateProject_map[_project_id].start_date;
            info._deadline_arr[i] = donateProject_map[_project_id].deadline;
            info._donor_donate_money[i] = _get_donate_money(
                _project_id,
                _donor_account
            );
            info._get_money_arr[i] = donateProject_map[_project_id].get_money;
        }

        return (
            info._project_id_arr,
            info._name_arr,
            info._start_date_arr,
            info._deadline_arr,
            info._get_money_arr,
            info._donor_donate_money
        );
    }

    function showHoldersProject(
        address _account
    )
        public
        view
        returns (
            uint256[] memory filterDeadline_id_arr,
            string[] memory name_arr,
            State[] memory state,
            uint256[] memory start_date_arr,
            uint256[] memory deadline_arr,
            uint256[] memory target_money_arr,
            uint256[] memory get_money_arr
        )
    {
        require(
            _account != address(0),
            "Holder account cannot be zero address"
        );
        uint256[] memory arr = _showHoldersProject(_account);
        uint256 k = arr.length;

        ShowProjectinfo memory info;
        info._name_arr = new string[](k);
        info._start_date_arr = new uint256[](k);
        info._state_arr = new State[](k);
        info._deadline_arr = new uint256[](k);
        info._target_money_arr = new uint256[](k);
        info._get_money_arr = new uint256[](k);

        for (uint256 i = 0; i < k; i++) {
            uint256 _id = arr[i];
            info._name_arr[i] = donateProject_map[_id].name;
            info._start_date_arr[i] = donateProject_map[_id].start_date;
            info._state_arr[i] = donateProject_map[_id].state;
            info._deadline_arr[i] = donateProject_map[_id].deadline;
            info._target_money_arr[i] = donateProject_map[_id].target_money;
            info._get_money_arr[i] = donateProject_map[_id].get_money;
        }

        return (
            arr,
            info._name_arr,
            info._state_arr,
            info._start_date_arr,
            info._deadline_arr,
            info._target_money_arr,
            info._get_money_arr
        );
    }

    function showProjectsFilterDeadline()
        public
        view
        returns (
            uint256[] memory filterDeadline_id_arr,
            string[] memory name_arr,
            uint256[] memory start_date_arr,
            uint256[] memory deadline_arr,
            uint256[] memory target_money_arr,
            uint256[] memory get_money_arr
        )
    {
        uint256[]
            memory _filterDeadline_id_arr = _showProjectByIDFilterDeadline();
        uint256 k = _filterDeadline_id_arr.length;

        ShowProjectinfo memory info;

        info._name_arr = new string[](k);
        info._start_date_arr = new uint256[](k);
        info._deadline_arr = new uint256[](k);
        info._target_money_arr = new uint256[](k);
        info._get_money_arr = new uint256[](k);

        for (uint256 j = 0; j < k; j++) {
            info._name_arr[j] = donateProject_map[_filterDeadline_id_arr[j]]
                .name;
            info._start_date_arr[j] = donateProject_map[
                _filterDeadline_id_arr[j]
            ].start_date;
            info._deadline_arr[j] = donateProject_map[_filterDeadline_id_arr[j]]
                .deadline;
            info._target_money_arr[j] = donateProject_map[
                _filterDeadline_id_arr[j]
            ].target_money;
            info._get_money_arr[j] = donateProject_map[
                _filterDeadline_id_arr[j]
            ].get_money;
        }

        return (
            _filterDeadline_id_arr,
            info._name_arr,
            info._start_date_arr,
            info._deadline_arr,
            info._target_money_arr,
            info._get_money_arr
        );
    }

    function showAllProject()
        public
        view
        returns (
            uint256[] memory _project_arr,
            string[] memory name_arr,
            uint256[] memory start_date_arr,
            uint256[] memory deadline_arr,
            uint256[] memory target_money_arr,
            uint256[] memory get_money_arr
        )
    {
        uint256[] memory _arr = _showDonateProjectsID();
        uint256 k = _arr.length;

        ShowProjectinfo memory info;

        info._name_arr = new string[](k);
        info._start_date_arr = new uint256[](k);
        info._deadline_arr = new uint256[](k);
        info._target_money_arr = new uint256[](k);
        info._get_money_arr = new uint256[](k);

        for (uint256 j = 0; j < k; j++) {
            uint256 _project_id = _arr[j];
            info._name_arr[j] = donateProject_map[_project_id].name;
            info._start_date_arr[j] = donateProject_map[_project_id].start_date;
            info._deadline_arr[j] = donateProject_map[_project_id].deadline;
            info._target_money_arr[j] = donateProject_map[_project_id]
                .target_money;
            info._get_money_arr[j] = donateProject_map[_project_id].get_money;
        }

        return (
            _arr,
            info._name_arr,
            info._start_date_arr,
            info._deadline_arr,
            info._target_money_arr,
            info._get_money_arr
        );
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

    ///////////////////F
}
