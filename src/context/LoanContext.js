import createDataContext from "./createDataContext";
import gypsy from "../api/gypsy-web";
import resolveToken from "../utils/resolveToken";
import history from "../utils/history";
import _ from "lodash";

const loanReducer = (state, action) => {
  switch (action.type) {
    case "set_loading":
      return { ...state, loading: action.payload };
    case "set_error":
      return { ...state, error: action.payload };
    case "set_message":
      return { ...state, message: action.payload };
    case "set_application_stage":
      return { ...state, loanApplicationStage: action.payload };
    case "set_loan_list":
      return { ...state, loans: action.payload };
    case "set_current_loan":
      return { ...state, currentLoanId: action.payload };
    case "set_incomplete_state":
      return { ...state, incomplete: action.payload };
    case "set_loan_details":
      return { ...state, loanDetails: action.payload };
    default:
      return state;
  }
};

const loanApply = (dispatch) => async (applyData, userId, inModal) => {
  dispatch({ type: "set_loading", payload: true });
  dispatch({ type: "set_error", payload: null });
  try {
    const token = resolveToken();
    const response = await gypsy.post(
      `/client/loan/apply/${userId}`,
      applyData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response);
    dispatch({ type: "set_current_loan", payload: response.data.data.loanId });
    dispatch({ type: "set_application_stage", payload: "calculated" });
    dispatch({ type: "set_loading", payload: false });
    if (!inModal) {
      history.push("/dashboard/consumer-credit/apply/contact-info");
    }
  } catch (err) {
    if (err.response) {
      console.log(err.response.data);
      const errorMessage = err.response.data.error || err.response.data.message;
      if (
        errorMessage.toLowerCase() === "complete your previuos loan request"
      ) {
        // console.log(errorMessage);
        const { loanId, data: stage } = err.response.data.data;
        dispatch({ type: "set_current_loan", payload: loanId });
        dispatch({ type: "set_incomplete_state", payload: true });
        if (stage === "address") {
          dispatch({ type: "set_application_stage", payload: "calculated" });
        }
        if (stage === "work") {
          dispatch({ type: "set_application_stage", payload: "address_added" });
        }
        if (stage === "bank") {
          dispatch({
            type: "set_application_stage",
            payload: "employer_added",
          });
        }
      } else {
        dispatch({
          type: "set_error",
          payload: errorMessage,
        });
      }
    }
    dispatch({ type: "set_loading", payload: false });
  }
};

const resetApplyStage = (dispatch) => () => {
  dispatch({
    type: "set_application_stage",
    payload: null,
  });
};

const addAddressForLoan = (dispatch) => async (
  addressData,
  loanId,
  inModal
) => {
  dispatch({ type: "set_loading", payload: true });
  dispatch({ type: "set_error", payload: null });
  try {
    const token = resolveToken();
    const response = await gypsy.post(
      `/client/loan/address/${loanId}`,
      addressData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response);
    dispatch({ type: "set_application_stage", payload: "address_added" });
    dispatch({ type: "set_loading", payload: false });
    if (!inModal) {
      history.push("/dashboard/consumer-credit/apply/employer-info");
    }
  } catch (err) {
    if (err.response) {
      console.log(err.response.data);
      const errorMessage = err.response.data.error || err.response.data.message;
      dispatch({
        type: "set_error",
        payload: errorMessage,
      });
    }
    dispatch({ type: "set_loading", payload: false });
  }
};

const addWorkInfoForLoan = (dispatch) => async (workData, loanId, inModal) => {
  dispatch({ type: "set_loading", payload: true });
  dispatch({ type: "set_error", payload: null });
  try {
    const token = resolveToken();
    const response = await gypsy.post(`/client/loan/work/${loanId}`, workData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response);
    dispatch({ type: "set_application_stage", payload: "employer_added" });
    dispatch({ type: "set_loading", payload: false });
    if (!inModal) {
      history.push("/dashboard/consumer-credit/apply/bank-info");
    }
  } catch (err) {
    if (err.response) {
      console.log(err.response.data);
      const errorMessage = err.response.data.error || err.response.data.message;
      dispatch({
        type: "set_error",
        payload: errorMessage,
      });
    }
    dispatch({ type: "set_loading", payload: false });
  }
};

