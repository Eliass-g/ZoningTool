import { React, useEffect } from "react";
import ZoningMap from "../components/ZoningMap/ZoningMap";
import { useDispatch, useSelector } from "react-redux";
import { getParcels } from "../features/zoning/zoningSlice";

const Home = () => {

  const dispatch = useDispatch();
  const { parcels, status } = useSelector((state) => state.zoning);

  useEffect(() => {
    if (status.parcels === "idle") {
      dispatch(getParcels());
    }
  }, [dispatch, status.parcels]);

  return (<div>
  {parcels &&
    <ZoningMap parcels={parcels}/>
  }
  </div>);
};

export default Home;
