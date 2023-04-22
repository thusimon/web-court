import { useContext, useRef } from "react";
import { AppContext } from "../context-provider";
import { Actions } from "../constants";

import './paginate.scss';

const Paginate = () => {
  const { state, dispatch } = useContext(AppContext);
  const inputPageSizeRef = useRef(null);
  const inputPageIndex = useRef(null);

  return <div className='paginate-container'>
    <label>Page Size</label>
    <input type='number' ref={inputPageSizeRef} max={1000} min={20} step={50} defaultValue={state.pageSize}></input>
    <button>Update</button>
    <label>Page Index</label>
    <button>‹‹</button>
    <button>‹</button>
    <input ref={inputPageIndex} readOnly defaultValue={state.pageIndex}></input>
    <button>›</button>
    <button>››</button>
  </div>
}

export default Paginate;
