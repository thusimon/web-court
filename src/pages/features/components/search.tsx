import { useContext } from "react";
import { AppContext } from "../context-provider";

const Search = () => {
  const { state, dispatch } = useContext(AppContext);
  return <div className='feature-search-container'>
    <label>Property</label>
    <input placeholder='property'></input>
  </div>
}

export default Search;
