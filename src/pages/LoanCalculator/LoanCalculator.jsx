import React, { useEffect, useState } from 'react';
import styles from './LoanCalculator.module.scss';
import NavBar from '../../components/NavBar/NavBar';
import InputField from '../../components/InputField/InputField';
import { Row, Col } from 'react-bootstrap';
import Button from '../../components/Button/Button';
import { useLocation, useRouteMatch, useHistory } from 'react-router-dom';


const LoanCalculator = () => {

  const [loanData, setLoanData] = useState({
    proposedAmount: '',
    proposedDuration: '',
    monthlyIncome: '',
    employmentStatus: '',
    proposedMonthyRepayment: '',
  })

  const [inputErrors, setInputError] = useState({
    proposedAmount: null,
    proposedDuration: null,
    monthlyIncome: null,
    employmentStatus: null,
    proposedMonthyRepayment: null
  })

  const location = useLocation();
  const history = useHistory();
  const { url } = useRouteMatch();

  useEffect(() => {
    if(location.state) {
      setLoanData({ ...loanData, proposedAmount: location.state.loanAmount });
    }
  },[location])

  return (
    <>
    <NavBar location={url} history={history} />
    <div className={styles.mainSection}>
      <div className={styles.container}>
        <h3>Access Quick Loans of Up to ₦500,000</h3>
        <p>Use our loan calculator to get started</p>
        <div className={styles.calculatorBox}>
          <Row className="mb-4">
            <Col>
              <InputField 
                type="text"
                label="How much do you need?"
                nameAttr="loanAmt"
                value={loanData.proposedAmount}
                changed={(val) => {
                  setLoanData({ ...loanData, proposedAmount: val});
                  setInputError({ ...inputErrors, proposedAmount: null })
                }}
                error={inputErrors.proposedAmount && inputErrors.proposedAmount}
              />
            </Col>
          </Row>
          <Row className="mb-4">
            <Col>
              <InputField 
                type="select"
                label="How long before you pay back? (Months)"
                nameAttr="proposedDuration"
                options={[1, 2, 3]}
                value={loanData.proposedDuration}
                changed={(val) => {
                  setLoanData({ ...loanData, proposedDuration: val});
                  setInputError({ ...inputErrors, proposedDuration: null })
                }}
                error={inputErrors.proposedDuration && inputErrors.proposedDuration}
              />
            </Col>
          </Row>
          <Row className="mb-4">
            <Col>
              <InputField 
                type="text"
                label="What is your monthly income?"
                nameAttr="monthlyIncome"
                value={loanData.monthlyIncome}
                changed={(val) => {
                  setLoanData({ ...loanData, monthlyIncome: val});
                  setInputError({ ...inputErrors, monthlyIncome: null })
                }}
                error={inputErrors.monthlyIncome && inputErrors.monthlyIncome}
              />
            </Col>
          </Row>
          <Row className="mb-4">
            <Col>
              <InputField 
                type="select"
                label="Employment status"
                options={['Self-Employed', 'Unemployed', 'Employed']}
                nameAttr="employStatus"
                value={loanData.employmentStatus}
                changed={(val) => {
                  setLoanData({ ...loanData, employmentStatus: val});
                  setInputError({ ...inputErrors, employmentStatus: null })
                }}
                error={inputErrors.employmentStatus && inputErrors.employmentStatus}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <InputField 
                type="text"
                label="Estimated monthly repayment"
                nameAttr="proposedRepayment"
                value={loanData.proposedMonthyRepayment}
                changed={(val) => {
                  setLoanData({ ...loanData, proposedMonthyRepayment: val});
                  setInputError({ ...inputErrors, proposedMonthyRepayment: null })
                }}
                error={inputErrors.proposedMonthyRepayment && inputErrors.proposedMonthyRepayment }
              />
            </Col>
          </Row>
          <Button
            className={ "mt-5" } 
            fullWidth 
            // clicked={handleSubmit} 
            bgColor="#741763" 
            size="lg" 
            color="#EBEBEB"
            // disabled={loading}
            // loading={loading}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
    </>
  )
}


export default LoanCalculator;