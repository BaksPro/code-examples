import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import computersSelector from '../../../../selectors/computer-list';
import MoveToGroupForm from './MoveToGroupForm';
import Table from './Table';
import BulkActions from './BulkActions';
import {
    computerChosen,
    ComputerLoaded,
    joinComputerListRoom,
    leaveComputerListRoom,
    loadActionData,
    moveToGroup,
    stopAction,
} from '../../../../actions/computers';
import {
    cleanAndScanIssueSettings,
    scanBulkIssueSettings,
} from '../../../../actions/issueSettings';

class ComputerList extends Component {
    static propTypes = {
        groups: PropTypes.array,
        filteredItems: PropTypes.shape({
            color: PropTypes.string,
            fontSize: PropTypes.number,
        }),
        moveToGroup: PropTypes.func,
    };

    static defaultProps = {
        groups: [],
        filteredItems: [],
        moveToGroup: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            checkedList: [],
            checkedAgentList: [],
        };
        this.onCheck = this.onCheck.bind(this);
        this.moveToGroup = this.moveToGroup.bind(this);
    }

    componentDidMount() {
        const { loadActionData } = this.props;
        loadActionData();
    }

    componentDidUpdate(prevProps) {
        const { actions } = this.props;
        const { checkedList, checkedAgentList } = this.state;
        if (prevProps.actions === actions || !checkedList.length || !checkedAgentList.length) {
            return;
        }

        const filteredСheckedAgentList = checkedAgentList.filter(
            item => !actions.find(action => action.agentId === item.agentId)
        );
        const filteredСheckedList = checkedList.filter(
            item => !actions.find(action => action.computerId === item)
        );

        this.setState({
            checkedList: filteredСheckedList,
            checkedAgentList: filteredСheckedAgentList,
        });
    }

    onCheck(computerId, agentId, computerOsName) {
        this.setState(prevState => {
            const { checkedList, checkedAgentList } = prevState;
            const indexOf = checkedList.indexOf(computerId);

            if (indexOf === -1) {
                checkedList.push(computerId);
                checkedAgentList.push({
                    computerId,
                    agentId,
                    OsName: computerOsName,
                });
            } else {
                checkedList.splice(indexOf, 1);
                checkedAgentList.splice(indexOf, 1);
            }

            return {
                checkedList,
                checkedAgentList,
            };
        });
    }

    async moveToGroup(groupId, groupName) {
        const { checkedList } = this.state;
        const { moveToGroup } = this.props;
        if (checkedList.length === 0) {
            return;
        }
        try {
            await moveToGroup(checkedList, groupId, groupName);
            this.setState({
                checkedList: [],
                checkedAgentList: [],
            });
        } catch (e) {
            throw e;
        }
    }

    render() {
        const {
            groups,
            stopAction,
            cleanAndScanIssueSettings,
            scanBulkIssueSettings,
            ComputerLoaded,
            filteredItems,
            actions,
        } = this.props;

        const { checkedList, checkedAgentList } = this.state;
        return (
            <div className="col-md-12 col-sm-12 col-xs-12">
                <div className="group_computers">
                    <div className="table-top-panel panel-heading">
                        <h2>
                            <i className="pc-icon" /> Computer List
                        </h2>
                        <div className="heading-elements">
                            <Link to="/downloads">
                                <i className="plus-icon-sm" />
                                Add Computer
                            </Link>
                        </div>
                        <div className="clearfix" />
                    </div>

                    <div className="x_content">
                        <table className="table table-striped bdr_strip ticket-table table-computers table-computer-list table-hover">
                            <thead>
                                <tr>
                                    <th>Computer name</th>
                                    <th>PC user</th>
                                    <th>Computer group</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                    <th>Action progress</th>
                                </tr>
                            </thead>
                            <tbody>
                                <Table
                                    items={filteredItems}
                                    onCheck={this.onCheck}
                                    ComputerLoaded={ComputerLoaded}
                                    actions={actions}
                                    stopAction={stopAction}
                                    checkedList={checkedList}
                                />
                                <tr className="dporHover">
                                    <td className="table-center">
                                        <BulkActions
                                            checkedAgentList={checkedAgentList}
                                            cleanAndScanIssueSettings={cleanAndScanIssueSettings}
                                            scanBulkIssueSettings={scanBulkIssueSettings}
                                            checkedList={checkedList}
                                            groups={groups}
                                        />
                                        <MoveToGroupForm
                                            moveToGroup={this.moveToGroup}
                                            groups={groups}
                                        />
                                    </td>
                                    <td colSpan="6" className="table-center " />
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    filteredItems: computersSelector(state),
    groups: state.groups.items,
    actions: state.computers.actions,
});

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            moveToGroup,
            cleanAndScanIssueSettings,
            scanBulkIssueSettings,
            loadActionData,
            stopAction,
            leaveComputerListRoom,
            joinComputerListRoom,
            ComputerLoaded,
            computerChosen,
        },
        dispatch
    );

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ComputerList);
