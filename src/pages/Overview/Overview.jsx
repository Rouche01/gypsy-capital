import React, { useContext, useEffect, useState } from 'react';
import styles from './Overview.module.scss';
import { clientRoutes } from '../../routes/sidebarRoutes';
import Dashboard from '../../components/Dashboard/Dashboard';
import Button from '../../components/Button/Button';
import gypsyNote from '../../assets/icons/gypsyNotes.svg';
import altInvestment from '../../assets/icons/alternative.svg';
import { Col, Row } from 'react-bootstrap';
import noLoan from '../../assets/no-loan.png';
import moment from 'moment';
import { Context as AuthContext } from '../../context/AuthContext';
import { Context as LoanContext } from '../../context/LoanContext';
import { useRouteMatch, useHistory, useLocation } from 'react-router-dom';


const Overview = () => {

  const { path } = useRouteMatch();
  const history = useHistory();
  const location = useLocation();
  const [activeLoan, setActiveLoan] = useState(null);

  const { state: { user } } = useContext(AuthContext);
  const { state: { loans }, retrieveClientLoans } = useContext(LoanContext)

  useEffect(() => {
    retrieveClientLoans()
  }, []);

  useEffect(() => {
    const statusToDisplay = loans.filter(loan => loan.status.toLowerCase() === 'pending' || 'active');
    console.log(statusToDisplay[0]);
    setActiveLoan(statusToDisplay[0]);
  }, [loans]);

  useEffect(() => {
    console.log(user);
  }, [user]);

  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  if(!user) {
    return null
  }

  return (
    <Dashboard sidebarRoutes={clientRoutes} location={location}>
      <div className={styles.welcomeGroup}>
        <h2>Hey, {user.firstName}</h2>
        <p className={styles.currentDate}>Today is {moment().format('dddd Do[,] MMMM')}.</p>
      </div>
      <div className={styles.loanStatus} style={{padding: '30px 40px'}}>
        { !activeLoan && <div className={styles.innerContainer}>
          <div className={styles.mainContent}>
            <h3>Active Loan</h3>
            <p>Sorry you currently have no active loan</p>
            <Button
              bgColor="#741763"
              size="sm"
              color="#fff"
              className="mt-4"
              clicked={() => history.push('/dashboard/consumer-credit/apply/calculator')}
            >
              Apply for loan
            </Button>
          </div>
          <img src={noLoan} alt="No active loan" height="280" />
        </div> } 
        { activeLoan && <div className={styles.activeStyle}>
          <div className={styles.mainContent}>
            <h3>Active Loan <span>{activeLoan.status}</span></h3>
            <div className={styles.statusBoard}>
              <Row>
                <Col className={styles.borderClass}>
                  <div className={styles.loanData}>
                    <div>
                      <h6>Loan amount</h6>
                      <h1>{`N${numberWithCommas(activeLoan.amount)}`}</h1>
                    </div>
                  </div>
                </Col>
                <Col className={styles.borderClass}>
                  <div className={styles.loanData}>
                    <div>
                      <h6>Monthly Repayment</h6>
                      <h1>{`N${numberWithCommas(activeLoan.monthlyRepayment)}`}</h1>
                    </div>
                  </div>
                </Col>
                <Col>
                  <div className={styles.loanData}>
                    <div>
                      <h6>Tenure</h6>
                      <h1>{activeLoan.paymentPeriod}</h1>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </div>}
      </div>
      <div className={styles.otherProducts}>
        <Row>
          <Col sm={12} md={6}>
            <div className={[styles.product, styles.borderClass].join(' ')}>
              <div className={styles.productIcon}>
                <img src={gypsyNote} alt="Gypsy Notes" width="25" />
              </div>
              <h3 className={styles.productTitle}>Gypsy Notes</h3>
              <p className="mt-2">Let your money work for you and enjoy high interest rates on your money. Start a Gypsy Fixed Income Note today and earn more.</p>
              <button className={[styles.productBtn, "mt-3"].join(' ')}>
                Be the first to know when we launch
              </button>
            </div>
          </Col>
          <Col sm={12} md={6}>
            <div className={[styles.product, styles.border2Class].join(' ')}>
              <div className={styles.productIcon}>
                <img src={altInvestment} alt="Alternative Investment" width="40" />
              </div>
              <h3 className={styles.productTitle}>Alternative Investment</h3>
              <p className="mt-2">Are you an investor who seek greater rewards? Our Alternative Investment service is here to help you earn more.</p>
              <button className={[styles.productBtn, "mt-3"].join(' ')}>
                Be the first to know when we launch
              </button>
            </div>
          </Col>
        </Row>
      </div>
    </Dashboard>
  )
}


export default Overview;