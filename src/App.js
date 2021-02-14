import './App.scss';
import { Router, Switch, Route } from 'react-router-dom';
import pageUrl from './routes/pageUrl';
import { 
  SignUp, 
  SignIn, 
  Profile, 
  CreditReport, 
  Overview, 
  ConsumerCredit, 
  OtpVerify, 
  HomePage, 
  Products, 
  AboutUs, 
  ContactPage,
  LoanCalculator,
  MonoWidget, 
  Faqs,
  AgentOverview,
  ClientListPage,
  LoanList,
  Support,
  ClientDetails,
  LoanDetail
} from './pages/pages';
import { Provider as AuthProvider } from './context/AuthContext';
import { Provider as UserProvider } from './context/UserContext';
import { Provider as BankProvider } from './context/BankCotext';
import { Provider as LoanProvider } from './context/LoanContext';
import ProtectedRoute from './routes/protectedroute/ProtectedRoute';
import history from './utils/history';



const RouteManager = () =>  {
  return (
    <div className="App">
      <Router history={history}>
        <Switch>
          <Route exact path={pageUrl.HOMEPAGE}><HomePage /></Route>
          <Route path={pageUrl.PRODUCTS_PAGE}><Products /></Route>
          <Route exact path={pageUrl.SIGNUP_PAGE}><SignUp /></Route>
          <Route exact path={pageUrl.SIGNIN_PAGE}><SignIn /></Route>
          <Route exact path={pageUrl.VERIFY_OTP_PAGE}><OtpVerify /></Route>
          <Route exact path={pageUrl.ABOUT_US_PAGE}><AboutUs /></Route>
          <Route exact path={pageUrl.CONTACT_PAGE}><ContactPage /></Route>
          <Route exact path={pageUrl.MONO_WIDGET_PAGE}><MonoWidget /></Route>
          <Route exact path={pageUrl.LOAN_CALCULATOR_PAGE}><LoanCalculator /></Route>
          <Route exact path={pageUrl.FAQ_PAGE}><Faqs /></Route>
          <ProtectedRoute exact path={pageUrl.PROFILE_PAGE}><Profile /></ProtectedRoute>
          <ProtectedRoute exact path={pageUrl.CREDIT_REPORT_PAGE}>
            <CreditReport />
          </ProtectedRoute>
          <ProtectedRoute exact path={pageUrl.DASHBOARD_HOMEPAGE}>
            <Overview />
          </ProtectedRoute>
          <ProtectedRoute path={pageUrl.CONSUMER_CREDIT_PAGE}>
            <ConsumerCredit />
          </ProtectedRoute>
          <ProtectedRoute path={pageUrl.SALES_AGENT_OVERVIEW}>
            <AgentOverview />
          </ProtectedRoute>
          <ProtectedRoute path={pageUrl.CLIENT_LIST_PAGE}>
            <ClientListPage />
          </ProtectedRoute>
          <ProtectedRoute path={pageUrl.CLIENT_DETAILS_PAGE}>
            <ClientDetails />
          </ProtectedRoute>
          <ProtectedRoute path={pageUrl.LOAN_LIST_PAGE}>
            <LoanList />
          </ProtectedRoute>
          <ProtectedRoute path={pageUrl.LOAN_DETAIL_PAGE}>
            <LoanDetail />
          </ProtectedRoute>
          <ProtectedRoute path={pageUrl.SUPPORT_PAGE}>
            <Support />
          </ProtectedRoute>
        </Switch>
      </Router>
    </div>
  );
}

const App = () => {
  return (
    <AuthProvider>
      <UserProvider>
        <BankProvider>
          <LoanProvider>
            <RouteManager />
          </LoanProvider>
        </BankProvider>
      </UserProvider>
    </AuthProvider>
  )
}

export default App;
