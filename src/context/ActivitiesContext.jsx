import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";

const ActivitiesContext = createContext();

const initialState = {
  activities: [],
  loading: false,
  error: null,
};

const actionTypes = {
  SET_ACTIVITIES: "SET_ACTIVITIES",
  ADD_ACTIVITY: "ADD_ACTIVITY",
  UPDATE_ACTIVITY: "UPDATE_ACTIVITY",
  DELETE_ACTIVITY: "DELETE_ACTIVITY",
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
};

function activitiesReducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_ACTIVITIES:
      return {
        ...state,
        activities: action.payload,
        loading: false,
      };
    case actionTypes.ADD_ACTIVITY:
      return {
        ...state,
        activities: [...state.activities, action.payload],
        loading: false,
      };
    case actionTypes.UPDATE_ACTIVITY:
      return {
        ...state,
        activities: state.activities.map((activity, index) =>
          index === action.payload.index ? action.payload.activity : activity
        ),
        loading: false,
      };
    case actionTypes.DELETE_ACTIVITY:
      return {
        ...state,
        activities: state.activities.filter(
          (_, index) => index !== action.payload
        ),
        loading: false,
      };
    case actionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case actionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
}

export function ActivitiesProvider({ children }) {
  const [state, dispatch] = useReducer(activitiesReducer, initialState);

  const setActivities = useCallback((activities) => {
    dispatch({ type: actionTypes.SET_ACTIVITIES, payload: activities });
  }, []);

  const addActivity = useCallback((activity) => {
    dispatch({ type: actionTypes.ADD_ACTIVITY, payload: activity });
  }, []);

  const updateActivity = useCallback((index, activity) => {
    dispatch({
      type: actionTypes.UPDATE_ACTIVITY,
      payload: { index, activity },
    });
  }, []);

  const deleteActivity = useCallback((index) => {
    dispatch({ type: actionTypes.DELETE_ACTIVITY, payload: index });
  }, []);

  const setLoading = useCallback((loading) => {
    dispatch({ type: actionTypes.SET_LOADING, payload: loading });
  }, []);

  const setError = useCallback((error) => {
    dispatch({ type: actionTypes.SET_ERROR, payload: error });
  }, []);

  const value = {
    ...state,
    setActivities,
    addActivity,
    updateActivity,
    deleteActivity,
    setLoading,
    setError,
  };

  return (
    <ActivitiesContext.Provider value={value}>
      {children}
    </ActivitiesContext.Provider>
  );
}

export function useActivities() {
  const context = useContext(ActivitiesContext);
  if (context === undefined) {
    throw new Error("useActivities must be used within an ActivitiesProvider");
  }
  return context;
}
