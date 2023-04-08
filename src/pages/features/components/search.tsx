import { useContext, useRef } from "react";
import { AppContext } from "../context-provider";
import { Actions } from "../constants";

import './search.scss';

const Search = () => {
  const { dispatch } = useContext(AppContext);
  const inputPropRef = useRef(null);
  const inputValueRef = useRef(null);

  const onSearchButtonClick = () => {
    if (!inputPropRef.current || !inputValueRef.current) {
      return;
    }
    const prop = inputPropRef.current.value;
    const value = inputValueRef.current.value;

    dispatch({
      type: Actions.UpdateSearch,
      data: {
        searchProp: prop,
        searchVal: value
      }
    });
  }
  return <div className='search-container'>
    <label>Property</label>
    <input placeholder='property' ref={inputPropRef}></input>
    <label>Value</label>
    <input placeholder='value' ref={inputValueRef}></input>
    <button onClick={onSearchButtonClick}>Search</button>
  </div>
}

export default Search;
