import React, { useContext, useEffect, useState, useMemo } from 'react';
import styles from './ClientDetails.module.scss';
import Dashboard from '../../components/Dashboard/Dashboard';
import { routes } from '../../routes/sidebarRoutes';
import { useLocation, useParams, Link } from 'react-router-dom';
import InputField from '../../components/InputField/InputField';
import { Row, Col, Table, Pagination } from 'react-bootstrap';
import NavTabs from '../../components/NavTabs/NavTabs';
import Button from '../../components/Button/Button';
import LoanModal from '../../components/LoanModal/LoanModal';
import { Context as UserContext } from '../../context/UserContext';
import { Context as LoanContext } from '../../context/LoanContext';
import { Context as AuthContext } from '../../context/AuthContext';
import Loader from '../../components/Loader/Loader';
import usePagination from '../../hooks/usePagination';
import { numberWithCommas } from '../../utils/nigeriaStates';
import { TiCancelOutline } from 'react-icons/ti';
import useLoanDetails from '../../hooks/useLoanDetails';
import _ from 'lodash';


export const Biodata = ({ data, userId }) => {

  const [ loanDeets ] = useLoanDetails(userId);

  const [biodata, setBiodata] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    emailAddress: "",
    phoneNumber: "",
    altPhoneNumber: "",
    residentialAddress: "",
  });

  const [residentialStatus, setResidentialStatus] = useState('');

  useEffect(() => {
    if(data) {
      setBiodata({
        ...biodata,
        firstName: data.firstName,
        lastName: data.lastName,
        gender: _.capitalize(data.gender),
        dateOfBirth: data.DOB,
        emailAddress: data.email,
        phoneNumber: data.phoneNumber.replace('234', '0'),
        altPhoneNumber: data.alternativePhoneNumber,
        residentialAddress: `${data.street}, ${_.capitalize(data.state)}`,
        // residentialStatus: data
      })
    }
  }, [data]);

  useEffect(() => {
    if(loanDeets) {
      setResidentialStatus(_.capitalize(loanDeets?.residence[0]?.residentialStatus))
    }
  }, [loanDeets])

  return (
    <>
      <Row className="mb-4">
        <Col>
          <InputField 
            type="text"
            label="First Name"
            nameAttr="firstName"
            value={biodata.firstName}
            disable={true}
          />
        </Col>
        <Col>
          <InputField 
            type="text"
            label="Last Name"
            nameAttr="lastName"
            value={biodata.lastName}
            disable={true}
          />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <InputField 
            type="text"
            label="Gender"
            nameAttr="gender"
            value={biodata.gender}
            disable={true}
          />
        </Col>
        <Col>
          <InputField 
            type="text"
            label="Date of Birth"
            nameAttr="dob"
            value={biodata.dateOfBirth}
            disable={true}
          />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <InputField 
            type="email"
            label="Email Address"
            nameAttr="emailAddress"
            value={biodata.emailAddress}
            disable={true}
          />
        </Col>
        <Col>
          <InputField 
            type="text"
            label="Phone Number"
            nameAttr="phoneNo"
            value={biodata.phoneNumber}
            disable={true}
          />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <InputField 
            type="text"
            label="Residential Status"
            nameAttr="residentStatus"
            value={   residentialStatus}
            disable={true}
          />
        </Col>
        <Col>
          <InputField 
            type="text"
            label="Alternative Phone Number"
            nameAttr="altPhoneNo"
            value={biodata.altPhoneNumber}
            disable={true}
          />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <InputField 
            type="text"
            label="Residential Address"
            nameAttr="homeAddress"
            value={biodata.residentialAddress}
            disable={true}
          />
        </Col>
      </Row>
    </>
  )
}


