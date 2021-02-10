import createDataContext from './createDataContext';
import gypsy from '../api/gypsy-web';
import resolveToken from '../utils/resolveToken';


const loanReducer = (state, action) => {
  switch(action.type) {
    case 'set_loading':
      return { ...state, loading: action.payload }
    case 'set_error':
      return { ...state, error: action.payload }
    case 'set_start_state':
      return { ...state, loanStart: action.payload }
    case 'set_address_status':
      return { ...state, addressStatus: action.payload }
    case 'set_work_status':
      return { ...state, workStatus: action.payload }
    default:
      return state; 
  }
}



const loanApply = dispatch => async(applyData, userId) => {
  dispatch({ type: "set_loading", payload: true });
  dispatch({ type: "set_error", payload: null });
  try {
    const token = resolveToken();
    const response = await gypsy.post(`/client/loan/apply/${userId}`, applyData, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    console.log(response);
    dispatch({
      type: 'set_start_state',
      payload: true
    });
    dispatch({ type: "set_loading", payload: false });
  } catch(err) {
    if(err.response) {
      console.log(err.response);
      dispatch({
        type: 'set_error',
        payload: err.response.message
      });
    }
    dispatch({ type: "set_loading", payload: false });
  }
}


const addAddressForLoan = dispatch => async(addressData, userId) => {
  dispatch({ type: "set_loading", payload: true });
  dispatch({ type: "set_error", payload: null });
  try {
    const token = resolveToken();
    const response = await gypsy.post(`/client/loan/address/${userId}`, addressData, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    console.log(response);
    dispatch({
      type: 'set_address_status',
      payload: true
    })
    dispatch({ type: "set_loading", payload: false });
  } catch(err) {
    if(err.response) {
      console.log(err.response);
      dispatch({
        type: 'set_error',
        payload: err.response.message
      })
    }
    dispatch({ type: "set_loading", payload: false });
  }
}


const addWorkInfoForLoan = dispatch => async(workData, userId) => {
  dispatch({ type: "set_loading", payload: true });
  dispatch({ type: "set_error", payload: null });
  try {
    const token = resolveToken()
    const response = await gypsy.post(`/client/loan/work/${userId}`, workData, {
      headers: {
        "Authorizaton": `Bearer ${token}`
      }
    });
    console.log(response);
    dispatch({
      type: "set_work_status",
      payload: true
    });
    dispatch({ type: "set_loading", payload: false })
  } catch(err) {
    if(err.response) {
      console.log(err.response)
      dispatch({
        type: 'set_error',
        payload: err.response.message
      });
    }
    dispatch({ type: "set_loading", payload: false })
  }
}


export const { Context, Provider } = createDataContext(
  loanReducer,
  { loanApply, addAddressForLoan, addWorkInfoForLoan },
  { loading: false, error: null, loans: [], loanDetails: null, loanStart: false, addressStatus: false, workStatus: false }
)