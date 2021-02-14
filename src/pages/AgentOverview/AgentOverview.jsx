import React from 'react';
import { useLocation } from 'react-router-dom';
import Dashboard from '../../components/Dashboard/Dashboard';
import { routes } from '../../routes/sidebarRoutes';
import styles from './AgentOverview.module.scss';
import moment from 'moment';
import { AiOutlineCalendar } from 'react-icons/ai';
import ClientStat from '../../assets/salesDashboard/clientstat.png';
import DisburseStat from '../../assets/salesDashboard/loanstat.png';
import LoanStat from '../../assets/salesDashboard/loanchange.png';
import { Row, Col, Table } from 'react-bootstrap';
import Button from '../../components/Button/Button';
import { recentLoans } from '../../utils/dummyData';


const StatBox = ({ icon, title, statData }) => {
  return (
    <div className={styles.statBox}>
      <h5>{title}</h5>
      <div className={styles.statInfo}>
        <img src={icon} alt="stats box" />
        <h3>{statData}</h3>
      </div>
    </div>
  )
}

const AgentOverview = () => {

  const location = useLocation();
  const salesRoute = routes[1];

  return (
    <Dashboard sidebarRoutes={salesRoute} location={location}>
      <div className={styles.welcomeGroup}>
        <div>
          <h2>Hey, Moses</h2>
          <p className={styles.currentDate}>Today is {moment().format('dddd Do[,] MMMM')}.</p>
        </div>
        <button>
          <AiOutlineCalendar className={styles.icon} />
          Last 7 days
        </button>
      </div>
      <div className={styles.stats}>
        <Row>
          <Col>
            <StatBox icon={ClientStat} title="Total Clients" statData="25" />
          </Col>
          <Col>
            <StatBox icon={DisburseStat} title="Total Disbursed Loans" statData="1.21M" />
          </Col>
          <Col>
            <StatBox icon={LoanStat} title="Total Active Loans" statData="20" />
          </Col>
        </Row>
      </div>
      <div className={styles.recentLoans}>
        <div className={styles.header}>
          <h3>Recent Loans</h3>
          <Button
            size="sm" 
            bgColor="#741763" 
            color="#fff"
          >
            View All
          </Button>
        </div>
        <div className={styles.recentCard}>
          <Table className={styles.table}>
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Loan ID</th>
                <th>Loan Amount</th>
                <th>Status</th>
                <th>Tenure</th>
                <th>Monthly Repayment</th>
              </tr>
            </thead>
            <tbody>
              { recentLoans.map((loan, idx) => (
                <tr key={idx}>
                  <td>{loan.clientName}</td>
                  <td className={styles.loanId}>{loan.loanId}</td>
                  <td>{loan.loanAmt}</td>
                  <td>{loan.status}</td>
                  <td>{loan.tenure}</td>
                  <td>{loan.monthlyRepayment}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </Dashboard>
  )
}


export default AgentOverview;