export const NextOfKin = ({ data }) => {

  const [nextOfKin, setNextOfKin] = useState({
    firstName: "",
    lastName: "",
    relationship: "" ,
    phoneNumber: "",
    residentialAddress: ""
  });

  useEffect(() => {

    if(data) {
      const names = data.fullName?.split(' ');

      setNextOfKin({
        ...nextOfKin,
        firstName: names[0],
        lastName: names[names.length - 1],
        relationship: data.relationship,
        phoneNumber: data.phoneNumber,
        residentialAddress: data.residentialAddress
      })
    }
  }, [data])

  return (
    <>
      <Row className="mb-4">
        <Col>
          <InputField 
            type="text"
            label="First Name"
            nameAttr="firstName"
            value={nextOfKin.firstName}
            disable={true}
          />
        </Col>
        <Col>
          <InputField 
            type="text"
            label="Last Name"
            nameAttr="lastName"
            value={nextOfKin.lastName}
            disable={true}
          />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <InputField 
            type="text"
            label="Relationship"
            nameAttr="relationship"
            value={nextOfKin.relationship}
            disable={true}
          />
        </Col>
        <Col>
          <InputField 
            type="text"
            label="Phone Number"
            nameAttr="phoneNo"
            value={nextOfKin.phoneNumber}
            disable={true}
          />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <InputField 
            type="text"
            label="Residential Address"
            nameAttr="kinAddress"
            value={nextOfKin.residentialAddress}
            disable={true}
          />
        </Col>
      </Row>
    </>
  )
}


export const Bank = ({ data, userId }) => {

  const [disburseBank, setDisburseBank] = useState({
    bankName: "",
    accountType: "",
    accountNumber: "",
    accountName: ""
  });

  const [salaryBank, setSalaryBank] = useState({
    bankName: "",
    accountType: "",
    accountNumber: "",
    accountName: ""
  });

  const [ loanDeets ] = useLoanDetails(userId);

  useEffect(() => {
    if(data) {
      console.log(data);
      setDisburseBank({
        ...disburseBank,
        bankName: _.startCase(data.bankName),
        accountType: _.capitalize(data.accountType),
        accountNumber: data.accountNumber,
        accountName: data.accountName
      })
    }
  }, [data])

  useEffect(() => {
    if(loanDeets) {
      setSalaryBank({
        ...salaryBank,
        bankName: _.startCase(loanDeets?.bank[0]?.bank),
        accountType: _.capitalize(loanDeets?.bank[0]?.accountType),
        accountNumber: loanDeets?.bank[0]?.accountNumber,
        accountName: loanDeets?.bank[0]?.accountName
      })
    }
  }, [loanDeets])

  return (
    <>
      <div className={styles.disburse}>
        <h3>Disbursement Account</h3>
        <Row className="mb-4">
          <Col>
            <InputField 
              type="text"
              label="Bank Name"
              nameAttr="bankName"
              value={disburseBank.bankName}
              disable={true}
            />
          </Col>
          <Col>
            <InputField 
              type="text"
              label="Account Type"
              nameAttr="accountType"
              value={disburseBank.accountType}
              disable={true}
            />
          </Col>
        </Row>
        <Row className="mb-4">
          <Col>
            <InputField 
              type="text"
              label="Account Number"
              nameAttr="accountNumber"
              value={disburseBank.accountNumber}
              disable={true}
            />
          </Col>
          <Col>
            <InputField 
              type="text"
              label="Account Name"
              nameAttr="accountName"
              value={disburseBank.accountName}
              disable={true}
            />
          </Col>
        </Row>
      </div>
      <div className={styles.salary}>
        <h3>Salary Account</h3>
        <Row className="mb-4">
          <Col>
            <InputField 
              type="text"
              label="Bank Name"
              nameAttr="salaryBank"
              value={salaryBank.bankName}
              disable={true}
            />
          </Col>
          <Col>
            <InputField 
              type="text"
              label="Account Type"
              nameAttr="salaryAcctType"
              value={salaryBank.accountType}
              disable={true}
            />
          </Col>
        </Row>
        <Row className="mb-4">
          <Col>
            <InputField 
              type="text"
              label="Account Number"
              nameAttr="salaryAcctNum"
              value={salaryBank.accountNumber}
              disable={true}
            />
          </Col>
          <Col>
            <InputField 
              type="text"
              label="Account Name"
              nameAttr="salaryAcctName"
              value={salaryBank.accountName}
              disable={true}
            />
          </Col>
        </Row>
      </div>
    </>
  )
}


