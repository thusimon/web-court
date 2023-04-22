import { useContext, useRef } from "react";
import { AppContext } from "../context-provider";
import { Actions } from "../constants";

import './paginate.scss';

const Paginate = () => {
  const { state, dispatch } = useContext(AppContext);
  const inputPageSizeRef = useRef(null);
  const inputPageIndex = useRef(null);

  const onUpdateButtonClicked = () => {
    if (!inputPageSizeRef.current) {
      return;
    }
    const pageSize = parseInt(inputPageSizeRef.current.value);
    dispatch({type: Actions.UpdatePageSize, data: { pageSize }});
  }

  const onPageIndexButtonClicked = (offset: number) => {
    let pageIndex = state.pageIndex;
    if(offset == 0) {
      pageIndex = 0;
    } else {
      pageIndex = Math.max(pageIndex + offset, 0);
    }
    dispatch({type: Actions.UpdatePageIndex, data: { pageIndex }});
  }

  return <div className='paginate-container'>
    <label>Page Size</label>
    <input type='number' ref={inputPageSizeRef} max={1000} min={50} step={50} defaultValue={state.pageSize}></input>
    <button onClick={onUpdateButtonClicked}>Update</button>
    <label>Page Index</label>
    <button onClick={() => onPageIndexButtonClicked(0)}>Reset</button>
    <button onClick={() => onPageIndexButtonClicked(-10)}>‹‹</button>
    <button onClick={() => onPageIndexButtonClicked(-1)}>‹</button>
    <input ref={inputPageIndex} readOnly value={state.pageIndex + 1}></input>
    <button onClick={() => onPageIndexButtonClicked(1)}>›</button>
    <button onClick={() => onPageIndexButtonClicked(10)}>››</button>
  </div>
}

export default Paginate;
