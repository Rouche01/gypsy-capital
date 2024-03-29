import React, { useState, useEffect, useContext } from "react";
import styles from "./LoanCalculatorForm.module.scss";
import InputField from "../InputField/InputField";
import Button from "../Button/Button";
import { Row, Col } from "react-bootstrap";
import Slider from "react-rangeslider";
import { validateInput } from "../../utils/validateInput";
import { ToastContainer, toast } from "react-toastify";
import { Context as LoanContext } from "../../context/LoanContext";
import { Context as AuthContext } from "../../context/AuthContext";
import {
  convertInput,
  stripCommasInNumber,
} from "../../utils/convertInputType";
import "react-rangeslider/lib/index.css";
import { numberWithCommas } from "../../utils/nigeriaStates";

export const DtiRangeSlider = ({ label, dtiVal, setVal }) => {
  const handleChange = (val) => {
    setVal(val);
  };

  return (
    <div>
      <p>{`${label}: ${dtiVal}%`}</p>
      <Slider min={33} max={50} value={dtiVal} onChange={handleChange} />
    </div>
  );
};

const LoanCalculatorForm = ({ delegateApply }) => {
  const {
    state: { loading },
    // eslint-disable-next-line no-unused-vars
    loanApply,
  } = useContext(LoanContext);
  const {
    state: { user },
  } = useContext(AuthContext);

  // const [dti, setDti] = useState(33);
  const [daysOfMonth, setDaysOfMonth] = useState([]);
  const [limitError, setLimitError] = useState(null);
  const [loanCalcData, setLoanCalcData] = useState({
    monthlySalary: "",
    payDay: null,
    loanAmount: "",
    installmentPeriod: null,
    loanPurpose: null,
    estimatedMonthlyPayment: "",
    dti: 33,
  });

  const [loanCalcDataErrors, setLoanCalcDataErrors] = useState({
    monthlySalary: null,
    payDay: null,
    loanAmount: null,
    installmentPeriod: null,
    loanPurpose: null,
  });

  useEffect(() => {
    setDaysOfMonth(fillUpDaysArray);
  }, []);

  const fillUpDaysArray = () => {
    let daysArray = [];
    for (let i = 0; i < 31; i++) {
      daysArray.push(i + 1);
    }
    return daysArray;
  };

  const {
    monthlySalary,
    loanAmount,
    installmentPeriod,
    payDay,
    loanPurpose,
  } = loanCalcData;

  useEffect(() => {
    if (monthlySalary && loanAmount && installmentPeriod) {
      // console.log(typeof monthlySalary, typeof loanAmount, installmentPeriod);
      const tenor = Number(installmentPeriod.split(" ")[0]);
      let initRate = stripCommasInNumber(loanAmount);
      let toRepay = initRate + initRate * 0.04;
      toRepay = toRepay + toRepay * 0.04 * tenor;
      // for(let i=0; i < tenor; i++) {
      //   toRepay = initRate + (initRate * 0.04);
      //   initRate = toRepay;
      // }
      const monthlyRepay = toRepay / tenor;
      const percentDti = (loanCalcData.dti / 100).toFixed(3);
      console.log(percentDti);
      if (monthlyRepay > percentDti * stripCommasInNumber(monthlySalary)) {
        setLimitError(
          "You are not eligible for this amount, kindly enter a lower loan amount"
        );
      } else {
        setLimitError(null);
      }
      setLoanCalcData({
        ...loanCalcData,
        estimatedMonthlyPayment: numberWithCommas(Math.floor(monthlyRepay)),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthlySalary, loanAmount, installmentPeriod, loanCalcData.dti]);

  const submitLoanCalcData = () => {
    const fieldsTovalidate = {
      monthlySalary,
      payDay,
      loanAmount,
      installmentPeriod,
      loanPurpose,
    };
    const validated = validateInput(fieldsTovalidate, setLoanCalcDataErrors);
    if (validated) {
      const applyData = {
        monthlySalary: stripCommasInNumber(monthlySalary),
        payDay,
        amount: stripCommasInNumber(loanAmount),
        paymentPeriod: installmentPeriod,
        loanPurpose,
        monthlyRepayment: stripCommasInNumber(
          loanCalcData.estimatedMonthlyPayment
        ),
        DTI: loanCalcData.dti,
      };
      if (stripCommasInNumber(loanAmount) < 100000) {
        toast.error(
          "Your requested amount is too low. We only offer loans starting from N100,000"
        );
      } else {
        limitError ? toast.error(limitError) : delegateApply(applyData);
      }
    }
  };

  const handleSubmitWithKeyPress = (e) => {
    if (e.key.toLowerCase() === "enter" || e.code.toLowerCase() === "enter") {
      submitLoanCalcData();
    }
  };

  if (daysOfMonth.length === 0) {
    return null;
  }

  return (
    <div className={styles.calculatorForm}>
      <ToastContainer position="top-center" />
      <Row className="mb-4">
        <Col className="mb-4 mb-md-0" sm={12} md={6}>
          <InputField
            label="Monthly Salary"
            type="text"
            nameAttr="salary"
            value={loanCalcData.monthlySalary}
            handleKeyPress={(e) => handleSubmitWithKeyPress(e)}
            changed={(val) => {
              const { includesAlphabet, convertedToNumber } = convertInput(val);
              if (!includesAlphabet) {
                setLoanCalcDataErrors({
                  ...loanCalcDataErrors,
                  monthlySalary: null,
                });
                setLoanCalcData({
                  ...loanCalcData,
                  monthlySalary: convertedToNumber.toLocaleString(),
                });
              }
            }}
            error={
              loanCalcDataErrors.monthlySalary &&
              loanCalcDataErrors.monthlySalary
            }
          />
        </Col>
        <Col sm={12} md={6}>
          <InputField
            label="Pay Day"
            type="select"
            options={daysOfMonth}
            nameAttr="payday"
            value={loanCalcData.payDay}
            handleKeyPress={(e) => handleSubmitWithKeyPress(e)}
            changed={(val) => {
              setLoanCalcDataErrors({ ...loanCalcDataErrors, payDay: null });
              setLoanCalcData({ ...loanCalcData, payDay: val });
            }}
            error={loanCalcDataErrors.payDay && loanCalcDataErrors.payDay}
          />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col className="mb-4 mb-md-0" sm={12} md={6}>
          <InputField
            label="Loan Amount"
            type="text"
            nameAttr="loanAmt"
            value={loanCalcData.loanAmount}
            handleKeyPress={(e) => handleSubmitWithKeyPress(e)}
            changed={(val) => {
              const { includesAlphabet, convertedToNumber } = convertInput(val);
              if (!includesAlphabet) {
                setLoanCalcDataErrors({
                  ...loanCalcDataErrors,
                  loanAmount: null,
                });
                setLoanCalcData({
                  ...loanCalcData,
                  loanAmount: convertedToNumber.toLocaleString(),
                });
              }
            }}
            error={
              loanCalcDataErrors.loanAmount && loanCalcDataErrors.loanAmount
            }
          />
          <p className={styles.inputHint}>
            <span>min amt:</span> #100,000; <span>max amt:</span> #2,000,000
          </p>
        </Col>
        <Col sm={12} md={6}>
          <InputField
            label="Installment Period"
            type="select"
            options={[
              "1 Month",
              "2 Months",
              "3 Months",
              "4 Months",
              "5 Months",
              "6 Months",
            ]}
            nameAttr="installmentCycle"
            value={loanCalcData.installmentPeriod}
            handleKeyPress={(e) => handleSubmitWithKeyPress(e)}
            changed={(val) => {
              setLoanCalcDataErrors({
                ...loanCalcDataErrors,
                installmentPeriod: null,
              });
              setLoanCalcData({ ...loanCalcData, installmentPeriod: val });
            }}
            error={
              loanCalcDataErrors.installmentPeriod &&
              loanCalcDataErrors.installmentPeriod
            }
          />
        </Col>
      </Row>
      {user?.role === "sales" && (
        <Row className="mb-4">
          <Col>
            <DtiRangeSlider
              label="DTI"
              dtiVal={loanCalcData.dti}
              setVal={(val) => setLoanCalcData({ ...loanCalcData, dti: val })}
            />
          </Col>
        </Row>
      )}
      <Row className="mb-4">
        <Col>
          <InputField
            label="Loan Purpose"
            type="select"
            options={[
              "Debt Consolidation",
              "Home Remodelling",
              "Moving Costs",
              "Emergency Expenses",
              "Medical Bills",
              "Education",
              "Appliance Purchase",
              "Vehicle Financing",
              "Vacation Costs",
              "Wedding Expenses",
              "Others",
            ]}
            nameAttr="loanPurpose"
            value={loanCalcData.loanPurpose}
            handleKeyPress={(e) => handleSubmitWithKeyPress(e)}
            changed={(val) => {
              setLoanCalcDataErrors({
                ...loanCalcDataErrors,
                loanPurpose: null,
              });
              setLoanCalcData({ ...loanCalcData, loanPurpose: val });
            }}
            error={
              loanCalcDataErrors.loanPurpose && loanCalcDataErrors.loanPurpose
            }
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <InputField
            type="text"
            label="Estimated Monthly Payment"
            nameAttr="monthlyPayment"
            value={loanCalcData.estimatedMonthlyPayment}
            handleKeyPress={(e) => handleSubmitWithKeyPress(e)}
            disable={true}
            changed={(val) => {
              setLoanCalcDataErrors({
                ...loanCalcDataErrors,
                estimatedMonthlyPayment: null,
              });
              setLoanCalcData({
                ...loanCalcData,
                estimatedMonthlyPayment: val,
              });
            }}
            error={
              loanCalcDataErrors.estimatedMonthlyPayment &&
              loanCalcDataErrors.estimatedMonthlyPayment
            }
          />
          <p className={styles.inputHint}>
            <span>
              Eventual repayment amount may differ after risk assessment.
            </span>
          </p>
          {limitError && <p className={styles.limitError}>{limitError}</p>}
        </Col>
      </Row>
      <Button
        className="mt-5"
        fullWidth
        clicked={submitLoanCalcData}
        bgColor="#741763"
        size="lg"
        color="#EBEBEB"
        disabled={loading}
        loading={loading}
      >
        Continue
      </Button>
    </div>
  );
};

export default LoanCalculatorForm;