export const Employer = ({ userId }) => {

  const [employerInfo, setEmployerInfo] = useState({
    employerName: '',
    employmentDate: '',
    employmentSector: '',
    employmentType: '',
    officialEmail: ''
  });

  const [OfficeAddress, setOfficeAddress] = useState({
    street: '',
    city: '',
    state: '',
    lga: ''
  })

  const [ loanDeets ] = useLoanDetails(userId)

  useEffect(() => {
    if(loanDeets) {
      setEmployerInfo({
        ...employerInfo,
        employerName: loanDeets?.employment[0]?.employerName,
        employmentDate: loanDeets?.employment[0]?.resumptionDate,
        employmentSector: _.capitalize(loanDeets?.employment[0]?.sector),
        employmentType: _.capitalize(loanDeets?.employment[0]?.employmentType),
        officialEmail: loanDeets?.employment[0]?.officialEmail
      })
      setOfficeAddress({
        ...OfficeAddress,
        street: loanDeets?.employment[0]?.street,
        city: loanDeets?.employment[0]?.city,
        state: _.capitalize(loanDeets?.employment[0]?.state),
        lga: _.capitalize(loanDeets?.employment[0]?.city),
      })
    }
  }, [loanDeets])

  return (
    <>
      <Row className="mb-4">
        <Col>
          <InputField 
            type="text"
            label="Employer Name"
            nameAttr="employerName"
            disable={true}
            value={employerInfo.employerName}
          />
        </Col>
        <Col>
          <InputField 
            type="text"
            label="Employment Date"
            nameAttr="employmentDate"
            disable={true}
            value={employerInfo.employmentDate}
          />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <InputField 
            type="text"
            label="Employment Sector"
            nameAttr="employmentSector"
            disable={true}
            value={employerInfo.employmentSector}
          />
        </Col>
        <Col>
          <InputField 
            type="text"
            label="Employment Type"
            nameAttr="employmentType"
            disable={true}
            value={employerInfo.employmentType}
          />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <InputField 
            type="text"
            label="Office Email Address"
            nameAttr="officeEmail"
            disable={true}
            value={employerInfo.officialEmail}
          />
        </Col>
      </Row>
      <div className={styles.officeAddress}>
        <h3>Office Address</h3>
        <Row className="mb-4">
          <Col>
            <InputField 
              type="text"
              label="Street Address"
              nameAttr="streetAddress"
              disable={true}
              value={OfficeAddress.street}
            />
          </Col>
        </Row>
        <Row className="mb-4">
        <Col>
          <InputField 
            type="text"
            label="City"
            nameAttr="city"
            disable={true}
            value={OfficeAddress.city}
          />
        </Col>
        <Col>
          <InputField 
            type="text"
            label="State"
            nameAttr="state"
            disable={true}
            value={OfficeAddress.state}
          />
        </Col>
        <Col>
          <InputField 
            type="text"
            label="Local Government Area"
            nameAttr="lga"
            disable={true}
            value={OfficeAddress.lga}
          />
        </Col>
      </Row>
      </div>
    </>
  )
}