const addBankInfoForLoan = (dispatch) => async (
  bankData,
  loanId,
  callback,
  inModal
) => {
  dispatch({ type: "set_loading", payload: true });
  dispatch({ type: "set_error", payload: null });
  try {
    const token = resolveToken();
    const response = await gypsy.post(`/client/loan/bank/${loanId}`, bankData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response);
    dispatch({ type: "set_application_stage", payload: "bank_added" });
    if (callback) {
      callback();
    }
    dispatch({ type: "set_loading", payload: false });
    if (!inModal) {
      history.push("/dashboard/consumer-credit/success");
    }
  } catch (err) {
    if (err.response) {
      console.log(err.response.data);
      const errorMessage = err.response.data.error || err.response.data.message;
      dispatch({
        type: "set_error",
        payload: errorMessage,
      });
    }
    dispatch({ type: "set_loading", payload: false });
  }
};

const retrieveClientLoans = (dispatch) => async () => {
  dispatch({ type: "set_loading", payload: true });
  dispatch({ type: "set_error", payload: null });
  try {
    const token = resolveToken();
    const response = await gypsy.get("/client/loan/view", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    //
    dispatch({
      type: "set_loan_list",
      payload: _.reverse(response.data.data),
    });
    dispatch({ type: "set_loading", payload: false });
  } catch (err) {
    if (err.response) {
      console.log(err.response.data);
      const errorMessage = err.response.data.error || err.response.data.message;
      dispatch({
        type: "set_error",
        payload: errorMessage,
      });
      dispatch({ type: "set_loading", payload: false });
    }
  }
};

const retrieveLoan = (dispatch) => async (loanId) => {
  dispatch({ type: "set_loading", payload: true });
  try {
    const token = resolveToken();
    const response = await gypsy.get(`/client/loan/view/${loanId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data.data);
    dispatch({ type: "set_loan_details", payload: response.data.data });
    dispatch({ type: "set_loading", payload: false });
  } catch (err) {
    if (err.response) {
      console.log(err.response.data);
      const errorMessage = err.response.data.error || err.response.data.message;
      dispatch({
        type: "set_error",
        payload: errorMessage,
      });
      dispatch({ type: "set_loading", payload: false });
    }
  }
};

const sendOfferLetter = (dispatch) => async (loanId, sendData) => {
  dispatch({ type: "set_loading", payload: true });
  try {
    const token = resolveToken();
    const response = await gypsy.post(
      `/user/loan/offer_letter/${loanId}`,
      sendData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log(response.data);
    dispatch({
      type: "set_message",
      payload: response.data.message,
    });
    dispatch({ type: "set_loading", payload: false });
  } catch (err) {
    if (err.response) {
      console.log(err.response.data);
      const errorMessage = err.response.data.error || err.response.data.message;
      dispatch({
        type: "set_error",
        payload: errorMessage,
      });
      dispatch({ type: "set_loading", payload: false });
    }
  }
};

const clearError = (dispatch) => () => {
  dispatch({
    type: "set_error",
    payload: null,
  });
};

const clearCompleteState = (dispatch) => () => {
  dispatch({
    type: "set_incomplete_state",
    payload: false,
  });
};

const clearMessage = (dispatch) => () => {
  dispatch({
    type: "set_message",
    payload: null,
  });
};

const savePartialState = (state) => {
  const { currentLoanId } = state;
  sessionStorage.setItem(`gypsy-currentLoanId`, currentLoanId);
};

export const { Context, Provider } = createDataContext(
  loanReducer,
  {
    loanApply,
    addAddressForLoan,
    addWorkInfoForLoan,
    clearError,
    retrieveClientLoans,
    addBankInfoForLoan,
    clearCompleteState,
    resetApplyStage,
    retrieveLoan,
    sendOfferLetter,
    clearMessage,
  },
  {
    loading: false,
    error: null,
    loans: [],
    loanDetails: null,
    loanApplicationStage: null,
    currentLoanId: null,
    incomplete: false,
    message: null,
  },
  _,
  savePartialState
);