export const ClientLoan = ({ userId, canApply, userRole }) => {

  const [modalOpen, setModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(5);

  const closeModal = () => {
    setModalOpen(false);
  }

  const { state: { loans }, retrieveClientLoans } = useContext(LoanContext);

  useEffect(() => {
    retrieveClientLoans();
  }, []);

  const clientLoans = useMemo(() => {
    return loans.filter((loan) => loan.userId === userId)
  }, [loans, userId]);

  useEffect(() => {
    console.log(loans);
  }, [loans])

  const { 
    currentList, 
    items, 
    goToNextPage, 
    goToPrevPage 
  } = usePagination(currentPage, postsPerPage, clientLoans, setCurrentPage, styles)

  const startApply = () => {
    setModalOpen(true);
  }

  return (
    <div className={styles.loanTable}>
      { canApply && <Button
        size="sm" 
        clicked={startApply}
        bgColor="#741763" 
        color="#fff"
        className={styles.btn}
      >
        Apply for a Loan
      </Button>}
      <div className={styles.tableCard}>
        <Table className={styles.table}>
          <thead>
            <tr>
              <th>Loan ID</th>
              <th>Monthly Repayment</th>
              <th>Tenure</th>
              <th>Status</th>
              <th>Repayment Source</th>
              <th>Loan Amount</th>
              <th>Balance</th>
            </tr>
          </thead>
          { currentList && currentList.length > 0 ? <tbody>
            { currentList && currentList.map((loan) => {
              return (
                <tr>
                  <td className={styles.loanId}>
                    <Link to={`/${userRole}/loan/${loan._id}`}>
                      {loan._id.slice(0, 6)}
                    </Link>
                  </td>
                  <td>{`N${numberWithCommas(loan.monthlyRepayment)}`}</td>
                  <td>{loan.paymentPeriod}</td>
                  <td>{_.capitalize(loan.status)}</td>
                  <td>Salary</td>
                  <td>{`N${numberWithCommas(loan.amount)}`}</td>
                  <td>_____</td>
                </tr>
              )
            })}
          </tbody> : null }
        </Table>
        { currentList && currentList.length === 0 ? <div className={styles.nullList}>
            <TiCancelOutline size="6em" color="rgba(116, 23, 99, 0.6)" />
          </div> : null }
        { currentList && currentList.length > 0 ? <div className={styles.tableFooter}>
          <div className={styles.rowsInput}>
            <p>Rows per page: </p>
            <select onChange={(e) => setPostsPerPage(Number(e.currentTarget.value))}>
              <option value={5} selected>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={10}>25</option>
              <option value={30}>30</option>
            </select>
          </div>
          <Pagination className={styles.pagination}>
            <Pagination.Prev onClick={goToPrevPage}/>
            {items}
            <Pagination.Next onClick={goToNextPage} />
          </Pagination>
        </div> : null }
      </div>
      <LoanModal userId={userId} openState={modalOpen} closeHandler={closeModal} />
    </div>
  )
}


const ClientDetails = () => {

  const salesRoute = routes[1];
  const location = useLocation();
  const { clientId } = useParams();

  const { 
    state: { userDetails, detailStatus }, 
    getClientDetails,
    clearErrors
  } = useContext(UserContext);

  const { state: { user } } = useContext(AuthContext);
  useEffect(() => {
    getClientDetails(clientId);

    return () => {
      console.log('cleanup')
      clearErrors();
    }
  }, [])

  // console.log(userDetails)


  const [detailSection, setDetailSection] = useState('biodata');

  const navArray = [
    {
      title: "Biodata",
      shortlink: "biodata"
    },
    {
      title: "Next of Kin Info",
      shortlink: "kin"
    },
    {
      title: "Bank Info",
      shortlink: "bank"
    },
    {
      title: "Employment Info",
      shortlink: "employ"
    },
    {
      title: "Loans",
      shortlink: "loans"
    },
  ]

  const setActiveTab = (link) => {
    setDetailSection(link);
  }

  return (
    <Dashboard sidebarRoutes={salesRoute} location={location}>
      <NavTabs navs={navArray} setActive={setActiveTab} currentTab={detailSection} />
      { userDetails || !detailStatus  ? 
        <div className={detailSection !== "loans" && styles.detailFields}>
          { detailSection === "biodata" && <Biodata data={userDetails && {...userDetails.bioData, ...userDetails.residence}} userId={userDetails?.clientId} /> }
          { detailSection === "kin" && <NextOfKin data={userDetails && { ...userDetails.nextOfKin }} /> }
          { detailSection === "bank" && <Bank data={userDetails && { ...userDetails.bank }} userId={userDetails?.clientId} /> }
          { detailSection === "employ" && <Employer userId={userDetails?.clientId} /> }
          { detailSection === "loans" && <ClientLoan userId={userDetails && userDetails.clientId} canApply={true} userRole={`${user.role}-agent`} /> }
        </div> :
        <Loader />
      }
    </Dashboard>
  )
}


export default ClientDetails;